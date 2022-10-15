/* eslint-disable */
import { LEVELS } from './constants';

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
  questionSearch?: string;
}

interface Obj {
  [key: string]: string | number | undefined;
}

export type { NextSeeDate, Filter, SelectedLevels, Obj };
