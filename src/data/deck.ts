/* eslint-disable */

import getAllGeneralData from './getAllGeneralData';
import { DbState } from '../stores/db-store/store';
import {
  DeckStored,
  CardStored,
  DeckWithCards,
  DeckModification,
  CardDeckStored
} from './interfaces';
import { tables } from '../db/tables';
import insertGeneralData from './insertGeneralData';
import { DeckAdd } from './interfaces';
import deleteGeneralEntry from './deleteGeneralEntry';
import { updateCardData } from './card';

const getAllDecksData = (state: DbState): Promise<DeckStored[]> => {
  return getAllGeneralData({
    state,
    table: tables.DECKS
  }) as Promise<DeckStored[]>;
};

const insertDeckData = async ({
  data,
  state
}: {
  data: DeckAdd;
  state: DbState;
}): Promise<number | null> => {
  console.log(data);

  if (!data.description.length) {
    return null;
  }

  return insertGeneralData({
    state,
    table: tables.DECKS,
    data: {
      description: data.description,
      courseId: data.courseId
    }
  });
};

const deleteDecksData = async ({
  ids,
  state
}: {
  ids: number[];
  state: DbState;
}): Promise<void> => {
  for (const id of ids) {
    await deleteGeneralEntry({
      id,
      table: tables.DECKS,
      state
    });
  }
};

const deleteDeckData = async ({ id, state }: { id: number; state: DbState }): Promise<void> => {
  await deleteGeneralEntry({
    id,
    table: tables.DECKS,
    state
  });
};

const getDeckData = async ({
  id,
  includeCards,
  state
}: {
  id: number;
  includeCards?: boolean;
  state: DbState;
}): Promise<DeckWithCards | null> => {
  const decks = (await getAllGeneralData({ table: tables.DECKS, state })) as DeckStored[];
  const deck = decks.find((d) => d.id === id);

  if (!deck) {
    return null;
  }

  if (!includeCards) {
    return deck;
  }

  const cardsDecks = (await getAllGeneralData({
    table: tables.CARDS_DECKS,
    state
  })) as CardDeckStored[];
  const cards = (await getAllGeneralData({ table: tables.CARDS, state })) as CardStored[];

  const cardsDecksFiltered = cardsDecks.filter((cd) => cd.deckId === id);
  const containedCards = cardsDecksFiltered.map((cd) => cd.cardId);
  const cardsFiltered = cards.filter((c) => containedCards.includes(c.id));

  return {
    ...deck,
    cards: cardsFiltered.map((c) => {
      const orderId = cardsDecksFiltered.find((cd) => cd.cardId === c.id)?.orderId;
      return { ...c, orderId: orderId ?? 0 };
    })
  };
};

const updateDeckData = ({
  data,
  state
}: {
  data: DeckModification;
  state: DbState;
}): Promise<void> => {
  const { db } = state;
  return new Promise((acc, reject) => {
    try {
      if (db) {
        const transaction = db.transaction(tables.DECKS, 'readwrite');
        const store = transaction.objectStore(tables.DECKS);
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

const removeCardsFromDeckData = async ({
  cardsIds,
  deckId,
  state
}: {
  cardsIds: number[];
  deckId: number;
  state: DbState;
}): Promise<void> => {
  const cardsDecks = (await getAllGeneralData({
    table: tables.CARDS_DECKS,
    state
  })) as CardDeckStored[];
  const cardsDecksFilteredIds = cardsDecks
    .filter((cd) => cardsIds.includes(cd.cardId) && cd.deckId === deckId)
    .map((cd) => cd.id);

  for (const id of cardsDecksFilteredIds) {
    try {
      await deleteGeneralEntry({
        id,
        table: tables.CARDS_DECKS,
        state
      });
    } catch (e) {}
  }
};

const insertCardDeckData = async ({
  cardId,
  deckId,
  state
}: {
  cardId: number;
  deckId: number;
  state: DbState;
}): Promise<void> => {
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
    table: tables.CARDS_DECKS,
    data: {
      cardId,
      deckId,
      orderId
    },
    state
  });
};

export {
  getAllDecksData,
  insertDeckData,
  deleteDecksData,
  getDeckData,
  updateDeckData,
  removeCardsFromDeckData,
  deleteDeckData,
  insertCardDeckData
};
