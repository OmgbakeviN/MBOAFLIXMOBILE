import catalogData from './catalog/nf-production.json';

import {
  Movie,
  YouTubeSource,
} from '@/types';

interface CatalogRecord {
  id: string;
  type: 'movie' | 'episode' | 'short';
  title: string;
  description: {
    fr: string;
    en: string;
  };
  year: number;
  durationSeconds: number;
  genres: string[];
  productionId: string;
  director: string | null;
  cast: string[];
  credits: Movie['credits'];
  language: string;
  youtube: YouTubeSource;
  thumbnail: string;
  featured: boolean;
  trending: boolean;
  newRelease: boolean;
  series?: {
    id: string;
    title: string;
    seasonNumber: number;
    episodeNumber: number;
  };
  trailer?: {
    id: string;
    title: string;
    youtube: YouTubeSource;
    thumbnail: string;
    durationSeconds: number;
  };
}

const CATALOG =
  catalogData as unknown as CatalogRecord[];

const ACCENTS: Record<
  string,
  {
    poster: string;
    accent: string;
  }
> = {
  drama: {
    poster: '#170D08',
    accent: '#D4AF37',
  },
  comedy: {
    poster: '#171107',
    accent: '#E8B84E',
  },
  romance: {
    poster: '#190A11',
    accent: '#D8899D',
  },
  family: {
    poster: '#111408',
    accent: '#B8C86A',
  },
};

const titleCase = (
  value: string
) =>
  value
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map(
      (part) =>
        part.charAt(0).toUpperCase() +
        part.slice(1)
    )
    .join(' ');

const formatDuration = (
  seconds: number
) => {
  if (seconds < 60) {
    return `${seconds}s`;
  }

  const totalMinutes =
    Math.floor(seconds / 60);

  const hours =
    Math.floor(
      totalMinutes / 60
    );

  const minutes =
    totalMinutes % 60;

  if (hours > 0) {
    return minutes > 0
      ? `${hours}h ${minutes}m`
      : `${hours}h`;
  }

  return `${totalMinutes}m`;
};

const toMovie = (
  item: CatalogRecord
): Movie => {
  const firstGenre =
    item.genres[0] ?? 'drama';

  const palette =
    ACCENTS[firstGenre] ??
    ACCENTS.drama;

  return {
    id: item.id,
    title: item.title,

    genre:
      titleCase(firstGenre),

    genres:
      item.genres.map(
        titleCase
      ),

    year: item.year,

    duration:
      formatDuration(
        item.durationSeconds
      ),

    durationSeconds:
      item.durationSeconds,

    description:
      item.description.en,

    descriptionEn:
      item.description.en,

    descriptionFr:
      item.description.fr,

    posterColor:
      palette.poster,

    accentColor:
      palette.accent,

    tags:
      item.genres.map(
        titleCase
      ),

    featured:
      item.featured,

    trending:
      item.trending,

    newRelease:
      item.newRelease,

    director:
      item.director ??
      undefined,

    cast:
      item.cast,

    credits:
      item.credits,

    contentType:
      item.type,

    productionId:
      item.productionId,

    productionName:
      item.youtube.channelName ??
      'NF PRODUCTION TV',

    seriesId:
      item.series?.id,

    seriesTitle:
      item.series?.title,

    seasonNumber:
      item.series?.seasonNumber,

    episodeNumber:
      item.series?.episodeNumber,

    thumbnail:
      item.thumbnail,

    youtube:
      item.youtube,

    trailerYoutube:
      item.trailer?.youtube,

    trailerThumbnail:
      item.trailer?.thumbnail,

    viewCount:
      item.youtube
        .viewCountAtExtraction,

    publishedAt:
      item.youtube
        .publishedAt,
  };
};

export const MOVIES: Movie[] =
  CATALOG.map(toMovie);

export const MOVIES_ONLY =
  MOVIES.filter(
    (item) =>
      item.contentType ===
      'movie'
  );

export const SERIES_EPISODES =
  MOVIES.filter(
    (item) =>
      item.contentType ===
      'episode'
  );

export const SHORTS =
  MOVIES.filter(
    (item) =>
      item.contentType ===
      'short'
  );

export const FEATURED_MOVIE: Movie =
  MOVIES_ONLY.find(
    (item) => item.featured
  ) ??
  MOVIES.find(
    (item) => item.featured
  ) ??
  MOVIES[0];

const byViews = (
  a: Movie,
  b: Movie
) =>
  (b.viewCount ?? 0) -
  (a.viewCount ?? 0);

const curatedTrending =
  MOVIES
    .filter(
      (item) =>
        item.trending
    )
    .sort(byViews);

const remainingByViews =
  MOVIES
    .filter(
      (item) =>
        !item.trending
    )
    .sort(byViews);

export const TRENDING =
  [
    ...curatedTrending,
    ...remainingByViews,
  ].slice(0, 6);

export const NEW_RELEASES =
  [...MOVIES]
    .sort((a, b) =>
      (
        b.publishedAt ?? ''
      ).localeCompare(
        a.publishedAt ?? ''
      )
    )
    .slice(0, 8);

export const DOCUMENTARIES =
  MOVIES.filter(
    (item) =>
      item.genre.toLowerCase() ===
      'documentary'
  );
