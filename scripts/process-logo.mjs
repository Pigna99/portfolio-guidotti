import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const SRC = path.join(ROOT, "docs", "logo.png");
const PUBLIC_DIR = path.join(ROOT, "public");
const APP_DIR = path.join(ROOT, "src", "app");

const ROSA = { r: 0xef, g: 0xd4, b: 0xcb, alpha: 1 };
const ROSSO_VIVO = { r: 0xd0, g: 0x2c, b: 0x00, alpha: 1 };

/** Trim source to bounding box of non-transparent pixels. Preserves alpha. */
async function trimmedBuffer() {
  return sharp(SRC).trim().png().toBuffer();
}

async function makeFavicon(outPath, size, bg) {
  const trimmed = await trimmedBuffer();
  const skull = await sharp(trimmed)
    .resize(Math.round(size * 0.7), Math.round(size * 0.7), {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();

  await sharp({
    create: { width: size, height: size, channels: 4, background: bg },
  })
    .composite([{ input: skull, gravity: "center" }])
    .png()
    .toFile(outPath);
  console.log("→", path.relative(ROOT, outPath));
}

async function main() {
  await mkdir(PUBLIC_DIR, { recursive: true });

  // In-app logo: just cropped to its non-transparent bounding box.
  // Original transparency is preserved — no pixel modification.
  const skullOut = path.join(PUBLIC_DIR, "skull.png");
  await sharp(await trimmedBuffer()).toFile(skullOut);
  console.log("→", path.relative(ROOT, skullOut));

  // Favicons: skull centered on colored backgrounds.
  await makeFavicon(path.join(APP_DIR, "icon.png"), 512, ROSA);
  await makeFavicon(path.join(APP_DIR, "apple-icon.png"), 180, ROSSO_VIVO);

  console.log("\nDone.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
