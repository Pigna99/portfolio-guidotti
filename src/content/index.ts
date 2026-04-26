import manifestJson from "./manifest.json";
import type { Manifest } from "./types";

export const manifest = manifestJson as Manifest;
export const carosello = manifest.carosello;
export const opere = manifest.opere;
export const esposizioni = manifest.esposizioni;
export const pdfs = manifest.pdfs ?? {};

export type { ContentImage, Opera, Esposizione, PdfLinks } from "./types";
