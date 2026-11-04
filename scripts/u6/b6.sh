#!/bin/sh
# Build one Unit 6 film: sh scripts/u6/b6.sh scripts/u6/f601_solutions.py
cd "$(dirname "$0")/../.."
python scripts/bsend.py scripts/common.py scripts/p2/lib.py scripts/u3/u3lib.py scripts/u4/u4lib.py scripts/u5/u5lib.py scripts/u6/u6lib.py "$1" | tail -c 600
