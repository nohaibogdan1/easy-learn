/* eslint-disable */

import { tables } from '../db/tables';
import { DbState } from '../stores/db-store/store';
import { CardStored, CourseStored, DeckStored, CardDeckStored } from './interfaces';

const getAllGeneralData = ({
  table,
  state
}: {
  table: tables;
  state: DbState;
}): Promise<(CardStored | CourseStored | DeckStored | CardDeckStored)[]> => {
  return new Promise((acc, reject) => {
    const { db } = state;

    if (db) {
      try {
        const transaction = db.transaction(table, 'readwrite');
        const store = transaction.objectStore(table);
        const request = store.getAll();

        request.onerror = () => {
          console.log('Get From Store Error');
          reject('Err when getting data');
        };

        request.onsuccess = (event: any) => {
          console.log('res', request.result);
          acc(request.result);
        };
      } catch (err) {
        console.log('Error get from store', err);
        reject(err);
      }
    }
  });
};

export default getAllGeneralData;
