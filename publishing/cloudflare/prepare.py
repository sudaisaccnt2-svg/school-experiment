"""Make an isolated Cloudflare Pages release; never modify the shared web/ tree.

Run: python publishing/cloudflare/prepare.py
"""
import base64
import hashlib
import json
import re
import sys
import time
import zipfile
import argparse
from datetime import datetime, timezone
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent.parent
WEB = ROOT / 'web'
PUBLIC_EXTENSIONS = {'.html', '.js', '.css', '.json', '.webmanifest', '.glb', '.usdz',
                     '.hdr', '.wasm', '.bin', '.png', '.jpg', '.jpeg', '.webp', '.svg',
                     '.woff', '.woff2', '.ktx2', '.ogg', '.mp3', '.mp4'}
CORE_EXTENSIONS = {'.html', '.js', '.css', '.json', '.webmanifest', '.wasm', '.png', '.svg', '.woff', '.woff2'}
MAX_FILE_SIZE = 25 * 1024 * 1024


def inputs(root=WEB):
    result = []
    for path in sorted(root.rglob('*')):
        rel = path.relative_to(root)
        if any(part.startswith('.') or part == '__pycache__' for part in rel.parts):
            continue
        if path.is_symlink():
            raise ValueError('Refusing to publish a symbolic link: ' + str(rel))
        if not path.is_file() or path.suffix.lower() not in PUBLIC_EXTENSIONS:
            continue
        if rel.as_posix() in {'sw.js', 'offline.js', 'start.html', '_routes.json'} or rel.parts[0] == 'style':
            continue
        result.append(path)
    return result


def fingerprint(paths,root=WEB):
    return {path.relative_to(root).as_posix(): (path.stat().st_size, path.stat().st_mtime_ns) for path in paths}


def snapshot(root=WEB):
    for attempt in range(3):
        source = inputs(root)
        before = fingerprint(source,root)
        data = {path.relative_to(root).as_posix(): path.read_bytes() for path in source}
        if before == fingerprint(inputs(root),root):
            return data
        print('Source changed while copying; retrying snapshot...', flush=True)
        time.sleep(1)
    raise ValueError('Another agent is exporting files. Retry after that export finishes.')


