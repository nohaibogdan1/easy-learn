import { useEffect } from "react";
import useGetConnection from "./useGetConnection";

// const openDb = async (): Promise<any> => {
//   return new Promise((acc, reject) => {
//     const request = window.indexedDB.open('Bla', 2);
//     let db = null;
//     request.onerror = (event) => {
//         console.log('Error', event)
//         reject('error')
//     }

//     request.onsuccess = (event) => {
//         console.log("Susccess", event)
//         // db = request.result;
//         acc(request.result);
//     }

//     request.onupgradeneeded = (event: any) => {
//         console.log("upgradee")

//         event.currentTarget?.result?.createObjectStore('questions', {
//             keyPath: "id",
//             autoIncrement: true,
//         });
//     }
//   })
// }

const useDbMethods = () => {
  const db = useGetConnection();

  useEffect(() => {
    console.log("useDbMethods", db);
  }, [db]);

  const insert = (data: string) => {
    if (db) {
      try {
        const transaction = db.transaction("questions", "readwrite");
        const store = transaction.objectStore("questions");
        const request = store.add({ prop: data });
        // const request = store.openCursor()

        request.onerror = () => {
          console.log("Add to Store Error");
        };

        request.onsuccess = (event: any) => {
          console.log("Add on store : success", event);

          // let cursor = event.target.result;

          // console.log('cursor',cursor)
        };
      } catch (err) {
        console.log("Error add on store", err);
      }
    }
  };

  const get = (): Promise<any> => {
    return new Promise((acc, reject) => {
      if (db) {
        try {
          const transaction = db.transaction("questions", "readwrite");
          const store = transaction.objectStore("questions");
          const request = store.openCursor();

          request.onerror = () => {
            console.log("Add to Store Error");
          };

          request.onsuccess = (event: any) => {
            console.log("Add on storde : success", event);

            let cursor = event.target.result;

            acc(cursor.value);

            // console.log('cursor',cursor)
          };
        } catch (err) {
          console.log("Error add on store", err);

          reject(err);
        }
      }
    });
  };

  const update = () => {};

  return {
    insert,
    get,
    update,
  };
};

export default useDbMethods;
