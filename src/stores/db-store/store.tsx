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
  getAllCardsByFilterData,
  getDeckFilterdCardsData,
  deleteCardsData,
  getAllCardsForTestData,
  createRevertedCardsData,
  updateCardsLevelData,
  getCardData,
  getAllCardsDecksData,
} from '../../data/card';
import deleteGeneralEntry from '../../data/deleteGeneralEntry';
import {
  CardAdd,
  CardStored,
  CardModification,
  CourseStored,
  CourseAdd,
  CourseWithDecks,
  DeckAdd,
  DeckStored,
  CourseModification,
  DeckWithCards,
  DeckModification,
  Sort,
  CardAndDeckStored,
  Recording,
  RecordingStored,
  AuditAdd,
  CardDeckStored
} from '../../data/interfaces';
import {
  getAllCoursesData,
  insertCourseData,
  getCourseData,
  updateCourseData,
  deleteCourseData
} from '../../data/course';
import {
  deleteDecksData,
  getAllDecksData,
  insertDeckData,
  getDeckData,
  updateDeckData,
  removeCardsFromDeckData,
  deleteDeckData,
  insertCardDeckData,
  updateCardOrderData,
  addCardsToDeckData,
} from '../../data/deck';
import { LEVELS, Where } from '../../constants';
import { saveAudioData, getAudioData } from '../../data/audio';
import { textSizeMapper } from '../../hooks/useTextSize';
import { insertChangeData } from '../../data/audit';

export type DbState = {
  db: IDBDatabase | null;
  fontSizeClass: string;
};

export type IDbContext = {
  state: DbState;
  insertCard: (data: CardAdd) => Promise<number>;
  getAllCards: () => Promise<CardStored[]>;
  getAllCardsForTest: (arg: {
    cardsIds?: number[], 
    decksIds?: number[], 
    coursesIds?: number[] 
  }) => Promise<CardAndDeckStored[]>;
  updateCard: (data: CardModification) => Promise<void>;
  getAllCardsByFilter: (data?: { filter?: Filter; sort?: Sort }) => Promise<CardStored[]>;
  getAllCourses: () => Promise<CourseStored[]>;
  insertCourse: (data: CourseAdd) => Promise<number | null>;
  updateCourse: (data: CourseModification) => Promise<void>;
  updateDeck: (data: DeckModification) => Promise<void>;
  getCourse: (data: { id: number; includeDecks?: boolean }) => Promise<CourseWithDecks | null>;
  getDeck: (data: { id: number; includeCards?: boolean }) => Promise<DeckWithCards | null>;
  getAllDecks: () => Promise<DeckStored[]>;
  insertDeck: (data: DeckAdd) => Promise<number | null>;
  deleteDecks: (decksIds: number[]) => Promise<void>;
  deleteDeck: (deckId: number) => Promise<void>;
  deleteCourse: (id: number) => Promise<void>;
  removeCardsFromDeck: ({
    cardsIds,
    deckId
  }: {
    cardsIds: number[];
    deckId: number;
  }) => Promise<void>;
  getDeckFilteredCards: ({
    deckId,
    text
  }: {
    deckId: number;
    text: string;
  }) => Promise<CardAndDeckStored[]>;
  deleteCards: (cardsIds: number[]) => Promise<void>;
  insertCardDeck: (arg: { deckId: number, cardId: number }) => Promise<void>;
  updateCardsOrder: (arg: { cardIdTarget: number, where: Where, cardsIdsToMove: number[], deckId: number, }) => Promise<void>;
  addCardsToDeck: (arg: { deckId: number, cardsIds: number[] }) => Promise<void>;
  createRevertedCards: (arg: CardStored[]) => Promise<void>;
  updateCardsLevel: (arg: {cardsIds: number[], newLevel: LEVELS}) => Promise<void>;
  getCard: (arg: number) => Promise<CardStored | undefined>;
  saveAudio: (arg: Recording) => Promise<number>;
  getAudio: (arg: number) => Promise<RecordingStored | undefined>;
  updateTextSizeClass: (arg: string) => void;
  insertChange: (data: AuditAdd) => void;
  getAllCardsDecks: () => Promise<CardDeckStored[]>;
};

const initialDbState = {
  db: null,
  fontSizeClass: 'm',
};

const defaultValue = {
  state: initialDbState
};

