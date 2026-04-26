#!/usr/bin/env node
/**
 * Content build script.
 *
 * Reads source material from /content (gitignored) and produces:
 *   - /public/content/...  → optimised WebP at multiple widths (responsive)
 *   - /src/content/manifest.json → typed manifest consumed by the app
 *
 * Source structure (see content/README.md):
 *
 *   content/
 *     carosello/
 *       *.{jpg,jpeg,png,webp}
 *     opere/
 *       {anno}/{slug-opera}/
 *         opera.json
 *         *.{jpg,jpeg,png,webp}
 *     esposizioni/
 *       {anno}/{slug-mostra}/
 *         esposizione.json
 *         *.{jpg,jpeg,png,webp}
 *
 * Output WebP filenames are content-hashed, so re-running this script only
 * re-encodes images whose source bytes actually changed.
 */

import sharp from "sharp";
import {
  readdir,
  readFile,
  writeFile,
  mkdir,
  rm,
} from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const ROOT = path.resolve(import.meta.dirname, "..");
const CONTENT_SRC = path.join(ROOT, "content");
const PUBLIC_OUT = path.join(ROOT, "public", "content");
const MANIFEST_OUT = path.join(ROOT, "src", "content", "manifest.json");

const IMAGE_EXTS = new Set([".jpg", ".jpeg", ".png", ".webp"]);
const RESPONSIVE_WIDTHS = [400, 800, 1600, 2400];
const WEBP_QUALITY = 82;

const log = (...args) => console.log(...args);
const warn = (...args) => console.warn("⚠ ", ...args);

async function fileHash(filepath) {
  const buf = await readFile(filepath);
  return crypto.createHash("sha1").update(buf).digest("hex").slice(0, 10);
}

async function listFiles(dir, filter = () => true) {
  if (!existsSync(dir)) return [];
  const entries = await readdir(dir, { withFileTypes: true });
  return entries
    .filter((e) => e.isFile() && filter(e.name))
    .map((e) => path.join(dir, e.name));
}

async function listDirs(dir) {
  if (!existsSync(dir)) return [];
  const entries = await readdir(dir, { withFileTypes: true });
  return entries
    .filter((e) => e.isDirectory())
    .map((e) => ({ name: e.name, path: path.join(dir, e.name) }));
}

function isImage(name) {
  return IMAGE_EXTS.has(path.extname(name).toLowerCase());
}

function relPublic(absPath) {
  const rel = path.relative(path.join(ROOT, "public"), absPath);
  return "/" + rel.replace(/\\/g, "/");
}

function slugify(s) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Encode a single source image to multiple WebP widths under outDir.
 * Returns ContentImage shape ({ src, srcset, width, height }).
 */
async function processImage(srcPath, outDir) {
  await mkdir(outDir, { recursive: true });

  const baseName = slugify(path.basename(srcPath, path.extname(srcPath)));
  const hash = await fileHash(srcPath);
  const meta = await sharp(srcPath).metadata();
  const naturalWidth = meta.width ?? 0;
  const naturalHeight = meta.height ?? 0;

  if (!naturalWidth || !naturalHeight) {
    warn(`Cannot read dimensions: ${srcPath}`);
    return null;
  }

  const widths = new Set();
  for (const w of RESPONSIVE_WIDTHS) {
    if (w <= naturalWidth * 1.05) widths.add(w);
  }
  // Always include the original-ish size as the upper bound.
  widths.add(naturalWidth);

  const variants = [];
  for (const w of [...widths].sort((a, b) => a - b)) {
    const outName = `${baseName}-${w}-${hash}.webp`;
    const outPath = path.join(outDir, outName);
    if (!existsSync(outPath)) {
      await sharp(srcPath)
        .resize(w, null, { withoutEnlargement: true, fit: "inside" })
        .webp({ quality: WEBP_QUALITY })
        .toFile(outPath);
    }
    variants.push({ w, path: outPath });
  }

  const srcset = variants.map((v) => `${relPublic(v.path)} ${v.w}w`).join(", ");
  const src = relPublic(variants[variants.length - 1].path);
  return { src, srcset, width: naturalWidth, height: naturalHeight };
}

async function readJsonIfExists(filepath) {
  if (!existsSync(filepath)) return null;
  try {
    return JSON.parse(await readFile(filepath, "utf8"));
  } catch (err) {
    warn(`Invalid JSON in ${filepath}: ${err.message}`);
    return null;
  }
}

/**
 * For a folder of images + an optional metadata json, return ordered
 * ContentImage entries. JSON image order takes precedence; otherwise
 * filesystem alphabetical order is used.
 */
async function buildImageList(dir, info, outDir) {
  const diskFiles = await listFiles(dir, isImage);
  const diskByName = new Map(diskFiles.map((p) => [path.basename(p), p]));

  /** @type {{ file: string, meta?: Record<string, unknown> }[]} */
  let order;
  if (info && Array.isArray(info.images) && info.images.length > 0) {
    order = info.images.map((entry) =>
      typeof entry === "string"
        ? { file: entry }
        : { file: entry.file, meta: entry }
    );
  } else {
    order = [...diskFiles].sort().map((p) => ({ file: path.basename(p) }));
  }

  const images = [];
  for (const { file, meta } of order) {
    const srcPath = diskByName.get(file);
    if (!srcPath) {
      warn(`Image not found on disk: ${path.join(dir, file)}`);
      continue;
    }
    const processed = await processImage(srcPath, outDir);
    if (!processed) continue;
    images.push({
      ...processed,
      alt: meta?.alt,
      alt_en: meta?.alt_en,
      caption: meta?.caption,
      caption_en: meta?.caption_en,
    });
  }
  return images;
}

