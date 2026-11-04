"""Turn on 'text where the eyes are' for code lessons: capNear (caption floats above its thing, no bottom band) +
oneText (caption and labels take turns) + S() headroom for the floating line. Keeps a backup in backups/.
python scripts/near_on.py 801 802 ..."""
import os, re, shutil, sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
HEAD = "  h *= 1.14; look = [look[0], look[1] + 0.05 * h, look[2]];        // headroom: the caption floats just above the subject (capNear)\n"
for lid in sys.argv[1:]:
    p = os.path.join(ROOT, 'web', 'lesson', 'l%s.js' % lid); s = open(p, encoding='utf-8').read()
    if 'oneText' in s: print(lid, 'already on'); continue
    bk = os.path.join(ROOT, 'backups', 'l%s_preNear.js' % lid)
    if not os.path.exists(bk): shutil.copy(p, bk)
    m = re.search(r"\nfunction S\(t, look, w, h[^\n]*\n", s)
    assert m, (lid, 'no S()')
    near = 'capNear: true' in s
    if 'h *= 1.14' not in s: s = s[:m.end()] + HEAD + s[m.end():]
    m = re.search(r"\nexport default \{\n", s); assert m, (lid, 'no export default')
    s = s[:m.end()] + ("  oneText: true,\n" if near else "  capNear: true, oneText: true,\n") + s[m.end():]
    open(p, 'w', encoding='utf-8', newline='\n').write(s); print(lid, 'on')
