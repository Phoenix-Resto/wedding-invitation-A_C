"""Optional: crop transparent padding and convert source PNGs into WebP.

Requires Pillow: pip install Pillow
Usage: python scripts/convert_images.py path/to/first.png path/to/second.png
The ready-to-run project already includes both WebPs; running this is optional.
"""
from pathlib import Path
from sys import argv
from PIL import Image


def convert(source: Path, destination: Path) -> None:
    image = Image.open(source).convert("RGBA")
    bounds = image.getchannel("A").getbbox()
    if bounds is None:
        raise ValueError(f"Empty transparent image: {source}")
    padding = 3
    left, top, right, bottom = bounds
    bounds = (
        max(0, left - padding),
        max(0, top - padding),
        min(image.width, right + padding),
        min(image.height, bottom + padding),
    )
    image.crop(bounds).save(destination, format="WEBP", quality=87, method=6)
    print(f"{source} -> {destination}")


if __name__ == "__main__":
    if len(argv) != 3:
        raise SystemExit("Usage: python scripts/convert_images.py 1.png 2.png")
    root = Path(__file__).resolve().parents[1]
    convert(Path(argv[1]), root / "public/images/splash.webp")
    convert(Path(argv[2]), root / "public/images/cover.webp")
