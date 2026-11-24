#!/bin/zsh
# Convert extraction screenshots for the web: fold/element shots -> WebP q82 (full res),
# full-page shots -> JPEG q75 at 1440px width (WebP can't exceed 16383px height).
# Usage: tools/optimize_images.sh <brands_dir>
set -e
setopt null_glob
for png in "$1"/*/attuale/*.png; do
  base="${png%.png}"
  if [[ "$png" == *-full.png ]]; then
    [[ -f "$base.jpg" ]] && continue
    w=$(sips -g pixelWidth "$png" | awk '/pixelWidth/{print $2}')
    if (( w > 1440 )); then
      sips -s format jpeg -s formatOptions 75 --resampleWidth 1440 "$png" --out "$base.jpg" >/dev/null
    else
      sips -s format jpeg -s formatOptions 75 "$png" --out "$base.jpg" >/dev/null
    fi
  else
    [[ -f "$base.webp" ]] && continue
    cwebp -quiet -q 82 "$png" -o "$base.webp"
  fi
done
du -sh "$1"/*/attuale
