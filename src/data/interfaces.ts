/* eslint-disable */

import { LEVELS, FieldsForSorting, OrderSettings } from '../constants';

/** -------------------- CARD -------------------- */

interface Card {
  question: string;
  answer: string;
  lastSawDate: string | null;
  nextSeeDate: string | null;
  level: LEVELS;
  deckId?: number | null;
  createdAt: string;
}

interface CardAdd {
  question: string;
  answer: string;
  lastSawDate?: string | null;
  nextSeeDate?: string | null;
  level?: LEVELS | null;
  deckId?: number | null;
  deck?: {
    deckId: number;
    orderId?: number;
  };
  createdAt?: string | null;
}

type CardStored = Card & {
  id: number;
};

type CardModification = Partial<CardStored>;

/** -------------------- COURSE -------------------- */
interface Course {
  description: string;
}

type CourseAdd = Course;

type CourseStored = Course & {
  id: number;
};

type CourseModification = Partial<CourseStored>;

type CourseWithDecks = CourseStored & {
  decks?: DeckStored[];
};

/** -------------------- DECK -------------------- */

interface Deck {
  courseId: number;
  description: string;
}

type DeckAdd = Deck;

type DeckStored = Deck & {
  id: number;
};

type DeckWithCards = DeckStored & {
  cards?: CardAndDeckStored[];
};

type DeckModification = Partial<DeckStored>;

/**  -------------------- CARD_DECK ------------------ */

interface CardDeck {
  cardId: number;
  deckId: number;
  orderId: number;
}

type CardDeckAdd = CardDeck;

type CardDeckStored = CardDeck & {
  id: number;
};

type CardDeckModification = Partial<CardDeckStored>;

type Sort = {
  field: FieldsForSorting;
  asc?: boolean;
};

interface TestCustomSettings {
  orderSettings: OrderSettings;
  showAnswerSettings: boolean;
  levelFilterSettings: LEVELS[];
}

type CardAndDeckStored = CardStored & {
  orderId: number;
};

/** ----------- IMPORT --------- */
type ExcelRow = Partial<Card> & {
  cardId?: number;
  courseDescription?: string;
  deckDescription?: string;
};

export type {
  Card,
  CardAdd,
  CardStored,
  CardModification,
  Course,
  CourseStored,
  CourseAdd,
  CourseModification,
  CourseWithDecks,
  Deck,
  DeckAdd,
  DeckStored,
  DeckWithCards,
  DeckModification,
  CardDeck,
  CardDeckAdd,
  CardDeckStored,
  Sort,
  TestCustomSettings,
  CardAndDeckStored,
  ExcelRow,
  CardDeckModification,
};
