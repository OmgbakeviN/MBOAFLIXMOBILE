import type { ImageSourcePropType } from 'react-native';

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

export interface ContentSource {
  label: string;
  url: string;
}

export interface ImageAttribution {
  sourceUrl: string;
  author?: string;
  license: string;
  licenseUrl?: string;
}

export type CultureCategory =
  | 'music'
  | 'dance'
  | 'tradition'
  | 'festival'
  | 'art'
  | 'heritage'
  | 'historical_place';

export interface CultureItem {
  id: string;
  title: LocalizedText;
  category: CultureCategory;
  description: LocalizedText;
  region?: LocalizedText;
  color: string;
  icon: string;
  image: ImageSourcePropType;
  imageAttribution: ImageAttribution;
  sources: ContentSource[];
}

export interface Category {
  id: string;
  label: string;
}

export interface FoodItem {
  id: string;
  name: string;
  description: LocalizedText;
  region?: LocalizedText;
  category:
    | 'main'
    | 'side'
    | 'street_food'
    | 'snack'
    | 'drink';
  ingredients: LocalizedText;
  color: string;
  image: ImageSourcePropType;
  imageAttribution: ImageAttribution;
  sources: ContentSource[];
}

export interface EditorialDocumentary {
  id: string;
  title: LocalizedText;
  description: LocalizedText;
  category:
    | 'history'
    | 'geography'
    | 'wildlife'
    | 'arts'
    | 'cinema'
    | 'heritage';
  region?: LocalizedText;
  image: ImageSourcePropType;
  imageAttribution: ImageAttribution;
  sources: ContentSource[];
  youtube?: YouTubeSource;
}
