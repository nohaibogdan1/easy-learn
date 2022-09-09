/* eslint-disable */
import { LEVELS } from './constants';

interface QuestionAnswer {
  question: string;
  answer: string;
  lastSawDate: string | null;
  nextSeeDate: string | null;
}

type QuestionAnswerAdd = Omit<QuestionAnswer, 'lastSawDate' | 'nextSeeDate'>;

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
  NextSeeDate
};
