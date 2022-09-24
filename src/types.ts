/* eslint-disable */
import { LEVELS } from './constants';
import { Card } from './data/interfaces';

type NextSeeDate = {
  [LEVELS.EASY]: string;
  [LEVELS.MEDIUM]: string;
  [LEVELS.HARD]: string;
};

type SelectedLevels = {
  [LEVELS.EASY]: boolean;
  [LEVELS.MEDIUM]: boolean;
  [LEVELS.HARD]: boolean;
};

interface Filter {
  labels?: string[];
  nextSeeDate?: string;
}

interface Obj {
  [key: string]: string | number;
}

type ExcelRow = Partial<Card> & {
  labels?: string;
};

type ExcelRowSanitized = Card & {
  labels?: string;
};

export type { NextSeeDate, Filter, SelectedLevels, Obj, ExcelRow, ExcelRowSanitized };
