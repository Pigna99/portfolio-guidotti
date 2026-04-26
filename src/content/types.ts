export interface ContentImage {
  src: string;
  srcset: string;
  width: number;
  height: number;
  alt?: string;
  alt_en?: string;
  caption?: string;
  caption_en?: string;
}

export interface Opera {
  id: string;
  year: number;
  date: string;
  title: string;
  title_en?: string;
  description?: string;
  description_en?: string;
  /** Cover thumbnail (may be a dedicated file, not necessarily in `images`). */
  cover: ContentImage | null;
  /** Optional YouTube video id. If present, opens in the lightbox alongside images. */
  videoId?: string;
  images: ContentImage[];
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
  /** YYYY-MM (or YYYY-MM-DD) */
  start_date?: string;
  end_date?: string;
  videoId?: string;
  images: ContentImage[];
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
