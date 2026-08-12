import productionData from './catalog/productions.json';

import { Production } from '@/types';

export const PRODUCTIONS =
  productionData as unknown as Production[];

export const NF_PRODUCTION =
  PRODUCTIONS[0];

export const getProductionById = (
  id?: string
) =>
  PRODUCTIONS.find(
    (production) =>
      production.id === id
  );
