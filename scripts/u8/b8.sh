#!/bin/sh
# Build one Unit 8 film with Blender open: sh scripts/u8/b8.sh scripts/u8/f801_metals.py
# (no Blender window: python scripts/v4_batch.py u8 801)
cd "$(dirname "$0")/../.."
python scripts/bsend.py scripts/common.py scripts/p2/lib.py scripts/u3/u3lib.py scripts/u4/u4lib.py scripts/u5/u5lib.py scripts/u6/u6lib.py scripts/u7/u7lib.py scripts/v4lib.py scripts/u8/u8lib.py scripts/v5lib.py "$1" | tail -c 600
