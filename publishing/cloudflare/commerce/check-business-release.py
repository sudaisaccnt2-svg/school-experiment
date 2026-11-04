"""Prevent another lesson deployment from pairing stale business screens with the current backend."""
import argparse,hashlib,json,tomllib
from pathlib import Path
here=Path(__file__).resolve().parent.parent
def source_hashes():
    files=[here/'commerce'/name for name in ['api.mjs','play-billing.mjs','student-auth.mjs','owner-page.mjs','owner-markup.mjs','owner-access.mjs','owner-password.mjs','pricing.mjs']]
    files+=list((here/'functions').rglob('*.js'))
    return {path.relative_to(here).as_posix():hashlib.sha256(path.read_bytes()).hexdigest() for path in sorted(files)}
def runtime_vars():
    config=tomllib.loads((here/'wrangler.toml').read_text(encoding='utf-8'))
    return {'STUDENT_AUTH_MODE':config.get('vars',{}).get('STUDENT_AUTH_MODE')}
def check(report,allow_record=False):
    release=Path(report['releaseDirectory'])
    for path in (here/'commerce/public').iterdir():
        if not path.is_file():continue
        target=release/(path.name if path.suffix=='.html' else 'commerce/'+path.name)
        if not target.exists() or target.read_bytes()!=path.read_bytes():
            raise ValueError('Business screens changed after this snapshot. Rebuild from the pinned lesson release and test the new snapshot before publishing: '+path.name)
    hashes=source_hashes()
    if not report.get('businessSourceHashes') and not allow_record:
        raise ValueError('This snapshot has no verified business backend fingerprint. Rebuild and test it before publishing.')
    if report.get('businessSourceHashes') and report['businessSourceHashes']!=hashes:
        raise ValueError('Business backend changed after the snapshot was tested. Rebuild and verify before publishing.')
    if report.get('businessRuntimeVars') is not None and report['businessRuntimeVars']!=runtime_vars():
        raise ValueError('Student sign-in mode changed after the snapshot was tested. Preserve the tested runtime configuration.')
    return hashes
if __name__=='__main__':
    parser=argparse.ArgumentParser(description=__doc__);parser.add_argument('--report',type=Path,required=True);parser.add_argument('--record',action='store_true');args=parser.parse_args()
    report=json.loads(args.report.read_text(encoding='utf-8'))
    try:hashes=check(report,allow_record=args.record)
    except ValueError as error:raise SystemExit(str(error))
    if args.record:
        report['businessSourceHashes']=hashes;report['businessRuntimeVars']=runtime_vars();args.report.write_text(json.dumps(report,indent=2)+'\n',encoding='utf-8')
    print('Business screens and backend match the tested release.')
