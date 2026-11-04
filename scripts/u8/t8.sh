#!/bin/sh
# Test-build Unit 8 films on a scratch copy (scratch_u8.blend in the project folder, so textures resolve) while the
# main file is busy: sh scripts/u8/t8.sh 801 "801 Metals" 100 400 ...   (builds, then previews the given frames)
cd "$(dirname "$0")/../.."
export TEMP="D:\_Asawera art\tmp" TMP="D:\_Asawera art\tmp" BGSEND_BLEND="$(pwd -W)/scratch_u8.blend"
id=$1; scene=$2; shift 2
S=scripts
python $S/bgsend.py $S/common.py $S/p2/lib.py $S/u3/u3lib.py $S/u4/u4lib.py $S/u5/u5lib.py $S/u6/u6lib.py $S/u7/u7lib.py \
  $S/v4lib.py $S/u8/u8lib.py $S/u8/f${id}_*.py 2>&1 | grep -v keentools | grep -E "FILM OK|Error|error|line [0-9]|Traceback" | tail -8
[ $# -gt 0 ] && python $S/p2/preview.py "$scene" "$@" --pct 30 --out u$id 2>&1 | tail -1
