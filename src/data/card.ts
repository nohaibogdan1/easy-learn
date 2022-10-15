/* eslint-disable */

import insertGeneralData from './insertGeneralData';
import { Filter } from '../types';
import {
  CardStored,
  CardAdd,
  CardModification,
  CardDeckStored,
  Sort,
  CardAndDeckStored,
  Course,
  CourseStored,
  DeckStored
} from './interfaces';
import { tables } from '../db/tables';
import { DbState } from '../stores/db-store/store';
import getAllGeneralData from './getAllGeneralData';
import { filterCardsByField, sortCards } from '../logic/card';
import deleteGeneralEntry from './deleteGeneralEntry';

const insertCardData = async ({
  data,
  state
}: {
  data: CardAdd;
  state: DbState;
}): Promise<number> => {
  const { question, answer, level, deckId, deck } = data;
  const cardId = await insertGeneralData({
    state,
    table: tables.CARDS,
    data: {
      question,
      answer,
      lastSawDate: null,
      nextSeeDate: null,
      level: level || null
    }
  });

  if (deck) {
    const cardsDecks = (await getAllGeneralData({
      table: tables.CARDS_DECKS,
      state
    })) as CardDeckStored[];

    const matches = cardsDecks.filter((cd) => cd.deckId === deck.deckId);

    let orderId = Math.max(...matches.map((cd) => cd.orderId)) + 1;

    if (isNaN(parseInt(orderId.toString()))) {
      orderId = 0;
    }

    await insertGeneralData({
      state,
      table: tables.CARDS_DECKS,
      data: {
        cardId,
        deckId: deck.deckId,
        orderId
      }
    });

    return cardId;
  }

  if (deckId) {
    const cardsDecks = (await getAllGeneralData({
      table: tables.CARDS_DECKS,
      state
    })) as CardDeckStored[];

    const matches = cardsDecks.filter((cd) => cd.deckId === deckId);

    let orderId = Math.max(...matches.map((cd) => cd.orderId)) + 1;

    if (isNaN(parseInt(orderId.toString()))) {
      orderId = 0;
    }

    await insertGeneralData({
      state,
      table: tables.CARDS_DECKS,
      data: {
        cardId,
        deckId,
        orderId
      }
    });
  }

  return cardId;
};

const updateCardData = ({
  data,
  state
}: {
  data: CardModification;
  state: DbState;
}): Promise<void> => {
  const { db } = state;
  return new Promise((acc, reject) => {
    try {
      if (db) {
        const transaction = db.transaction(tables.CARDS, 'readwrite');
        const store = transaction.objectStore(tables.CARDS);
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

const getAllCardsData = (state: DbState): Promise<CardStored[]> => {
  return getAllGeneralData({
    state,
    table: tables.CARDS
  }) as Promise<CardStored[]>;
};

const getAllCardsForTestData = async ({
  cardsIds, 
  decksIds, 
  coursesIds, 
  state
}: {
  cardsIds?: number[], 
  decksIds?: number[], 
  coursesIds?: number[], 
  state: DbState,
}): Promise<CardAndDeckStored[]> => {

  console.log(cardsIds, 
    decksIds, 
    coursesIds, )

  const cards = (await getAllGeneralData({
    state,
    table: tables.CARDS
  })) as CardStored[];

  const cardsDecks = (await getAllGeneralData({
    table: tables.CARDS_DECKS,
    state
  })) as CardDeckStored[];

  let decksFiltered: DeckStored[] | null = null;

  if ((coursesIds && coursesIds.length) || 
      (decksIds && decksIds.length)) {

    const decks = (await getAllGeneralData({
      state,
      table: tables.DECKS
    })) as DeckStored[];

    decksFiltered = decks.filter((d) => {
      if (coursesIds && coursesIds.length) {
        if (coursesIds.includes(d.courseId)) {
          return true;
        }
      }

      if (decksIds && decksIds.length) {
        if (decksIds.includes(d.id)) {
          return true;
        }
      }
    });
  }

  const decksFilteredIds = decksFiltered?.map((d) => d.id);

  const cardDecksFiltered = cardsDecks.filter((cd) => {
    if (decksFilteredIds && decksFilteredIds.length) {
      if (decksFilteredIds.includes(cd.deckId)) {
        return true;
      }
    }

    if (cardsIds && cardsIds.length) {
      if (cardsIds.includes(cd.cardId)) {
        return true;
      }
    }
  });

  const cardDecksFilteredCardIds = cardDecksFiltered.map((cd) => cd.cardId);

  return cards
    .filter((c) => {
      if (cardDecksFiltered.length) {
        return cardDecksFilteredCardIds.includes(c.id);
      } else {
        return true;
      }
    })
    .map((c) => {
      const orderId = cardsDecks.find((cd) => cd.cardId === c.id)?.orderId;
      return {
        ...c,
        orderId: orderId ?? 0
      };
    });
};

const getAllCardsByFilterData = async ({
  filter,
  state,
  sort
}: {
  filter?: Filter;
  state: DbState;
  sort?: Sort;
}): Promise<CardStored[]> => {
  const cards = await getAllCardsData(state);
  const cardsFiltered = filterCardsByField({ cards, filter });
  const cardsSorted = sortCards({ cards: cardsFiltered, sort });
  return cardsSorted;
};

const getDeckFilterdCardsData = async ({
  deckId,
  text,
  state
}: {
  deckId: number;
  text: string;
  state: DbState;
}): Promise<CardAndDeckStored[]> => {
  const cardsDecks = (await getAllGeneralData({
    table: tables.CARDS_DECKS,
    state
  })) as CardDeckStored[];

  const cardsDecksFilterd = cardsDecks.filter((cd) => cd.deckId === deckId);
  const cardsIds = cardsDecksFilterd.map((cd) => cd.cardId);

  const cards = (await getAllGeneralData({
    table: tables.CARDS,
    state
  })) as CardStored[];

  const cardsFiltered = cards.filter(
    (c) => cardsIds.includes(c.id) && c.question.indexOf(text.trim()) !== -1
  );

  return cardsFiltered.map((c) => {
    const orderId = cardsDecksFilterd.find((cd) => cd.cardId === c.id)?.orderId;
    return { ...c, orderId: orderId ?? 0 };
  });
};

const deleteCardsData = async ({
  cardsIds,
  state
}: {
  cardsIds: number[];
  state: DbState;
}): Promise<void> => {
  for (const id of cardsIds) {
    try {
      await deleteGeneralEntry({
        id,
        table: tables.CARDS,
        state
      });
    } catch (err) {}
  }

  const cardsDecks = (await getAllGeneralData({
    table: tables.CARDS_DECKS,
    state
  })) as CardDeckStored[];

  const cardsDecksFilteredIds = cardsDecks
    .filter((cd) => cardsIds.includes(cd.cardId))
    .map((cd) => cd.id);

  for (const id of cardsDecksFilteredIds) {
    try {
      await deleteGeneralEntry({
        id,
        table: tables.CARDS_DECKS,
        state
      });
    } catch (err) {}
  }
};

export {
  insertCardData,
  updateCardData,
  getAllCardsData,
  getAllCardsByFilterData,
  getDeckFilterdCardsData,
  deleteCardsData,
  getAllCardsForTestData
};
