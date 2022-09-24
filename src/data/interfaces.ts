/* eslint-disable */

import { LEVELS } from '../constants';

interface Card {
  question: string;
  answer: string;
  lastSawDate: string | null;
  nextSeeDate: string | null;
  level: LEVELS;
}

interface CardAdd {
  question: string;
  answer: string;
  lastSawDate?: string | null;
  nextSeeDate?: string | null;
}

type CardStored = Card & {
  id: number;
};

type CardModification = Partial<CardStored>;

export type { Card, CardAdd, CardStored, CardModification };