def make_release(source=WEB,update_latest=True):
    data = snapshot(source)
    for required in ('index.html', 'home.html', 'games.html', 'films.json', 'app.js', 'ar.js'):
        if required not in data:
            raise ValueError('Missing entry point: ' + required)
    data['offline.js'] = (HERE / 'offline.js').read_bytes()
    if 'lesson/index.html' in data:
        lesson = data['lesson/index.html'].decode('utf-8')
        if 'src="../offline.js"' not in lesson:
            lesson = lesson.replace('</body>', '<script type="module" src="../offline.js"></script>\n</body>')
        data['lesson/index.html'] = lesson.encode('utf-8')
    data['404.html'] = (HERE / '404.html').read_bytes()

    # Publishing features are an overlay; the shared lesson/player source is never edited.
    commerce = HERE / 'commerce' / 'public'
    if commerce.exists():
        markup = (HERE / 'commerce' / 'control-room.html').read_text(encoding='utf-8')
        (HERE / 'commerce' / 'owner-markup.mjs').write_text('/* Generated private owner page; never a static asset. */\nexport default ' + json.dumps(markup, ensure_ascii=False) + ';\n', encoding='utf-8')
        for overlay in commerce.iterdir():
            if not overlay.is_file():
                continue
            destination = overlay.name if overlay.suffix == '.html' else 'commerce/' + overlay.name
            data[destination] = overlay.read_bytes()
        # The owner page is a server response, never a public/offline asset.
        data.pop('control-room.html', None)
        for page in ('index.html', 'home.html', 'games.html', 'lesson/index.html'):
            if page not in data:
                continue
            text = data[page].decode('utf-8')
            script = '<script type="module" src="/commerce/runtime.js"></script>'
            if script not in text:
                text = text.replace('</body>', script + '\n</body>')
            data[page] = text.encode('utf-8')

    # Update model versions only inside this snapshot, to match the exact uploaded files.
    versions = {}
    films = json.loads(data['films.json'])['films']
    for meta_name in {'scene.json', *(film['meta'] for film in films)}:
        if meta_name not in data:
            raise ValueError('Missing film metadata: ' + meta_name)
        meta = json.loads(data[meta_name])
        glb = meta.get('glb', 'models/rutherford.glb')
        if glb not in data:
            raise ValueError('Missing film model: ' + glb)
        version = hashlib.sha1(data[glb]).hexdigest()[:10]
        versions[glb] = version
        if meta.get('model_version') != version:
            meta['model_version'] = version
            data[meta_name] = json.dumps(meta, indent=1, ensure_ascii=False).encode('utf-8')
        for ar in (zone.get('ar') for zone in meta.get('zones', [])):
            if ar and ar not in data:
                raise ValueError('Missing AR scene: ' + ar)

    assets = []
    digest = hashlib.sha256()
    for rel, content in sorted(data.items()):
        if len(content) > MAX_FILE_SIZE:
            raise ValueError(f'{rel} exceeds the Cloudflare Pages 25 MiB file limit.')
        raw_hash = hashlib.sha256(content).digest()
        # Advertising libraries are served online after opt-in, never part of offline downloads.
        if rel.startswith('commerce/prebid-'):
            digest.update(rel.encode('utf-8')); digest.update(raw_hash)
            continue
        aliases = []
        if rel == 'index.html':
            aliases = ['./']
        elif rel.endswith('/index.html'):
            aliases = [rel.removesuffix('index.html'), rel.removesuffix('/index.html')]
        elif rel.endswith('.html'):
            aliases = [rel.removesuffix('.html')]
        assets.append({'url': rel + '?v=' + versions[rel] if rel in versions else rel,
                       'aliases': aliases, 'hash': raw_hash.hex(), 'size': len(content),
                       'integrity': 'sha256-' + base64.b64encode(raw_hash).decode('ascii'),
                       'core': Path(rel).suffix in CORE_EXTENSIONS})
        digest.update(rel.encode('utf-8')); digest.update(raw_hash)
    template = (HERE / 'sw-template.js').read_text(encoding='utf-8')
    headers = (HERE / '_headers').read_bytes()
    digest.update(template.encode('utf-8')); digest.update(headers)
    version = digest.hexdigest()[:12]
    worker = template.replace('__VERSION__', version).replace('__ASSETS__', json.dumps(assets, indent=1))
    data['sw.js'] = worker.encode('utf-8')
    data['_headers'] = headers
    if (HERE / 'functions').exists():
        data['_routes.json'] = json.dumps({'version':1,'include':['/api/*','/ads.txt','/app-ads.txt','/control-room','/control-room.html'],'exclude':[]}).encode('utf-8')
    if len(data) > 20000:
        raise ValueError('Release exceeds the Cloudflare Pages free-plan file limit.')

    releases = HERE / 'releases'
    releases.mkdir(exist_ok=True)
    release = releases / version
    if release.exists():
        existing = {p.relative_to(release).as_posix(): p.read_bytes() for p in release.rglob('*') if p.is_file()}
        if existing != data:
            raise ValueError('An existing release was edited. Use an unchanged immutable snapshot.')
    else:
        release.mkdir()
        for rel, content in data.items():
            target = release / rel
            target.parent.mkdir(parents=True, exist_ok=True)
            target.write_bytes(content)
    archive = releases / (version + '.zip')
    if not archive.exists():
        with zipfile.ZipFile(archive, 'w', zipfile.ZIP_DEFLATED, compresslevel=6) as bundle:
            for rel, content in sorted(data.items()):
                bundle.writestr(rel, content)

    core_bytes = sum(asset['size'] for asset in assets if asset['core'])
    total_bytes = sum(len(content) for content in data.values())
    report = {'createdAt': datetime.now(timezone.utc).isoformat(), 'version': version,
              'releaseDirectory': str(release), 'zipFile': str(archive), 'fileCount': len(data),
              'filmCount': len(films), 'coreBytes': core_bytes, 'totalBytes': total_bytes,
              'largestFileBytes': max(map(len, data.values())), 'dashboardUploadSupported': len(data) <= 1000,
              'fullDownloadsFor50000GB': round(total_bytes * 50000 / 1e9, 2),
              'sourceModified': False, 'sourceDirectory':str(source), 'browserTests': 'pending', 'published': False}
    if (HERE/'commerce/check-business-release.py').exists():
        import importlib.util
        spec=importlib.util.spec_from_file_location('business_release_guard',HERE/'commerce/check-business-release.py')
        guard=importlib.util.module_from_spec(spec);spec.loader.exec_module(guard)
        report['businessSourceHashes']=guard.source_hashes()
        report['businessRuntimeVars']=guard.runtime_vars()
    (releases / (version + '.json')).write_text(json.dumps(report, indent=2), encoding='utf-8')
    if update_latest:
        (HERE / 'latest.json').write_text(json.dumps(report, indent=2), encoding='utf-8')
    print(f'Release {version}: {len(data)} files, {len(films)} films, {total_bytes / 1e6:.1f} MB total')
    print(f'Initial offline app: {core_bytes / 1e6:.1f} MB; models and AR load on demand.')
    print('Upload folder:', release)
    print('Upload ZIP:', archive)


if __name__ == '__main__':
    try:
        parser=argparse.ArgumentParser(description=__doc__)
        parser.add_argument('--from-release',type=Path,help='Use a tested snapshot instead of the shared web tree.')
        parser.add_argument('--no-latest',action='store_true',help='Create an isolated release report without changing another agent\'s latest pointer.')
        options=parser.parse_args()
        make_release(options.from_release.resolve() if options.from_release else WEB,update_latest=not options.no_latest)
    except (OSError, ValueError, KeyError) as error:
        sys.exit('Release not prepared: ' + str(error))
