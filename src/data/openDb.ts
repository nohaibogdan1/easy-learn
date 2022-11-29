/* eslint-disable */

import { tables } from '../db/tables';
import { DbState } from '../stores/db-store/store';

const openDb = ({
  setState
}: {
  setState: React.Dispatch<React.SetStateAction<DbState>>;
}): void => {
  const request = window.indexedDB.open('Bla1', 2);
  request.onerror = (event) => {
    console.log('Error', event);
  };

  request.onsuccess = (event) => {
    console.log('Here Susccess', event);
    setState((state) => ({ ...state, db: request.result }));
  };

  request.onupgradeneeded = (event: any) => {
    console.log('upgradee');

    event.currentTarget?.result?.createObjectStore(tables.CARDS, {
      keyPath: 'id',
      autoIncrement: true
    });

    event.currentTarget?.result?.createObjectStore(tables.DECKS, {
      keyPath: 'id',
      autoIncrement: true
    });

    event.currentTarget?.result?.createObjectStore(tables.CARDS_DECKS, {
      keyPath: 'id',
      autoIncrement: true
    });

    event.currentTarget?.result?.createObjectStore(tables.COURSES, {
      keyPath: 'id',
      autoIncrement: true
    });

    event.currentTarget?.result?.createObjectStore(tables.RECORDINGS, {
      keyPath: 'id',
      autoIncrement: true
    });
  };
};

export default openDb;
