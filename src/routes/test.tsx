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

  // const {
  //   state: { db },
  //   getAllLabels
  // } = useDbStore();

  // const { getQuestionAnswersByFilter } = useRandomTests();

  // useEffect(() => {
  //   (async () => {
  //     if (db) {
  //       const storedLabels = await getAllLabels();
  //       setLabels(storedLabels);
  //       return;
  //     }
  //     setLabels([]);
  //   })();
  // }, [Boolean(db)]);

  // const inProgress = !start && !finish;
  // const showFilters = false;

  // const getFilteredTests = (): void => {
  //   setFinish(false);
  //   setStart(false);

  //   (async () => {
  //     try {
  //       const tests = await getQuestionAnswersByFilter({ today, levels });
  //       setCards(tests);
  //     } catch (err) {
  //       console.log('Err get qa for filter', err);
  //       setCards(cards);
  //     }
  //   })();
  // };

  // const onFinish = (): void => {
  //   setFinish(true);
  //   setStart(true);
  // };

  // const onSelectLabel = (labelId: number): void => {
  //   const label = labels.find((l) => l.id === labelId);

  //   if (label) {
  //     setSelectedLabels((labels) => [...labels, label]);
  //   } else {
  //     setSelectedLabels((labels) => [...labels]);
  //   }
  // };

  // const onEndTesting = () => {
  //   setFinish(true);
  // };

  // const onOk = () => {
  //   setFinish(true);
  //   setStart(true);
  // };

  // const onAnswerQuestion = (): void => {
  //   setQuestionsFinished((questionsFinished) => questionsFinished + 1);
  // };


  return (
    <div className='test-page-wrapper'>
      <div className='top-section'>
        <div className='options-btns-wrapper'>
          <button>
            customize
          </button>
          <button>
            cancel
          </button>
        </div>
        <div className='progress-wrapper'>
            <div>
              <div className='description'>total</div>
              <div className='value'>39</div>
            </div>
            <div>
              <div className='description'>current</div>
              <div className='value'>10</div>
            </div>
            <div>
              <div className='description'>answered</div>
              <div className='value'>27</div>
            </div>
          </div>
      </div>
      <div className='bottom-section'>
        <div className='test-wrapper'>
          <div className='test-buttons-wrapper'>
            <button className='nav-card-btn'>{'<'}</button>
            <div className='question-btns'>
              <button className='primary-btn'>Show answer</button>
              {/* <button className='primary-btn'>Easy</button>
              <button className='primary-btn'>Good</button>
              <button className='primary-btn'>Hard</button> */}
            </div>
            <button className='nav-card-btn'>{'>'}</button>
          </div>
          <div className='question'>It is a ersions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).</div>
          <div className='answer'>ill uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purose (injected humour and the like.</div>
        </div>
      </div>
      <div className='bottom-menu'>
        <div className='deck-answer-btns'>
          {/* <button>Show answer</button> */}
          <button>Easy</button>
          <button>Good</button>
          <button>Hard</button>
        </div>
        <div className='nav-btns'>
          <button className='customize-btn'></button>
          <button className='prev-nav-card-btn'></button>
          <button className='next-nav-card-btn'></button>
          <button className='back-btn'></button>
        </div>
      </div>
    </div>
  );
};

export default Test;
