/* eslint-disable */

import { getDifferenceInDays } from './questionAnswer';
import { CardStored } from '../data/interfaces';

const filterCardsByNextSeeDate = async (
  qaList: CardStored[],
  nextSeeDate?: string | null
): Promise<CardStored[]> => {
  if (typeof nextSeeDate === 'undefined') {
    return qaList;
  }

  if (nextSeeDate === null) {
    return qaList.filter((qa) => !qa.nextSeeDate);
  }

  return qaList.filter(
    (qa) => qa.nextSeeDate && getDifferenceInDays(nextSeeDate, qa.nextSeeDate) === 0
  );
};

export { filterCardsByNextSeeDate };
