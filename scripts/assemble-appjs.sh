#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC="$ROOT/app/src/main/assets/www/_src"
OUT="$ROOT/app/src/main/assets/www/app.js"
cat "$SRC/app.0.js" "$SRC/app.1.js" "$SRC/app.2.js" > "$OUT"
echo "Assembled $OUT ($(wc -c < "$OUT") bytes)"
