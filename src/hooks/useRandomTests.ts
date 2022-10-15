/* eslint-disable */
import { SelectedLevels } from '../types';
import { CardStored } from '../data/interfaces';
import { useDbStore } from '../stores/db-store/store';

const useRandomTests = () => {
  const { getAllCards, getAllCardsByFilter } = useDbStore();

  const getRandomTests = (): Promise<CardStored[]> => {
    return new Promise((acc, reject) => {
      getAllCards()
        .then((data: CardStored[]) => {
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
  }): Promise<CardStored[]> => {
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

    return getAllCardsByFilter({ filter: { nextSeeDate, labels } });
  };

  return {
    getRandomTests,
    getQuestionAnswersByFilter
  };
};

export default useRandomTests;
