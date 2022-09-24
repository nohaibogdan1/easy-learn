/* eslint-disable */

import React, { ReactElement, useEffect, useState } from 'react';

import useRandomTests from '../hooks/useRandomTests';
import DisplayCards from '../components/DisplayCards';
import { Filter, SelectedLevels } from '../types';
import { CardStored, Card } from '../data/interfaces';
import { LEVELS, ICON_BUTTONS_CLASSES, BUTTONS_TEXT } from '../constants';
import { useDbStore } from '../stores/db-store/store';
import Statistics from '../components/Statistics';
import StatisticsGroup from '../components/StatisticsGroup';
import PrimaryButton from '../components/buttons/PrimaryButton';
import SecondaryButton from '../components/buttons/SecondaryButton';
import ButtonsGroup from '../components/buttons/ButtonsGroup';
import MobileMenu from '../components/mobile-menu/MobileMenu';
import MobileSubmenu from '../components/mobile-menu/MobileSubmenu';
import MobileMenuItem from '../components/mobile-menu/MobileMenuItem';

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
    <div className="page-wrapper test-page-wrapper">
      <div className="top-section">
        <ButtonsGroup>
          <SecondaryButton text="customize" />
          <SecondaryButton text="cancel" />
        </ButtonsGroup>
        <StatisticsGroup>
          <Statistics description="total" value="39" />
          <Statistics description="current" value="10" />
          <Statistics description="answered" value="27" />
        </StatisticsGroup>
      </div>
      <div className="bottom-section mobile-margin-exterior">
        <div className="test-wrapper">
          <div className="test-buttons-wrapper">
            <button className="nav-card-btn">{'<'}</button>
            <div className="question-btns">
              <PrimaryButton text={BUTTONS_TEXT.SHOW_ANSWER} />
              {/* <PrimaryButton text={BUTTONS_TEXT.EASY}/> 
              <PrimaryButton text={BUTTONS_TEXT.GOOD}/>
              <PrimaryButton text={BUTTONS_TEXT.HARD}/> */}
            </div>
            <button className="nav-card-btn">{'>'}</button>
          </div>
          <div className="question">
            It is a ersions have evolved over the years, sometimes by accident, sometimes on purpose
            (injected humour and the like).
          </div>
          <div className="answer">
            ill uncover many web sites still in their infancy. Various versions have evolved over
            the years, sometimes by accident, sometimes on purose (injected humour and the like.
          </div>
        </div>
      </div>

      <MobileMenu>
        <MobileSubmenu className="space-evenly">
          {/* <MobileMenuItem text={BUTTONS_TEXT.SHOW_ANSWER}/> */}
          <MobileMenuItem text={BUTTONS_TEXT.EASY} />
          <MobileMenuItem text={BUTTONS_TEXT.GOOD} />
          <MobileMenuItem text={BUTTONS_TEXT.HARD} />
        </MobileSubmenu>
        <MobileSubmenu className="space-evenly">
          <MobileMenuItem className={`icon-btn ${ICON_BUTTONS_CLASSES.CUSTOMIZE}`} />
          <MobileMenuItem className={`icon-btn ${ICON_BUTTONS_CLASSES.PREV}`} />
          <MobileMenuItem className={`icon-btn ${ICON_BUTTONS_CLASSES.NEXT}`} />
          <MobileMenuItem className={`icon-btn ${ICON_BUTTONS_CLASSES.BACK}`} />
        </MobileSubmenu>
      </MobileMenu>
    </div>
  );
};

export default Test;
