import { useEffect } from 'react';
import useGetConnection from './useGetConnection';
import { QuestionAnswer, QuestionAnswerStored } from '../types';

const useDbMethods = () => {
  const db = useGetConnection();

  useEffect(() => {
    console.log('useDbMethods', db);
  }, [db]);

  const insert = (data: QuestionAnswer) => {
    if (db) {
      try {
        const transaction = db.transaction('questions', 'readwrite');
        const store = transaction.objectStore('questions');
        const request = store.add(data);

        request.onerror = () => {
          console.log('Add to Store Error');
        };

        request.onsuccess = (event: any) => {
          console.log('Add on store : success', event);
        };
      } catch (err) {
        console.log('Error add on store', err);
      }
    }
  };

  const get = (): Promise<QuestionAnswerStored[]> => {
    return new Promise((acc, reject) => {
      if (db) {
        try {
          const data: QuestionAnswerStored[] = [];

          const transaction = db.transaction('questions', 'readwrite');
          const store = transaction.objectStore('questions');
          const request = store.openCursor();

          request.onerror = () => {
            console.log('Get From Store Error');
          };

          request.onsuccess = (event: any) => {
            console.log('event', event);
            let cursor = event.target.result;
            if (cursor) {
              data.push(cursor.value);
              cursor.continue();
            } else {
              acc(data);
            }
          };
        } catch (err) {
          console.log('Error add on store', err);

          reject(err);
        }
      }
    });
  };

  const update = () => {};

  return {
    insert,
    get,
    update // todo: implement this one
  };
};

export default useDbMethods;
