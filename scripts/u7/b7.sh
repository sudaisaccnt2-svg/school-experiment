#!/bin/sh
# Build one Unit 7 film: sh scripts/u7/b7.sh scripts/u7/f701_oxidation.py
cd "$(dirname "$0")/../.."
python scripts/bsend.py scripts/common.py scripts/p2/lib.py scripts/u3/u3lib.py scripts/u4/u4lib.py scripts/u5/u5lib.py scripts/u6/u6lib.py scripts/u7/u7lib.py "$1" | tail -c 600
