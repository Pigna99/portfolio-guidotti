export interface ContentImage {
  type: "image";
  src: string;
  srcset: string;
  width: number;
  height: number;
  alt?: string;
  alt_en?: string;
  caption?: string;
  caption_en?: string;
}

export interface ContentVideo {
  type: "video";
  videoId: string;
  caption?: string;
  caption_en?: string;
  alt?: string;
  alt_en?: string;
}

/** A media item in opera/esposizione image lists. */
export type MediaItem = ContentImage | ContentVideo;

export interface Opera {
  id: string;
  year: number;
  date: string;
  title: string;
  title_en?: string;
  description?: string;
  description_en?: string;
  /** Cover thumbnail (image only). */
  cover: ContentImage | null;
  /** Mixed list of images and videos shown in the lightbox. */
  media: MediaItem[];
}

export interface Esposizione {
  id: string;
  year: number;
  title: string;
  title_en?: string;
  description?: string;
  description_en?: string;
  venue?: string;
  venue_en?: string;
  /** YYYY, YYYY-MM, or YYYY-MM-DD */
  start_date?: string;
  end_date?: string;
  media: MediaItem[];
}

export interface PdfLinks {
  cv_it?: string;
  cv_en?: string;
  portfolio_it?: string;
  portfolio_en?: string;
}

export interface Manifest {
  generatedAt: string;
  carosello: ContentImage[];
  opere: Opera[];
  esposizioni: Esposizione[];
  pdfs: PdfLinks;
}
