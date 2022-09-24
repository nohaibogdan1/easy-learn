/* eslint-disable */

import { tables } from '../db/tables';
import { DbState } from '../stores/db-store/store';

const deleteGeneralEntry = ({
  id,
  table,
  state
}: {
  id: number;
  table: tables;
  state: DbState;
}): Promise<void> => {
  const { db } = state;
  return new Promise((acc, reject) => {
    try {
      if (db) {
        const transaction = db.transaction(table, 'readwrite');
        const store = transaction.objectStore(table);
        const request = store.delete(id);

        request.onerror = () => {
          console.log('Error at delete entry');
          reject('Error at delete entry');
        };

        request.onsuccess = (event: any) => {
          console.log('Success at delete entry');
          acc();
        };
      }
    } catch (err) {
      console.log('Error at delete entry', err);
      reject('Error at delete entry');
    }
  });
};

export default deleteGeneralEntry;
