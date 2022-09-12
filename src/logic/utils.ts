/* eslint-disable */

import { LabelStored } from "../types";

const formatDate = (time: string): string => {
  return new Date(parseFloat(time)).toDateString();
};

const isTruthyValue = (value: any): boolean => {
  if (value === undefined || value === null) {
    return false;
  }

  if (typeof value === 'number') {
    if (isNaN(value) || value === 0) {
      return false;
    }
  }

  return true;
};

const sortLabelsAlphabetically = (l1: LabelStored, l2: LabelStored): number => {
  return l1.text[0].localeCompare(l2.text[0], 'en', { sensitivity: 'base' });
}

export { formatDate, isTruthyValue, sortLabelsAlphabetically };
