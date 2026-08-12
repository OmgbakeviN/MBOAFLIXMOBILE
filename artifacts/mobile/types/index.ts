export type LocalizedText = {
  fr: string;
  en: string;
};

export type ContentType =
  | 'movie'
  | 'episode'
  | 'short';

export interface YouTubeSource {
  videoId: string;
  url: string;
  publishedAt?: string;
  viewCountAtExtraction?: number;
  category?: string;
  channelId?: string;
  channelName?: string;
  tags?: string[];
}

export interface MovieCredits {
  producer?: string;
  writer?: string;
  cinematography?: string;
  assistant?: string;
}

export interface Movie {
  id: string;
  title: string;
  genre: string;
  genres?: string[];
  year: number;
  rating?: number;
  duration: string;
  durationSeconds?: number;
  description: string;
  descriptionFr?: string;
  descriptionEn?: string;
  posterColor: string;
  accentColor: string;
  tags: string[];
  featured?: boolean;
  trending?: boolean;
  newRelease?: boolean;
  director?: string;
  cast?: string[];
  credits?: MovieCredits;
  contentType?: ContentType;
  productionId?: string;
  productionName?: string;
  seriesId?: string;
  seriesTitle?: string;
  seasonNumber?: number;
  episodeNumber?: number;
  thumbnail?: string;
  youtube?: YouTubeSource;
  trailerYoutube?: YouTubeSource;
  trailerThumbnail?: string;
  viewCount?: number;
  publishedAt?: string;
}

export interface SeriesSeason {
  seasonNumber: number;
  episodeIds: string[];
}

export interface Series {
  id: string;
  title: string;
  productionId: string;
  year: number;
  genres: string[];
  description: LocalizedText;
  thumbnail: string;
  trailerVideoId?: string;
  seasons: SeriesSeason[];
}

export interface Production {
  id: string;
  name: string;
  country: string;
  youtube: {
    channelId: string;
    channelName: string;
  };
  authorizedForMboaFlix: boolean;
  authorizationNote?: string;
  catalogSource: string;
  dataRetrievedAt: string;
}

export interface CultureItem {
  id: string;
  title: string;
  category: 'food' | 'music' | 'dance' | 'tradition' | 'art';
  description: string;
  color: string;
  icon: string;
}

export interface Category {
  id: string;
  label: string;
}

export interface FoodItem {
  id: string;
  name: string;
  description: string;
  region: string;
  color: string;
}
