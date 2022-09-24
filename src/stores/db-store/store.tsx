/* eslint-disable */

import React, {
  createContext,
  useContext,
  PropsWithChildren,
  useState,
  ReactElement,
  useEffect
} from 'react';

import { tables } from '../../db/tables';
import { Filter } from '../../types';
import openDb from '../../data/openDb';
import {
  insertCardData,
  updateCardData,
  getAllCardsData,
  getAllCardsByFilterData
} from '../../data/card';
import deleteGeneralEntry from '../../data/deleteGeneralEntry';
import { CardAdd, CardStored, CardModification } from '../../data/interfaces';

export type DbState = {
  db: IDBDatabase | null;
};

export type IDbContext = {
  state: DbState;
  insertCard: (data: CardAdd) => Promise<number>;
  getAllCards: () => Promise<CardStored[]>;
  updateCard: (data: CardModification) => Promise<void>;
  getAllCardsByFilter: (filter: Filter) => Promise<CardStored[]>;
};

const initialDbState = {
  db: null
};

const defaultValue = {
  state: initialDbState
};

export const DbContext = createContext(defaultValue as IDbContext);

export const useDbStore = (): IDbContext => useContext(DbContext);

export const DbStoreProvider = ({
  children
}: PropsWithChildren<Record<string, unknown>>): ReactElement => {
  const [state, setState] = useState<DbState>(initialDbState);

  const insertCard = async (data: CardAdd): Promise<number> => {
    return insertCardData({
      state,
      data
    });
  };

  const updateCard = async (data: CardModification): Promise<void> => {
    updateCardData({
      state,
      data
    });
  };

  const getAllCards = async (): Promise<CardStored[]> => {
    return getAllCardsData(state);
  };

  const getAllCardsByFilter = async (filter: Filter): Promise<CardStored[]> => {
    return getAllCardsByFilterData({
      state,
      filter
    });
  };

  const deleteEntry = async ({ id, table }: { id: number; table: tables }): Promise<void> => {
    return deleteGeneralEntry({
      id,
      table,
      state
    });
  };

  useEffect(() => {
    openDb({ setState });
  }, []);

  return (
    <DbContext.Provider
      value={{
        state,
        insertCard,
        getAllCards,
        updateCard,
        getAllCardsByFilter
      }}
    >
      {children}
    </DbContext.Provider>
  );
};
