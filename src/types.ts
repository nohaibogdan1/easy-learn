/* eslint-disable */
import { LEVELS } from './constants';

interface QuestionAnswer {
  question: string;
  answer: string;
  lastSawDate: string | null;
  nextSeeDate: string | null;
}

type QuestionAnswerAdd = {
  question: string;
  answer: string;
  lastSawDate?: string | null;
  nextSeeDate?: string | null;
};

type QuestionAnswerInsertion = QuestionAnswerAdd & {
  labels: Label[];
};

type QuestionAnswerStored = QuestionAnswer & {
  id: number;
};

interface Label {
  text: string;
}

type AssociatedLabel = Label & {
  questionAnswerId: number;
};

type AssociatedLabels = {
  labels: Label[];
  questionAnswerId: number;
};

type LabelStored = Label & {
  id: number;
};

interface QuestionAnswerLabel {
  questionAnswerId: number;
  labelId: number;
}

type QuestionAnswerLabelStored = QuestionAnswerLabel & {
  id: number;
};

type Card = QuestionAnswerStored;

type QuestionAnswerModification = QuestionAnswerStored;

type NextSeeDate = {
  [LEVELS.EASY]: string;
  [LEVELS.MEDIUM]: string;
  [LEVELS.HARD]: string;
};

type SelectedLevels = {
  [LEVELS.EASY]: boolean;
  [LEVELS.MEDIUM]: boolean;
  [LEVELS.HARD]: boolean;
};

interface Filter {
  labels?: string[];
  nextSeeDate?: string;
}

interface Obj {
  [key: string]: string | number;
}

type ExcelRow = Partial<QuestionAnswer> & {
  labels?: string;
};

type ExcelRowSanitized = QuestionAnswer & {
  labels?: string;
};

export type {
  QuestionAnswer,
  QuestionAnswerStored,
  Label,
  LabelStored,
  AssociatedLabel,
  QuestionAnswerInsertion,
  QuestionAnswerAdd,
  AssociatedLabels,
  QuestionAnswerLabel,
  Card,
  QuestionAnswerModification,
  QuestionAnswerLabelStored,
  NextSeeDate,
  Filter,
  SelectedLevels,
  Obj,
  ExcelRow,
  ExcelRowSanitized
};
