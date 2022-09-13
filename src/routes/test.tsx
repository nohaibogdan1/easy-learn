/* eslint-disable */

import React, { ReactElement, useEffect, useState } from 'react';

import useRandomTests from '../hooks/useRandomTests';
import DisplayCards from '../components/DisplayCards';
import FiltersSummary from '../components/FiltersSummary';
import { Card, Filter, LabelStored, QuestionAnswerStored, SelectedLevels } from '../types';
import Filters from '../components/Filters';
import { LEVELS } from '../constants';
import { useDbStore } from '../stores/db-store/store';

import './test.css';

const Test = (): ReactElement => {
  const [cards, setCards] = useState<Card[]>([]);
  const [today, setToday] = useState(false);
  const [levels, setLevels] = useState<SelectedLevels>({
    [LEVELS.EASY]: false,
    [LEVELS.MEDIUM]: false,
    [LEVELS.HARD]: false
  });
  const [start, setStart] = useState(true);
  const [finish, setFinish] = useState(false);
  const [labels, setLabels] = useState<LabelStored[]>([]);
  const [selectedLabels, setSelectedLabels] = useState<LabelStored[]>([]);
  const [questionsFinished, setQuestionsFinished] = useState<number>(0);

  const {
    state: { db },
    getAllLabels
  } = useDbStore();

  const { getQuestionAnswersByFilter } = useRandomTests();

  useEffect(() => {
    (async () => {
      if (db) {
        const storedLabels = await getAllLabels();
        setLabels(storedLabels);
        return;
      }
      setLabels([]);
    })();
  }, [Boolean(db)]);

  const inProgress = !start && !finish;

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
    const label = labels.find((l) => l.id === labelId);

    if (label) {
      setSelectedLabels((labels) => [...labels, label]);
    } else {
      setSelectedLabels((labels) => [...labels]);
    }
  };

  const onEndTesting = () => {
    setFinish(true);
  };

  const onOk = () => {
    setFinish(true);
    setStart(true);
  };

  const onAnswerQuestion = (): void => {
    setQuestionsFinished((questionsFinished) => questionsFinished + 1);
  };

  return (
    <div className="main">
      {false && <FiltersSummary labels={selectedLabels} levels={levels} today={today} />}
      {inProgress && (
        <div className="close-btn-wrapper">
          <button className="close-btn" onClick={onEndTesting}></button>
        </div>
      )}
      {start && (
        <Filters
          today={today}
          levels={levels}
          labels={labels}
          setToday={setToday}
          setLevels={setLevels}
          onSelectLabel={onSelectLabel}
        />
      )}
      {start && <button onClick={getFilteredTests}>Get tests</button>}
      {!finish && Boolean(cards.length) && (
        <DisplayCards cards={cards} onFinish={onFinish} onAnswerQuestion={onAnswerQuestion} />
      )}
      {!start && finish && (
        <div>
          Congrats: you answered at {questionsFinished} questions
          <button onClick={onOk}>ok</button>
        </div>
      )}
      {!start && !Boolean(cards.length) && <div>There are no tests</div>}
    </div>
  );
};

export default Test;
