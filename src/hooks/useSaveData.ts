import { ExcelRow, ExcelRowSanitized } from '../types';
import useDbMethods from '../db/useDb';
import { LABELS_SEPARATOR } from '../constants';

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
  const {
    getAllQuestionAnswers,
    insertQuestionAnswer,
    getAllLabels,
    insertOnlyLabel,
    insertQALabel
  } = useDbMethods();

  const saveData = async (jsonSheet: Object[]): Promise<void> => {
    console.log('saveData');

    const jsonSheetSanitized = sanitize(jsonSheet);

    console.log('jsonSheetSanitized', jsonSheetSanitized);

    if (!jsonSheetSanitized.length) {
      return;
    }

    const qaList = await getAllQuestionAnswers();
    const labelsList = await getAllLabels();
    const parsedLabels = parseLabels(jsonSheetSanitized);
    const completedLabelsList = [...labelsList];

    console.log('qaList', qaList);
    console.log('labelsList', labelsList);
    console.log('parsedLabels', parsedLabels);

    // insert all labels
    for (const parsedLabel of parsedLabels) {
      // skip if already stored
      if (labelsList.some((l) => l.text.toLowerCase().trim() === parsedLabel)) {
        continue;
      }

      const labelId = await insertOnlyLabel({ text: parsedLabel });
      completedLabelsList.push({ text: parsedLabel, id: labelId });
    }

    console.log('completedLabelsList', completedLabelsList);

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
      const questionAnswerId = await insertQuestionAnswer({
        question,
        answer,
        lastSawDate,
        nextSeeDate
      });

      if (!labels) {
        continue;
      }

      // insert association between <question,answer> and labels
      const labelsListIds = labels
        .split(LABELS_SEPARATOR)
        .map((l) => {
          const label = l.toLowerCase().trim();
          const savedLabel = completedLabelsList.find((l) => l.text === label);
          if (savedLabel) {
            return savedLabel.id;
          }
        })
        .filter((labelId) => typeof labelId !== 'undefined') as number[];

      for (const labelId of labelsListIds) {
        await insertQALabel({ questionAnswerId, labelId });
      }
    }
  };

  return { saveData };
};

export default useSaveData;