export const DbContext = createContext(defaultValue as unknown as IDbContext);

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

  const getAllCardsForTest = async (arg: {
    cardsIds?: number[],
    decksIds?: number[],
    coursesIds?: number[],
  }): Promise<CardAndDeckStored[]> => {
    return getAllCardsForTestData({ ...arg, state });
  };

  const getAllCardsByFilter = async (data?: {
    filter?: Filter;
    sort?: Sort;
  }): Promise<CardStored[]> => {
    return getAllCardsByFilterData({
      state,
      filter: data?.filter,
      sort: data?.sort
    });
  };

  const deleteEntry = async ({ id, table }: { id: number; table: tables }): Promise<void> => {
    return deleteGeneralEntry({
      id,
      table,
      state
    });
  };

  const getAllCourses = async (): Promise<CourseStored[]> => {
    return getAllCoursesData(state);
  };

  const insertCourse = async (data: CourseAdd): Promise<number | null> => {
    return insertCourseData({ state, data });
  };

  const updateCourse = async (data: CourseModification): Promise<void> => {
    updateCourseData({
      state,
      data
    });
  };

  const getCourse = ({
    id,
    includeDecks
  }: {
    id: number;
    includeDecks?: boolean;
  }): Promise<CourseWithDecks | null> => {
    return getCourseData({
      id,
      includeDecks,
      state
    });
  };

  const deleteCourse = async (id: number): Promise<void> => {
    return await deleteCourseData({
      id,
      state
    });
  };

  const getAllDecks = async (): Promise<DeckStored[]> => {
    return getAllDecksData(state);
  };

  const getDeck = ({
    id,
    includeCards
  }: {
    id: number;
    includeCards?: boolean;
  }): Promise<DeckWithCards | null> => {
    return getDeckData({
      id,
      includeCards,
      state
    });
  };

  const updateDeck = async (data: DeckModification): Promise<void> => {
    updateDeckData({
      state,
      data
    });
  };

  const insertDeck = async (data: DeckAdd): Promise<number | null> => {
    return insertDeckData({ state, data });
  };

  const deleteDecks = async (decksIds: number[]): Promise<void> => {
    return await deleteDecksData({ ids: decksIds, state });
  };

  const deleteDeck = async (deckId: number): Promise<void> => {
    return await deleteDeckData({ id: deckId, state });
  };

  const removeCardsFromDeck = async ({
    cardsIds,
    deckId
  }: {
    cardsIds: number[];
    deckId: number;
  }): Promise<void> => {
    return await removeCardsFromDeckData({ cardsIds, deckId, state });
  };

  const getDeckFilteredCards = async ({
    deckId,
    text
  }: {
    deckId: number;
    text: string;
  }): Promise<CardAndDeckStored[]> => {
    return await getDeckFilterdCardsData({ deckId, text, state });
  };

  const deleteCards = async (cardsIds: number[]) => {
    return await deleteCardsData({ cardsIds, state });
  };

  const insertCardDeck = async ({
    cardId,
    deckId
  }: {
    cardId: number;
    deckId: number;
  }): Promise<void> => {
    return await insertCardDeckData({ cardId, deckId, state });
  };

  const updateCardsOrder = async ({
    cardIdTarget,
    where,
    cardsIdsToMove,
    deckId,
  }: { 
    cardIdTarget: number,
    where: Where,
    cardsIdsToMove: number[],
    deckId: number,
  }): Promise<void> => {

    return updateCardOrderData({
      cardIdTarget,
      where,
      cardsIdsToMove,
      deckId, 
      state,
    });
  };

  const addCardsToDeck = async ({
    cardsIds,
    deckId,
  }: {
    cardsIds: number[],
    deckId: number,
  }): Promise<void> => {
    addCardsToDeckData({
      cardsIds,
      deckId,
      state
    });
  };

  const createRevertedCards = async (cards: CardStored[]): Promise<void> => {
    createRevertedCardsData({
      cards,
      state,
    });
  };

  const updateCardsLevel = async ({
    newLevel,
    cardsIds,
  }:{
    newLevel: LEVELS,
    cardsIds: number[]
  }): Promise<void> => {
    updateCardsLevelData({
      cardsIds, newLevel, state
    });
  };

  const getCard = (cardId: number): Promise<CardStored | undefined> => {
    return getCardData({cardId, state});
  }

  const saveAudio = async (audioBlob: Recording): Promise<number> => {
    return saveAudioData({audioBlob, state});
  };

  const getAudio = (recordingId: number): Promise<RecordingStored | undefined> => {
    return getAudioData({recordingId, state});
  };

  const insertChange = (data: AuditAdd): void => {
    insertChangeData({
      data, state
    });
  };

  const getAllCardsDecks = async (): Promise<CardDeckStored[]> => {
    return getAllCardsDecksData(state);
  };

  const updateTextSizeClass = (size: string) => {
    setState(state => ({...state, fontSizeClass: size}));
  };

  useEffect(() => {
    const savedTextSize = localStorage.getItem('text-size');
    if (savedTextSize) {
      updateTextSizeClass(textSizeMapper[parseInt(savedTextSize) as keyof typeof textSizeMapper]);
    }
  }, []);

  useEffect(() => {
    openDb({ setState });
  }, []);

  return (
    <DbContext.Provider
      value={{
        state,
        insertCard,
        getAllCards,
        getAllCardsForTest,
        updateCard,
        getAllCardsByFilter,
        getAllCourses,
        insertCourse,
        updateCourse,
        getCourse,
        getAllDecks,
        insertDeck,
        deleteDecks,
        deleteDeck,
        deleteCourse,
        getDeck,
        updateDeck,
        removeCardsFromDeck,
        getDeckFilteredCards,
        deleteCards,
        insertCardDeck,
        updateCardsOrder,
        addCardsToDeck,
        createRevertedCards,
        updateCardsLevel,
        getCard,
        saveAudio,
        getAudio,
        updateTextSizeClass,
        insertChange,
        getAllCardsDecks,
      }}
    >
      {children}
    </DbContext.Provider>
  );
};
