#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
WWW="$ROOT/app/src/main/assets/www"
mkdir -p "$WWW/models" "$WWW/mediapipe"

curl -fsSL -o "$WWW/models/face_landmarker.task" \
  "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task"

TMP=$(mktemp -d)
(
  cd "$TMP"
  npm pack @mediapipe/tasks-vision@0.10.21 >/dev/null
  tar -xzf mediapipe-tasks-vision-*.tgz
  cp package/wasm/vision_wasm_internal.wasm "$WWW/mediapipe/"
  cp package/wasm/vision_wasm_nosimd_internal.wasm "$WWW/mediapipe/"
  cp package/wasm/vision_wasm_internal.js "$WWW/mediapipe/"
  cp package/wasm/vision_wasm_nosimd_internal.js "$WWW/mediapipe/"
  cp package/vision_bundle.mjs "$WWW/mediapipe/"
)
rm -rf "$TMP"
echo "Assets ready under $WWW"