async function buildCarosello() {
  const dir = path.join(CONTENT_SRC, "carosello");
  if (!existsSync(dir)) return [];

  const info = await readJsonIfExists(path.join(dir, "carosello.json"));
  const outDir = path.join(PUBLIC_OUT, "carosello");
  const images = await buildImageList(dir, info, outDir);
  log(`✓ Carosello: ${images.length} images`);
  return images;
}

async function buildOpere() {
  const root = path.join(CONTENT_SRC, "opere");
  if (!existsSync(root)) return [];

  const yearDirs = await listDirs(root);
  const results = [];

  for (const yearDir of yearDirs.sort((a, b) => b.name.localeCompare(a.name))) {
    const year = parseInt(yearDir.name, 10);
    if (Number.isNaN(year)) {
      warn(`Skipping non-year dir: opere/${yearDir.name}`);
      continue;
    }

    const operaDirs = await listDirs(yearDir.path);
    for (const operaDir of operaDirs) {
      const info = await readJsonIfExists(path.join(operaDir.path, "opera.json"));
      if (!info) {
        warn(`Missing/invalid opera.json in opere/${year}/${operaDir.name}`);
      }

      const outDir = path.join(PUBLIC_OUT, "opere", String(year), operaDir.name);
      const images = await buildImageList(operaDir.path, info, outDir);
      if (images.length === 0) {
        warn(`No images found in opere/${year}/${operaDir.name}, skipping`);
        continue;
      }

      results.push({
        id: operaDir.name,
        year,
        date: info?.date ?? `${year}`,
        title: info?.title ?? operaDir.name,
        title_en: info?.title_en,
        description: info?.description,
        description_en: info?.description_en,
        cover: images[0],
        images,
      });
      log(`✓ Opera: ${year}/${operaDir.name} (${images.length} img)`);
    }
  }

  // Sort by year desc, then by date desc, then by title
  results.sort((a, b) => {
    if (a.year !== b.year) return b.year - a.year;
    const dateCmp = (b.date ?? "").localeCompare(a.date ?? "");
    if (dateCmp !== 0) return dateCmp;
    return a.title.localeCompare(b.title);
  });

  return results;
}

async function buildEsposizioni() {
  const root = path.join(CONTENT_SRC, "esposizioni");
  if (!existsSync(root)) return [];

  const yearDirs = await listDirs(root);
  const results = [];

  for (const yearDir of yearDirs.sort((a, b) => b.name.localeCompare(a.name))) {
    const year = parseInt(yearDir.name, 10);
    if (Number.isNaN(year)) {
      warn(`Skipping non-year dir: esposizioni/${yearDir.name}`);
      continue;
    }

    const expoDirs = await listDirs(yearDir.path);
    for (const expoDir of expoDirs) {
      const info = await readJsonIfExists(
        path.join(expoDir.path, "esposizione.json")
      );
      if (!info) {
        warn(
          `Missing/invalid esposizione.json in esposizioni/${year}/${expoDir.name}`
        );
      }

      const outDir = path.join(
        PUBLIC_OUT,
        "esposizioni",
        String(year),
        expoDir.name
      );
      const images = await buildImageList(expoDir.path, info, outDir);

      results.push({
        id: expoDir.name,
        year,
        title: info?.title ?? expoDir.name,
        title_en: info?.title_en,
        description: info?.description,
        description_en: info?.description_en,
        venue: info?.venue,
        venue_en: info?.venue_en,
        start_date: info?.start_date,
        end_date: info?.end_date,
        images,
      });
      log(
        `✓ Esposizione: ${year}/${expoDir.name} (${images.length} img)`
      );
    }
  }

  // Sort by year desc, then by start_date desc
  results.sort((a, b) => {
    if (a.year !== b.year) return b.year - a.year;
    return (b.start_date ?? "").localeCompare(a.start_date ?? "");
  });

  return results;
}

async function main() {
  log("Building content from", CONTENT_SRC);
  await mkdir(PUBLIC_OUT, { recursive: true });
  await mkdir(path.dirname(MANIFEST_OUT), { recursive: true });

  if (!existsSync(CONTENT_SRC)) {
    warn(`Source directory does not exist: ${CONTENT_SRC}`);
    warn("Creating empty manifest.");
  }

  const carosello = await buildCarosello();
  const opere = await buildOpere();
  const esposizioni = await buildEsposizioni();

  const manifest = {
    generatedAt: new Date().toISOString(),
    carosello,
    opere,
    esposizioni,
  };

  await writeFile(MANIFEST_OUT, JSON.stringify(manifest, null, 2) + "\n");
  log(`\n✓ Manifest: ${path.relative(ROOT, MANIFEST_OUT)}`);
  log(`  Carosello: ${carosello.length}`);
  log(`  Opere: ${opere.length}`);
  log(`  Esposizioni: ${esposizioni.length}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
