/* eslint-disable */

import { ExcelRow, ExcelRowSanitized } from '../types';
import { LABELS_SEPARATOR } from '../constants';
import { useDbStore } from '../stores/db-store/store';

const sanitize = (jsonSheet: ExcelRow[]): ExcelRowSanitized[] => {
  const sanitizedData: ExcelRowSanitized[] = [];

  for (const row of jsonSheet) {
    const { question, answer } = row;

    // remove row if question or answer is missing
    if (!question || !answer) {
      continue;
    }

    // remove question and answer duplicates
    if (
      sanitizedData.some(
        (s) =>
          s.question?.toLowerCase().trim() === question.toLowerCase().trim() &&
          s.answer?.toLowerCase().trim() === answer.toLowerCase().trim()
      )
    ) {
      continue;
    }

    sanitizedData.push(row as ExcelRowSanitized);
  }

  return sanitizedData;
};

const parseLabels = (jsonSheet: ExcelRowSanitized[]): string[] => {
  const labelsList: string[] = [];

  for (const row of jsonSheet) {
    const { labels } = row;

    if (!labels) {
      continue;
    }

    labels
      .split(LABELS_SEPARATOR)
      .map((l: string) => l.toLowerCase().trim())
      .filter(Boolean)
      .map((l) => {
        if (!labelsList.includes(l)) {
          labelsList.push(l);
        }
      });
  }

  return labelsList;
};

const useSaveData = () => {
  const { getAllCards, insertCard } = useDbStore();

  const saveData = async (jsonSheet: Object[]): Promise<void> => {
    const jsonSheetSanitized = sanitize(jsonSheet);

    if (!jsonSheetSanitized.length) {
      return;
    }

    const qaList = await getAllCards();

    // insert all questions and answers
    for (const row of jsonSheetSanitized) {
      const { question, answer, lastSawDate, nextSeeDate, labels } = row;

      // if already stored do not store it
      const exists = qaList.some(
        (qa) =>
          qa.question.toLowerCase().trim() === question.toLowerCase().trim() &&
          qa.answer.toLowerCase().trim() === answer.toLowerCase().trim()
      );

      if (exists) {
        continue;
      }

      // insert question and answer
      const questionAnswerId = await insertCard({
        question,
        answer,
        lastSawDate,
        nextSeeDate
      });
    }
  };

  return { saveData };
};

export default useSaveData;
