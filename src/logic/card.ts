/* eslint-disable */

import { getDifferenceInDays } from './questionAnswer';
import { CardStored, Sort } from '../data/interfaces';
import { FieldsForSorting } from '../constants';
import { Filter } from '../types';

const filterCardsByField = ({
  cards,
  filter
}: {
  cards: CardStored[];
  filter?: Filter;
}): CardStored[] => {
  if (!filter) {
    return cards;
  }

  const { nextSeeDate, questionSearch } = filter;

  if (typeof nextSeeDate === 'undefined' && !questionSearch?.trim()) {
    return cards;
  }

  if (nextSeeDate === null) {
    return cards.filter((c) => !c.nextSeeDate);
  }

  if (nextSeeDate) {
    return cards.filter(
      (c) => c.nextSeeDate && getDifferenceInDays(nextSeeDate, c.nextSeeDate) === 0
    );
  }

  if (questionSearch?.trim()) {
    return cards.filter((c) => c.question.includes(questionSearch.trim()));
  }

  return cards;
};

const sortCards = ({ cards, sort }: { cards: CardStored[]; sort?: Sort }): CardStored[] => {
  if (!sort || sort.field !== FieldsForSorting.createdAt) {
    return cards;
  }

  return cards.sort((c1, c2) => {
    const d1 = parseFloat(c1.createdAt);
    const d2 = parseFloat(c2.createdAt);

    if (isNaN(d1) || isNaN(d2)) {
      return 0;
    }

    return sort.asc ? d1 - d2 : d2 - d1;
  });
};

export { filterCardsByField, sortCards };
