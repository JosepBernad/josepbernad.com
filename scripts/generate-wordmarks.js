/**
 * Generate the four "JOSEP BERNAD" wordmark SVGs into src/press-kit-source/.
 *
 * Title (JOSEP BERNAD) is rendered as outlined paths (fill="none", stroke="currentColor").
 * Subtitle is rendered as filled paths (fill="currentColor").
 *
 * Both colors use currentColor so the press-kit build script (build-presskit.js)
 * can swap to black/white at output time.
 *
 * Font: Sedan (site font), loaded from src/css/fonts/sedan-regular-latin.woff2,
 * decompressed to TTF in-memory and parsed with opentype.js.
 *
 * Run: node scripts/generate-wordmarks.js
 */
const fs = require("fs");
const path = require("path");
const opentype = require("opentype.js");
const wawoff = require("wawoff2");

const FONT_WOFF2 = path.join(
  __dirname,
  "..",
  "src",
  "css",
  "fonts",
  "sedan-regular-latin.woff2"
);
const OUT_DIR = path.join(__dirname, "..", "src", "press-kit-source");

const TITLE = "JOSEP BERNAD";
const TITLE_FONT_SIZE = 220;
const TITLE_LETTER_SPACING = 0.05;
const TITLE_STROKE_WIDTH = 9;

const SUB_FONT_SIZE = 79;
const SUB_LETTER_SPACING = 0.05;
const SUB_STROKE_WIDTH = 1;
const SUB_GAP = 0;

const SIDE_PAD = 40;
const TOP_PAD = 30;
const BOTTOM_PAD = 30;

const VARIANTS = [
  { name: "wordmark", subtitle: null },
  { name: "wordmark-dj", subtitle: "DJ Set" },
  { name: "wordmark-live", subtitle: "Live Set" },
  { name: "wordmark-dj-live", subtitle: "Live & DJ Set" },
  { name: "wordmark-software", subtitle: "Software" },
  { name: "wordmark-eng-en", subtitle: "Software Engineering & Projects", subFontSize: 80, subLetterSpacing: 0.1 },
  { name: "wordmark-eng-es", subtitle: "Ingeniería de Software y Proyectos", subFontSize: 80, subLetterSpacing: 0.1 },
  { name: "wordmark-eng-ca", subtitle: "Enginyeria de Software i Projectes", subFontSize: 80, subLetterSpacing: 0.1 },
];

function measureLine(font, text, fontSize, letterSpacing) {
  const advanceUnits = font.getAdvanceWidth(text, fontSize, {
    letterSpacing,
  });
  return advanceUnits;
}

function renderLineToPathData(font, text, fontSize, letterSpacing, originX, baselineY) {
  const otPath = font.getPath(text, originX, baselineY, fontSize, {
    letterSpacing,
  });
  return otPath.toPathData(2);
}

function buildSvg(font, variant) {
  const subtitle = variant.subtitle;
  const subFontSize = variant.subFontSize || SUB_FONT_SIZE;
  const subLetterSpacing = variant.subLetterSpacing != null ? variant.subLetterSpacing : SUB_LETTER_SPACING;

  const titleAdvance = measureLine(font, TITLE, TITLE_FONT_SIZE, TITLE_LETTER_SPACING);
  const subAdvance = subtitle
    ? measureLine(font, subtitle, subFontSize, subLetterSpacing)
    : 0;

  const contentWidth = Math.max(titleAdvance, subAdvance);
  const width = Math.ceil(contentWidth + SIDE_PAD * 2);

  const titleAscender = (font.ascender / font.unitsPerEm) * TITLE_FONT_SIZE;
  const titleDescender = (Math.abs(font.descender) / font.unitsPerEm) * TITLE_FONT_SIZE;

  const subAscender = subtitle
    ? (font.ascender / font.unitsPerEm) * subFontSize
    : 0;
  const subDescender = subtitle
    ? (Math.abs(font.descender) / font.unitsPerEm) * subFontSize
    : 0;

  const titleBaselineY = TOP_PAD + titleAscender;
  const subBaselineY = subtitle
    ? titleBaselineY + titleDescender + SUB_GAP + subAscender
    : 0;

  const totalHeight = subtitle
    ? subBaselineY + subDescender + BOTTOM_PAD
    : titleBaselineY + titleDescender + BOTTOM_PAD;

  const height = Math.ceil(totalHeight);

  const titleOriginX = (width - titleAdvance) / 2;
  const subOriginX = subtitle ? (width - subAdvance) / 2 : 0;

  const titlePath = renderLineToPathData(
    font,
    TITLE,
    TITLE_FONT_SIZE,
    TITLE_LETTER_SPACING,
    titleOriginX,
    titleBaselineY
  );

  const subPath = subtitle
    ? renderLineToPathData(
        font,
        subtitle,
        subFontSize,
        subLetterSpacing,
        subOriginX,
        subBaselineY
      )
    : null;

  const parts = [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">`,
    `  <path d="${titlePath}" fill="currentColor" stroke="currentColor" stroke-width="${TITLE_STROKE_WIDTH}" stroke-linejoin="round"/>`,
  ];
  if (subPath) {
    parts.push(`  <path d="${subPath}" fill="currentColor" stroke="currentColor" stroke-width="${SUB_STROKE_WIDTH}" stroke-linejoin="round"/>`);
  }
  parts.push("</svg>", "");
  return parts.join("\n");
}

async function loadFont() {
  const woff2 = fs.readFileSync(FONT_WOFF2);
  const ttf = await wawoff.decompress(woff2);
  return opentype.parse(Buffer.from(ttf).buffer);
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const font = await loadFont();
  for (const v of VARIANTS) {
    const svg = buildSvg(font, v);
    const out = path.join(OUT_DIR, `${v.name}.svg`);
    fs.writeFileSync(out, svg);
    console.log(`Wrote ${path.relative(process.cwd(), out)}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
