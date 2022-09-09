/* eslint-disable */

import React, { ReactElement, useState } from 'react';

import useRandomTests from '../hooks/useRandomTests';
import DisplayCards from '../components/DisplayCards';
import { Card, Filter, QuestionAnswerStored, SelectedLevels } from '../types';
import Filters from '../components/Filters';
import { LEVELS } from '../constants';

import './test.css';

const Test = (): ReactElement => {
  const [cards, setCards] = useState<Card[]>([]);
  const [finish, setFinish] = useState(false);
  const [today, setToday] = useState(false);
  const [levels, setLevels] = useState<SelectedLevels>({
    [LEVELS.EASY]: false,
    [LEVELS.MEDIUM]: false,
    [LEVELS.HARD]: false
  });
  const [start, setStart] = useState(true);

  const { getQuestionAnswersByFilter } = useRandomTests();

  const getFilteredTests = (): void => {
    setFinish(false);
    setStart(false);

    (async () => {
      try {
        const tests = await getQuestionAnswersByFilter({ today, levels });
        setCards(tests);
      } catch (err) {
        console.log('Err get qa for filter', err);
        setCards(cards);
      }
    })();
  };

  const onFinish = (): void => {
    setFinish(true);
    setStart(true);
  };

  return (
    <div className="main">
      <Filters today={today} levels={levels} setToday={setToday} setLevels={setLevels} />
      <button onClick={getFilteredTests}>Get tests</button>
      {!finish && Boolean(cards.length) && <DisplayCards cards={cards} onFinish={onFinish} />}
      {finish && <div>Congrats</div>}
      {!start && !Boolean(cards.length) && <div>There are no tests</div>}
    </div>
  );
};

export default Test;
