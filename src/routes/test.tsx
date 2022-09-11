/* eslint-disable */

import React, { ReactElement, useEffect, useState } from 'react';

import useRandomTests from '../hooks/useRandomTests';
import DisplayCards from '../components/DisplayCards';
import { Card, Filter, LabelStored, QuestionAnswerStored, SelectedLevels } from '../types';
import Filters from '../components/Filters';
import { LEVELS } from '../constants';
import { useDbStore } from '../stores/db-store/store';

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
  const [labels, setLabels] = useState<LabelStored[]>([]);

  const {state: {db}, getAllLabels} = useDbStore();

  const { getQuestionAnswersByFilter } = useRandomTests();

  useEffect(() => {
    (async () => {
      if (db) {
        console.log("BLAAA")
        const storedLabels = await getAllLabels();
        setLabels(storedLabels);
        return;
      }
      setLabels([]);
    })();
  }, [Boolean(db)]);

  useEffect(() => {
    console.log('REMDER');
  }, [])

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
  
  const onSelectLabel = (labelId: number): void => {

  };

  return (
    <div className="main">
      <Filters 
        today={today} 
        levels={levels} 
        labels={labels} 
        setToday={setToday} 
        setLevels={setLevels} 
        onSelectLabel={onSelectLabel}
      />
      <button onClick={getFilteredTests}>Get tests</button>
      {!finish && Boolean(cards.length) && <DisplayCards cards={cards} onFinish={onFinish} />}
      {finish && <div>Congrats</div>}
      {!start && !Boolean(cards.length) && <div>There are no tests</div>}
    </div>
  );
};

export default Test;
