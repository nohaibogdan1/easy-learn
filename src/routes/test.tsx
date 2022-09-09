import React, { ReactElement, useState } from 'react';

import useRandomTests from '../hooks/useRandomTests';
import DisplayCards from '../components/DisplayCards';
import { Card, Filter, QuestionAnswerStored, SelectedLevels } from '../types';
import Filters from '../components/Filters';
import { LEVELS } from '../constants';

const Test = (): ReactElement => {
  const [cards, setCards] = useState<Card[]>([]);
  const [finish, setFinish] = useState(false);
  const [today, setToday] = useState(false);
  const [levels, setLevels] = useState<SelectedLevels>({
    [LEVELS.EASY]: false,
    [LEVELS.MEDIUM]: false,
    [LEVELS.HARD]: false,
  });

  const { getRandomTests, getQuestionAnswersByFilter } = useRandomTests();

  const getNewTests = (): void => {
    getRandomTests()
      .then((randomTests: QuestionAnswerStored[]) => {
        setCards(randomTests);
      })
      .catch((err) => {
        console.log('Err getNewTests', err);
      });
  };

  const getFilteredTests = (): void => {
    getQuestionAnswersByFilter({ today, levels })
      .then((tests: QuestionAnswerStored[]) => {
        setCards(tests);
      })
      .catch((err) => {
        console.log('Err get qa for filter', err);
      });
  };

  const onFinish = (): void => {
    setFinish(true);
  };

  return (
    <div>
      <Filters today={today} levels={levels} setToday={setToday} setLevels={setLevels}/>
      <button onClick={getFilteredTests}>Get tests</button>
      {Boolean(cards.length) && <DisplayCards cards={cards} onFinish={onFinish} />}
      {finish && <div>Congrats</div>}
    </div>
  );
};

export default Test;
