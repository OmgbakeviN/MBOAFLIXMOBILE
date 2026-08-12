import seriesData from './catalog/series.json';

import { Series } from '@/types';

export const SERIES =
  seriesData as unknown as Series[];

export const getSeriesById = (
  id?: string
) =>
  SERIES.find(
    (series) =>
      series.id === id
  );
