import React, { createContext, useContext, PropsWithChildren, useState, ReactElement, useEffect } from 'react';

import { tables } from '../../db/tables';
import {  QuestionAnswer,
  QuestionAnswerStored,
  Label,
  LabelStored,
  AssociatedLabel,
  QuestionAnswerInsertion,
  QuestionAnswerAdd,
  AssociatedLabels,
  QuestionAnswerLabel,
  QuestionAnswerModification,
  QuestionAnswerLabelStored,
  Filter } from '../../types';

import { getDifferenceInDays } from '../../logic/questionAnswer';


type DbState = {
  db: IDBDatabase | null;
}

export type IDbContext = {
  state: DbState,
  insertQuestionAnswer: (data: QuestionAnswerAdd) => Promise<number>,
  insertLabels: (data: AssociatedLabels) => Promise<void> ,
  insertLabel: (data: AssociatedLabel) => Promise<void>,
  getAllQuestionAnswers: () => Promise<QuestionAnswerStored[]>,
  updateQuestionAnswer: (data: QuestionAnswerModification) => Promise<void>,
  findLabelByText: (text: string) => Promise<number | undefined>,
  addLabelToQuestionAnswer: (data: QuestionAnswerLabel) => Promise<void> ,
  getAllQuestionAnswersByFilter: (filter: Filter) => Promise<QuestionAnswerStored[]>,
  removeLabelsFromQA: ({
    questionAnswerId,
    labels
  }: {
    questionAnswerId: number;
    labels: string[];
  }) => Promise<void>,
  getAllLabels: () => Promise<LabelStored[]>,
  insertOnlyLabel: (data: Label) => Promise<number>,
  insertQALabel: (data: {
    questionAnswerId: number;
    labelId: number;
  }) => Promise<number>
};

const initialDbState = {
  db: null
}

const defaultValue = {
  state: initialDbState
}

export const DbContext = createContext(defaultValue as IDbContext);

export const useDbStore = (): IDbContext => useContext(DbContext);

