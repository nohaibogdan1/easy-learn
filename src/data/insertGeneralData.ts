/* eslint-disable */

import { DbState } from '../stores/db-store/store';
import { 
  CardAdd, 
  CourseAdd, 
  DeckAdd, 
  CardDeckAdd, 
  RecordingAdd,
  AuditAdd
} from './interfaces';
import { tables } from '../db/tables';

const insertGeneralData = ({
  state,
  data,
  table
}: {
  state: DbState;
  data: 
    CardAdd | 
    CourseAdd | 
    DeckAdd | 
    CardDeckAdd |
    RecordingAdd |
    AuditAdd;
  table: tables;
}): Promise<number> => {

  console.log("insertGeneralData", table)

  return new Promise((acc, reject) => {
    const { db } = state;
    if (db) {
      try {
        const transaction = db.transaction(table, 'readwrite');
        const store = transaction.objectStore(table);
        const request = store.add({ ...data, createdAt: new Date().getTime().toString() });

        request.onerror = () => {
          console.log('Add to Store Error');
          reject('Add to Store Error');
        };

        request.onsuccess = (event: any) => {
          console.log('Add on store : success', request.result);
          const storedDataId = parseInt(request.result.toString());
          if (isNaN(storedDataId)) {
            reject('stored data id is not number');
          }
          acc(storedDataId as number);
        };
      } catch (err) {
        console.log('Error add on store', err);
        reject('Add to store error');
      }
    }
    // reject('No Db');
  });
};

export default insertGeneralData;
