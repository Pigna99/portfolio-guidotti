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
  cover: ContentImage;
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
  images: ContentImage[];
}

export interface Manifest {
  generatedAt: string;
  carosello: ContentImage[];
  opere: Opera[];
  esposizioni: Esposizione[];
}
