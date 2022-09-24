/* eslint-disable */

import insertGeneralData from './insertGeneralData';
import { Filter } from '../types';
import { CardStored, CardAdd, CardModification } from './interfaces';
import { tables } from '../db/tables';
import { DbState } from '../stores/db-store/store';
import getAllGeneralData from './getAllGeneralData';
import { filterCardsByNextSeeDate } from '../logic/card';

const insertCardData = async ({
  data,
  state
}: {
  data: CardAdd;
  state: DbState;
}): Promise<number> => {
  const { question, answer } = data;
  return insertGeneralData({
    state,
    table: tables.CARDS,
    data: {
      question,
      answer,
      lastSawDate: null,
      nextSeeDate: null
    }
  });
};

const updateCardData = ({
  data,
  state
}: {
  data: CardModification;
  state: DbState;
}): Promise<void> => {
  const { db } = state;
  return new Promise((acc, reject) => {
    try {
      if (db) {
        const transaction = db.transaction(tables.CARDS, 'readwrite');
        const store = transaction.objectStore(tables.CARDS);
        const request = store.put(data);

        request.onerror = () => {
          console.log('Err in update');
          reject();
        };

        request.onsuccess = (event: any) => {
          console.log('Update on store : success', request.result);
          acc();
        };
      }
    } catch (err) {
      console.log('Err in update', err);
      reject();
    }
  });
};

const getAllCardsData = (state: DbState): Promise<CardStored[]> => {
  return getAllGeneralData({
    state,
    table: tables.CARDS
  }) as Promise<CardStored[]>;
};

const getAllCardsByFilterData = async ({
  filter,
  state
}: {
  filter: Filter;
  state: DbState;
}): Promise<CardStored[]> => {
  const { nextSeeDate } = filter;
  const qaList = await getAllCardsData(state);

  const qaListFilteredByNextSeeDate = await filterCardsByNextSeeDate(qaList, nextSeeDate);

  return qaListFilteredByNextSeeDate;
};

export { insertCardData, updateCardData, getAllCardsData, getAllCardsByFilterData };
