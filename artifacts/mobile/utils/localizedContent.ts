import { TFunction } from 'i18next';

import i18n from '@/i18n';

import { CultureItem, FoodItem, Movie } from '@/types';

const normalise = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+(.)?/g, (_, char?: string) =>
      char ? char.toUpperCase() : ''
    );

export const categoryLabel = (
  t: TFunction,
  id: string,
  fallback: string
) =>
  t(`labels.categories.${id}`, {
    defaultValue: fallback,
  });

export const genreLabel = (
  t: TFunction,
  genre: string
) =>
  t(`labels.genres.${genre.toLowerCase()}`, {
    defaultValue: genre,
  });

export const tagLabel = (
  t: TFunction,
  tag: string
) =>
  t(`labels.tags.${normalise(tag)}`, {
    defaultValue: tag,
  });

export const movieDescription = (
  _t: TFunction,
  movie: Movie
) => {
  const language =
    i18n.resolvedLanguage ??
    i18n.language ??
    'en';

  if (language.startsWith('fr')) {
    return (
      movie.descriptionFr ??
      movie.description
    );
  }

  return (
    movie.descriptionEn ??
    movie.description
  );
};

export const contentTypeLabel = (
  t: TFunction,
  movie: Movie
) => {
  if (movie.contentType === 'episode') {
    return t('movie.episodeBadge', {
      number: movie.episodeNumber ?? '?',
    });
  }

  if (movie.contentType === 'short') {
    return t('movie.shortBadge');
  }

  return t('movie.movieBadge');
};

export const formatViews = (
  count?: number
) => {
  if (
    count === undefined ||
    count === null
  ) {
    return '';
  }

  if (count >= 1_000_000) {
    return `${(
      count / 1_000_000
    ).toFixed(
      count >= 10_000_000 ? 0 : 1
    )}M`;
  }

  if (count >= 1_000) {
    return `${(
      count / 1_000
    ).toFixed(
      count >= 10_000 ? 0 : 1
    )}K`;
  }

  return `${count}`;
};

export const cultureTitle = (
  t: TFunction,
  item: CultureItem
) =>
  t(`content.culture.${item.id}.title`, {
    defaultValue: item.title,
  });

export const cultureDescription = (
  t: TFunction,
  item: CultureItem
) =>
  t(
    `content.culture.${item.id}.description`,
    {
      defaultValue: item.description,
    }
  );

export const cultureCategoryLabel = (
  t: TFunction,
  category: CultureItem['category']
) => {
  const key =
    category === 'tradition'
      ? 'traditions'
      : category;

  return t(`culture.filters.${key}`, {
    defaultValue: category,
  });
};

export const foodDescription = (
  t: TFunction,
  food: FoodItem
) =>
  t(`content.food.${food.id}.description`, {
    defaultValue: food.description,
  });

export const foodRegion = (
  t: TFunction,
  food: FoodItem
) =>
  t(`content.food.${food.id}.region`, {
    defaultValue: food.region,
  });
