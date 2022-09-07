import { useEffect, useState } from 'react';

const useGetConnection = () => {
  const [db, setDb] = useState<IDBDatabase | null>(null);

  const openDb = () => {
    const request = window.indexedDB.open('Bla1', 2);
    request.onerror = (event) => {
      console.log('Error', event);
    };

    request.onsuccess = (event) => {
      console.log('Susccess', event);
      setDb(request.result);
      // db = request.result;
    };

    request.onupgradeneeded = (event: any) => {
      console.log('upgradee');

      event.currentTarget?.result?.createObjectStore('questions', {
        keyPath: 'id',
        autoIncrement: true
      });
    };
  };

  useEffect(() => {
    openDb();
  }, []);

  return db;
};

export default useGetConnection;