export const DbStoreProvider = ({
  children,
}: PropsWithChildren<Record<string, unknown>>): ReactElement => {

  const [state, setState] = useState<DbState>(initialDbState);

  const openDb = () => {
    const request = window.indexedDB.open('Bla1', 2);
    request.onerror = (event) => {
      console.log('Error', event);
    };

    request.onsuccess = (event) => {
      console.log('Here Susccess', event);
      setState((state) => ({...state, db: request.result}));
    };

    request.onupgradeneeded = (event: any) => {
      console.log('upgradee');

      event.currentTarget?.result?.createObjectStore(tables.QUESTIONS_ANSWERS, {
        keyPath: 'id',
        autoIncrement: true
      });

      event.currentTarget?.result?.createObjectStore(tables.LABELS, {
        keyPath: 'id',
        autoIncrement: true
      });

      event.currentTarget?.result?.createObjectStore(tables.QUESTIONS_ANSWERS_LABELS, {
        keyPath: 'id',
        autoIncrement: true
      });
    };
  };


  const insertData = (
    data: QuestionAnswer | Label | QuestionAnswerLabel,
    table: tables
  ): Promise<number> => {
    return new Promise((acc, reject) => {
      const { db } = state;
      if (db) {
        try {
          const transaction = db.transaction(table, 'readwrite');
          const store = transaction.objectStore(table);
          const request = store.add(data);

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

  const insertQuestionAnswer = (data: QuestionAnswerAdd): Promise<number> => {
    const { question, answer } = data;

    return new Promise((acc, reject) => {
      insertData(
        {
          question,
          answer,
          lastSawDate: null,
          nextSeeDate: null
        },
        tables.QUESTIONS_ANSWERS
      )
        .then((insertedData) => {
          // console.log('insertQuestionAnswer: insertedData', insertedData);
          acc(insertedData);
        })
        .catch((err) => {
          console.log('insertQuestionAnswer erro', err);
          reject(`Error: ${err}`);
        });
    });
  };

  const insertLabel = (data: AssociatedLabel): Promise<void> => {
    return new Promise((acc, reject) => {
      const { questionAnswerId, text } = data;

      insertData(
        {
          text
        },
        tables.LABELS
      )
        .then((labelId) => {
          insertData(
            {
              questionAnswerId,
              labelId
            },
            tables.QUESTIONS_ANSWERS_LABELS
          )
            .then(() => {
              acc();
            })
            .catch(() => {
              reject();
            });
        })
        .catch((err) => {
          console.log('Error Insert Label', err);
          reject();
        });
    });
  };

  const insertOnlyLabel = async (data: Label): Promise<number> => {
    const { text } = data;
    return insertData({ text }, tables.LABELS);
  };

  const insertQALabel = async (data: {
    questionAnswerId: number;
    labelId: number;
  }): Promise<number> => {
    return insertData(data, tables.QUESTIONS_ANSWERS_LABELS);
  };

  const insertLabels = (data: AssociatedLabels): Promise<void> => {
    return new Promise((acc, reject) => {
      const promises: Promise<void>[] = [];
      for (const l of data.labels) {
        const promise = insertLabel({
          questionAnswerId: data.questionAnswerId,
          text: l.text
        });
        promises.push(promise);
      }
      Promise.all(promises)
        .then(() => acc())
        .catch(() => reject());
    });
  };

  const getAll = (
    table: tables
  ): Promise<(QuestionAnswerStored | LabelStored | QuestionAnswerLabelStored)[]> => {
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

  const getAllQuestionAnswers = (): Promise<QuestionAnswerStored[]> => {
    return getAll(tables.QUESTIONS_ANSWERS) as Promise<QuestionAnswerStored[]>;
  };

  const getAllLabels = async (): Promise<LabelStored[]> => {
    console.log('getAllLabels')
    const a = await getAll(tables.LABELS);

    console.log('a', a)

    return a as LabelStored[];
    // return getAll(tables.LABELS) as Promise<LabelStored[]>;
  };

  const getAllQuestionAnswersLabels = (): Promise<QuestionAnswerLabelStored[]> => {
    return getAll(tables.QUESTIONS_ANSWERS_LABELS) as Promise<QuestionAnswerLabelStored[]>;
  };

  const updateQuestionAnswer = (data: QuestionAnswerModification): Promise<void> => {
    const { db } = state;
    return new Promise((acc, reject) => {
      try {
        if (db) {
          const transaction = db.transaction(tables.QUESTIONS_ANSWERS, 'readwrite');
          const store = transaction.objectStore(tables.QUESTIONS_ANSWERS);
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

  const findLabelByText = (text: string): Promise<number | undefined> => {
    return new Promise((acc, reject) => {
      getAllLabels()
        .then((labels) => {
          const foundLabel = labels.find((label) => label.text === text);
          acc(foundLabel?.id);
        })
        .catch((err) => {
          console.log('Error findLabelByText', err);
          reject('Err');
        });
    });
  };

  const existQuestionAnswerLabel = (data: QuestionAnswerLabel): Promise<Boolean> => {
    return new Promise((acc, reject) => {
      getAllQuestionAnswersLabels()
        .then((questionAnswersLabels) => {
          const exist = questionAnswersLabels.some(
            (qal) => qal.labelId === data.labelId && qal.questionAnswerId === data.questionAnswerId
          );
          acc(exist);
        })
        .catch((err) => {
          reject(err);
        });
    });
  };

  const addLabelToQuestionAnswer = (data: QuestionAnswerLabel): Promise<void> => {
    return new Promise((acc, reject) => {
      existQuestionAnswerLabel(data)
        .then((exists) => {
          if (exists) {
            acc();
            return;
          }

          insertData(data, tables.QUESTIONS_ANSWERS_LABELS)
            .then(() => {
              acc();
            })
            .catch((err) => {
              console.log('err addLabelToQuestionAnswer', err);
              reject(err);
            });
        })
        .catch((err) => {
          console.log('err addLabelToQuestionAnswer', err);
          reject(err);
        });
    });
  };

  const filterQuestionAnswersByLabels = async (
    qaList: QuestionAnswerStored[],
    labels?: string[]
  ): Promise<QuestionAnswerStored[]> => {
    if (!labels || !labels?.length) {
      return qaList;
    }

    const storedLabels = await getAllLabels();
    const qaLabels = await getAllQuestionAnswersLabels();

    const filteredLabels = storedLabels.filter((label) => labels.includes(label.text));
    const filteredQALabels = qaLabels.filter((qal) =>
      filteredLabels.map((label) => label.id).includes(qal.labelId)
    );
    const filteredQAList = qaList.filter((qa) =>
      filteredQALabels.map((qal) => qal.questionAnswerId).includes(qa.id)
    );

    return filteredQAList;
  };

  const filterQuestionAnswersByNextSeeDate = async (
    qaList: QuestionAnswerStored[],
    nextSeeDate?: string | null
  ): Promise<QuestionAnswerStored[]> => {
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

  const getAllQuestionAnswersByFilter = async (filter: Filter): Promise<QuestionAnswerStored[]> => {
    const { labels, nextSeeDate } = filter;
    const qaList = await getAllQuestionAnswers();

    const qaListFilteredByLabels = await filterQuestionAnswersByLabels(qaList, labels);

    const qaListFilteredByNextSeeDate = await filterQuestionAnswersByNextSeeDate(
      qaListFilteredByLabels,
      nextSeeDate
    );

    return qaListFilteredByNextSeeDate;
  };

  const deleteEntry = ({ id, table }: { id: number; table: tables }): Promise<void> => {
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

  const removeLabelsFromQA = async ({
    questionAnswerId,
    labels
  }: {
    questionAnswerId: number;
    labels: string[];
  }): Promise<void> => {
    const labelsStored = await getAllLabels();
    const filteredLabels = labelsStored.filter((l) => labels.includes(l.text));
    const qaLabels = await getAllQuestionAnswersLabels();
    const qaLabelsFiltered = qaLabels.filter(
      (qal) =>
        qal.questionAnswerId === questionAnswerId &&
        filteredLabels.map((l) => l.id).includes(qal.labelId)
    );

    // remove qaLabelsFiltered from store
    for (const qaLabel of qaLabelsFiltered) {
      await deleteEntry({
        id: qaLabel.id,
        table: tables.QUESTIONS_ANSWERS_LABELS
      });
    }
  };


  useEffect(() => {
    openDb();
  }, []);
  
  return <DbContext.Provider value={{state,  insertQuestionAnswer,
    insertLabels,
    insertLabel,
    getAllQuestionAnswers,
    updateQuestionAnswer,
    findLabelByText,
    addLabelToQuestionAnswer,
    getAllQuestionAnswersByFilter,
    removeLabelsFromQA,
    getAllLabels,
    insertOnlyLabel,
    insertQALabel}}>{children}</DbContext.Provider>
}


