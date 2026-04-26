/**
 * Generate favicon.ico and apple-touch-icon.png from the light SVG.
 * Outputs into src/ so 11ty's passthrough copy publishes them at the site root.
 *
 * Run: node scripts/generate-favicons.js
 */
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const pngToIco = require("png-to-ico").default;

const SRC = path.join(__dirname, "..", "src", "favicon-light.svg");
const OUT_DIR = path.join(__dirname, "..", "src");
const ICO_PATH = path.join(OUT_DIR, "favicon.ico");
const APPLE_PATH = path.join(OUT_DIR, "apple-touch-icon.png");
const ICO_SIZES = [16, 32, 48];
const APPLE_SIZE = 180;

async function main() {
  const svg = fs.readFileSync(SRC);

  const pngBuffers = await Promise.all(
    ICO_SIZES.map((size) =>
      sharp(svg, { density: 384 }).resize(size, size).png().toBuffer()
    )
  );
  const ico = await pngToIco(pngBuffers);
  fs.writeFileSync(ICO_PATH, ico);
  console.log(`Wrote ${path.relative(process.cwd(), ICO_PATH)} (${ICO_SIZES.join(", ")} px)`);

  await sharp(svg, { density: 384 }).resize(APPLE_SIZE, APPLE_SIZE).png().toFile(APPLE_PATH);
  console.log(`Wrote ${path.relative(process.cwd(), APPLE_PATH)} (${APPLE_SIZE}x${APPLE_SIZE})`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
