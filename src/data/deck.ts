/* eslint-disable */

import getAllGeneralData from './getAllGeneralData';
import { DbState } from '../stores/db-store/store';
import {
  DeckStored,
  CardStored,
  DeckWithCards,
  DeckModification,
  CardDeckStored,
  CardDeckModification
} from './interfaces';
import { tables } from '../db/tables';
import insertGeneralData from './insertGeneralData';
import { DeckAdd } from './interfaces';
import deleteGeneralEntry from './deleteGeneralEntry';
import { updateCardData } from './card';
import { Where } from '../constants';

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
        console.log('update ', data);
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

const updateCardDeckData = ({
  data,
  state
}: {
  data: CardDeckModification;
  state: DbState;
}): Promise<void> => {
  const { db } = state;
  return new Promise((acc, reject) => {
    try {
      if (db) {
        const transaction = db.transaction(tables.CARDS_DECKS, 'readwrite');
        const store = transaction.objectStore(tables.CARDS_DECKS);
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

const updateCardOrderData = async ({
  cardIdTarget,
  where,
  cardsIdsToMove,
  deckId,
  state,
}: { 
  cardIdTarget: number,
  where: Where,
  cardsIdsToMove: number[],
  deckId: number,
  state: DbState,
}): Promise<void> => {

  const cardsDecks = await getAllGeneralData({
    table: tables.CARDS_DECKS,
    state,
  }) as CardDeckStored[];

  const cardsDecksFilteredSorted = cardsDecks
    .filter((cd) => cd.deckId === deckId)
    .sort((cd1, cd2) =>  cd1.orderId - cd2.orderId);

  const elementsToMove = cardsDecksFilteredSorted
    .filter((cd) => cardsIdsToMove.includes(cd.cardId));

  let elementsToUpdate: CardDeckStored[] = [];

  const moveInCaseOfBefore = (cardIdTarget: number) => {
    /**
     * moving the elements before cardIdTarget it means that:
     *  1. the order ids of the elements after the cardIdTarget including
     * cardIdTarget will be increased by the length of cardsIdsToMove
     *  2. the order ids of the cardsIdsToMove will be calculated by using
     * the newly calculated orderId of the cardIdTarget in the way: 
     * the last one from cardsIdsToMove will have the orderId of cardIdTarget 
     * decreased by 1. After that the second last from cardsIdsToMove will have
     * order id equal to the newly calculated order id of the last one from
     * cardsIdsToMove decreased by 1 and so on.  
     * 
     * Example:
     * 
     * {id: 1, orderId: 0}
     * {id: 2, orderId: 1}
     * {id: 3, orderId: 2}
     * {id: 4, orderId: 3}
     * {id: 5, orderId: 4}
     * {id: 6, orderId: 5}
     * {id: 7, orderId: 6}
     * {id: 8, orderId: 7}
     * {id: 9, orderId: 8}
     * 
     * Pick 5,7,9 to move before 3
     * 
     * 1. The order ids for 3,4,6,8 will be increased by 3
     * {id: 1, orderId: 0}
     * {id: 2, orderId: 1}
     * {id: 5, orderId: 4}
     * {id: 7, orderId: 6}
     * {id: 9, orderId: 8}
     * {id: 3, orderId: 5}
     * {id: 4, orderId: 6}
     * {id: 6, orderId: 8}
     * {id: 8, orderId: 10}
     * 
     * 2. The order id for 9 will be order id of 3 which is 5 
     * decreased by 1 => order id of 9 will be 4.
     * The order id for 7 will be 4 - 1 = 3
     * The order id for 5 will be 3 - 1 = 2
     * {id: 1, orderId: 0}
     * {id: 2, orderId: 1}
     * {id: 5, orderId: 2}
     * {id: 7, orderId: 3}
     * {id: 9, orderId: 4}
     * {id: 3, orderId: 5}
     * {id: 4, orderId: 6}
     * {id: 6, orderId: 8}
     * {id: 8, orderId: 10}
     */

    const matchedTarget = cardsDecksFilteredSorted
     .find((cd) => cd.cardId === cardIdTarget);

    if (!matchedTarget) {
      return;
    }

    const elementsFromTargetTillEndNewOrder = cardsDecksFilteredSorted
      .filter((cd) => 
        cd.orderId >= matchedTarget.orderId && 
        !cardsIdsToMove.includes(cd.cardId))
      .map((cd) => ({ 
        ...cd, 
        orderId: cd.orderId + elementsToMove.length 
      }));

    const elementsToMoveNewOrder: CardDeckStored[] = [];

    for (let i = elementsToMove.length - 1; i >= 0; i--) {
      let orderId = 0;

      if (i === elementsToMove.length - 1) {
        const matchedTargetWithNewOrder = elementsFromTargetTillEndNewOrder
          .find((cd) => cd.cardId === cardIdTarget);

        if (matchedTargetWithNewOrder) {
          orderId = matchedTargetWithNewOrder.orderId - 1;
        }

      } else {
        orderId = elementsToMoveNewOrder[elementsToMoveNewOrder.length - 1].orderId - 1;
      }

      elementsToMoveNewOrder.push({
        ...elementsToMove[i],
        orderId,
      });
    }

    elementsToUpdate = [
      ...elementsFromTargetTillEndNewOrder, 
      ...elementsToMoveNewOrder
    ];
  };

  const moveInCaseOfAfter = (cardIdTarget: number) => {
    /**
     * if the cardIdTarget is the last element
     * the order ids for cardsIdsToMove will be
     * calculated by:
     *  - the order id of the first element from 
     *  cardsIdsToMove will be the order id of the 
     *  cardIdTarget increased by one
     *  - the order id of the second element will be
     *  the order id of the first one increased by one
     *  and so on.
     */

    if (cardIdTarget === cardsDecksFilteredSorted[cardsDecksFilteredSorted.length - 1].cardId) {
      const matchedTarget = cardsDecksFilteredSorted
        .find((cd) => cd.cardId === cardIdTarget);

      if (!matchedTarget) {
        return;
      }

      const elementsToMoveNewOrder: CardDeckStored[] = [];

      for (let i = 0; i <= elementsToMove.length - 1; i++) {
        let orderId = 0;

        if (i === 0) {
          orderId = matchedTarget.orderId + 1;
        } else {
          orderId = elementsToMoveNewOrder[elementsToMoveNewOrder.length - 1].orderId + 1;
        }

        elementsToMoveNewOrder.push({
          ...elementsToMove[i],
          orderId,
        })
      }

      elementsToUpdate = [...elementsToMoveNewOrder];

    } else {

      /** if the cardIdTarget is not the last element
       * we can treat this case as a before case
       * where the new card id target is the next card
       * after cardIdTarget.
       */

      const newCardIdTarget = cardsDecksFilteredSorted
        .findIndex((cd) => cd.cardId === cardIdTarget) + 1;
    
      moveInCaseOfBefore(newCardIdTarget);
    }
  };

  if (where === Where.before) {
    moveInCaseOfBefore(cardIdTarget);

  } else if (where === Where.after) {
    moveInCaseOfAfter(cardIdTarget);
  }

  for (const el of elementsToUpdate) {
    await updateCardDeckData({ data: el, state });
  }
};

const addCardsToDeckData = async ({
  cardsIds,
  deckId,
  state
}: {
  state: DbState,
  cardsIds: number[],
  deckId: number,
}): Promise<void> => {

  const cardsDecks = await getAllGeneralData({
    table: tables.CARDS_DECKS,
    state,
  }) as CardDeckStored[];

  const cardsDecksFiltered = cardsDecks.filter((cd) => 
    cd.deckId === deckId);

  const cardsDecksProcessed = cardsDecksFiltered.map((cd) => ({
    cardId: cd.cardId,
    orderId: cd.orderId,
  }));

  for (const cardId of cardsIds) {
    const added = cardsDecksProcessed.find((cd) => cd.cardId === cardId);
    if (!added) {
      let orderId = Math.max(...cardsDecksProcessed.map((cd) => cd.orderId)) + 1;

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

      cardsDecksProcessed.push({
        cardId,
        orderId,
      });
    }
  }

};


export {
  getAllDecksData,
  insertDeckData,
  deleteDecksData,
  getDeckData,
  updateDeckData,
  removeCardsFromDeckData,
  deleteDeckData,
  insertCardDeckData,
  updateCardOrderData,
  addCardsToDeckData,
};
