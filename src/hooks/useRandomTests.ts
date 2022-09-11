/* eslint-disable */
import useDbMethods from '../db/useDb';
import { QuestionAnswerStored, SelectedLevels } from '../types';
import { useDbStore } from '../stores/db-store/store';

const useRandomTests = () => {
  const { getAllQuestionAnswers, getAllQuestionAnswersByFilter } = useDbStore();

  const getRandomTests = (): Promise<QuestionAnswerStored[]> => {
    return new Promise((acc, reject) => {
      getAllQuestionAnswers()
        .then((data: QuestionAnswerStored[]) => {
          acc(data);
        })
        .catch((err) => {
          console.log('Error getRandomTests', err);
          reject(err);
        });
    });
  };

  const getQuestionAnswersByFilter = ({
    today,
    levels
  }: {
    today: boolean;
    levels: SelectedLevels;
  }): Promise<QuestionAnswerStored[]> => {
    let nextSeeDate = undefined;
    const labels: string[] = [];

    if (today) {
      const t = new Date().getTime();
      const tomorrow = t + 1000 * 60 * 60 * 24;
      nextSeeDate = tomorrow.toString();
    }

    Object.entries(levels)
      .filter(([_, checked]) => checked)
      .map(([level]) => labels.push(level));

    return getAllQuestionAnswersByFilter({ nextSeeDate, labels });
  };

  return {
    getRandomTests,
    getQuestionAnswersByFilter
  };
};

export default useRandomTests;
