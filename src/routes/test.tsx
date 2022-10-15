/* eslint-disable */

import React, { ReactElement, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { Filter, SelectedLevels } from '../types';
import { CardStored, Card, TestCustomSettings, CardAndDeckStored } from '../data/interfaces';
import { LEVELS, ICON_BUTTONS_CLASSES, BUTTONS_TEXT, OrderSettings } from '../constants';
import { useDbStore } from '../stores/db-store/store';
import Statistics from '../components/Statistics';
import StatisticsGroup from '../components/StatisticsGroup';
import PrimaryButton from '../components/buttons/PrimaryButton';
import SecondaryButton from '../components/buttons/SecondaryButton';
import ButtonsGroup from '../components/buttons/ButtonsGroup';
import MobileMenu from '../components/mobile-menu/MobileMenu';
import MobileSubmenu from '../components/mobile-menu/MobileSubmenu';
import MobileMenuItem from '../components/mobile-menu/MobileMenuItem';
import { getMenuStateForTestPage, mapButtonsTextToHandlers } from '../logic/menu-helpers';
import { ROOT_NAME } from '../constants';
import CustomizeForm from '../components/forms/CustomizeForm';
import './test.css';
import { shuffle } from '../logic/utils';
import { calculateNextSeeDate, calculateNewLastSawDate } from '../logic/questionAnswer';

const Test = (): ReactElement => {
  /** ----------------- CUSTOM HOOK CALLS -------------------- */
  const {
    state: { db },
    getAllCardsForTest,
    updateCard
  } = useDbStore();

  const navigate = useNavigate();

  const {
    state: { decksIds, coursesIds, cardsIds }
  } = useLocation() as { 
    state: { 
      decksIds?: number[],
      cardsIds?: number[],
      coursesIds?: number[],
    }};

  /** ----------------- USE STATE -------------------- */
  const [cards, setCards] = useState<CardAndDeckStored[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [endingTest, setEndingTest] = useState(false);
  const [isAnswerShown, setIsAnswerShown] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [reviewedCardsIds, setReviewedCardsIds] = useState<number[]>([]);
  const [isCustomizeFormShown, setIsCustomizeFormShown] = useState(false);
  const [customSettings, setCustomSettings] = useState<TestCustomSettings>({
    orderSettings: OrderSettings.none,
    showAnswerSettings: false,
    levelFilterSettings: []
  });
  const [customSettingsChanged, setCustomSettingsChanged] = useState(false);

  /** ----------------- USE EFFECT -------------------- */
  useEffect(() => {
    if (db) {
      (async () => {
        await getCardsData();
      })();
    }
  }, [Boolean(db)]);

  useEffect(() => {
    updateShowAnswer();
  }, [currentCardIndex]);

  useEffect(() => {
    applyCustomSettings();
  }, [customSettingsChanged]);

  /** ----------------- DATA HANDLING FUNCTIONS -------------------- */
  const getCardsData = async () => {
    try {
      const cards = await getAllCardsForTest({
        cardsIds,
        decksIds,
        coursesIds,
      });
      setCards(cards);
    } catch (err) {
      setError('Error getting cards');
    }
  };

  /** ----------------- FUNCTIONS -------------------- */
  const applyCustomSettings = () => {
    setCurrentCardIndex(0);
    setReviewedCardsIds([]);
    setCards((cards) => cards);
    setIsAnswerShown(false);

    if (customSettings.orderSettings === OrderSettings.none) {
      setCards((cards) => cards.sort((c1, c2) => c1.orderId - c2.orderId));
    }

    if (customSettings.orderSettings === OrderSettings.reverseOrder) {
      setCards((cards) => cards.sort((c1, c2) => c2.orderId - c1.orderId));
    }

    if (customSettings.orderSettings === OrderSettings.shuffleCards) {
      setCards((cards) => {
        const shuffledOrders = shuffle(cards.map((c) => c.id));
        const shuffledCards = [];

        for (const o of shuffledOrders) {
          const card = cards.find((c) => c.id === o);
          if (card) {
            shuffledCards.push(card);
          }
        }

        return shuffledCards;
      });
    }

    if (customSettings.showAnswerSettings) {
      setIsAnswerShown(true);
    }

    if (customSettings.levelFilterSettings.length) {
      setCards((cards) =>
        cards.filter((c) => customSettings.levelFilterSettings.includes(c.level))
      );
    } else {
      getCardsData();
    }
  };

  const updateShowAnswer = () => {
    if (customSettings.showAnswerSettings) {
      setIsAnswerShown(true);
    } else {
      setIsAnswerShown(false);
    }
  };

  const changeCustomSettings = (newCustomSettings: TestCustomSettings) => {
    setCustomSettings(newCustomSettings);
  };

  /** ----------------- EVENT HANDLERS -------------------- */

  const onNextCard = () => {
    setCurrentCardIndex((currentCardIndex) => currentCardIndex + 1);
  };

  const onPrevCard = () => {
    setCurrentCardIndex((currentCardIndex) => {
      if (currentCardIndex === 0) {
        return 0;
      }
      return currentCardIndex - 1;
    });
  };

  const onShowAnswer = () => {
    setIsAnswerShown(true);
  };

  const onEndTest = () => {
    navigate(`/${ROOT_NAME}/cards`);
  };

  const onSelectLevel = async (level: LEVELS) => {
    setReviewedCardsIds((reviewedCardsIds) => {
      if (reviewedCardsIds.includes(currentCard.id)) {
        return [...reviewedCardsIds];
      }
      return [...reviewedCardsIds, currentCard.id];
    });

    try {
      const newNextSeeDate = calculateNextSeeDate(currentCard.lastSawDate);
      const newLastSawDate = calculateNewLastSawDate();
      const data = {
        ...currentCard,
        level,
        lastSawDate: newLastSawDate,
        nextSeeDate: newNextSeeDate[level]
      } as any;

      if (data.orderId) {
        delete data.orderId;
      }

      const update = { ...data } as CardStored;

      await updateCard({
        ...update
      });
    } catch (err) {
      setError('Error when updating level');
    }
  };

  const onSelectEasy = () => {
    onSelectLevel(LEVELS.EASY);
  };

  const onSelectGood = () => {
    onSelectLevel(LEVELS.MEDIUM);
  };

  const onSelectHard = () => {
    onSelectLevel(LEVELS.HARD);
  };

  const onCustomize = () => {
    setIsCustomizeFormShown(true);
    setCustomSettingsChanged(false);
  };

  const onCustomizeFormPlay = () => {
    setIsCustomizeFormShown(false);
    setCustomSettingsChanged(true);
  };

  const onCustomizeFormClose = () => {
    setIsCustomizeFormShown(false);
  };

  /** ----------------- VARIABLES ------------------------------ */

  const buttonTextHandlersMap = {
    [BUTTONS_TEXT.CUSTOMIZE]: onCustomize,
    [BUTTONS_TEXT.END_TEST]: onEndTest,
    [BUTTONS_TEXT.SHOW_ANSWER]: onShowAnswer,
    [BUTTONS_TEXT.NEXT]: onNextCard,
    [BUTTONS_TEXT.PREV]: onPrevCard,
    [BUTTONS_TEXT.EASY]: onSelectEasy,
    [BUTTONS_TEXT.GOOD]: onSelectGood,
    [BUTTONS_TEXT.HARD]: onSelectHard
  };

  const {
    desktopCardSubmenu,
    desktopNavigationSubmenu,
    secondDesktopSubmenu,
    firstMobileSubmenu,
    secondMobileSubmenu
  } = getMenuStateForTestPage({
    isAnswerShown,
    endingTest
  });

  const desktopCardSubmenuButtons = mapButtonsTextToHandlers({
    buttonTextHandlersMap,
    buttonsText: desktopCardSubmenu
  });

  const desktopNavigationSubmenuButtons = mapButtonsTextToHandlers({
    buttonTextHandlersMap,
    buttonsText: desktopNavigationSubmenu
  });

  const secondDekstopSubmenuButtons = mapButtonsTextToHandlers({
    buttonTextHandlersMap,
    buttonsText: secondDesktopSubmenu
  });

  const firstMobileSubmenuButtons = mapButtonsTextToHandlers({
    buttonTextHandlersMap,
    buttonsText: firstMobileSubmenu
  });

  const secondMobileSubmenuButtons = mapButtonsTextToHandlers({
    buttonTextHandlersMap,
    buttonsText: secondMobileSubmenu
  });

  const currentCard = cards[currentCardIndex];
  const showPrevBtn = currentCardIndex > 0;
  const showNextBtn = currentCardIndex < cards.length - 1;

  const total = cards.length.toString();
  const current = (currentCardIndex + 1).toString();
  const reviewed = reviewedCardsIds.length.toString();

  /** ----------------- RETURN --------------------------------- */

  return (
    <div className="page-wrapper test-page-wrapper">
      <div className="top-section">
        <ButtonsGroup className={'margin-top-medium wrap'}>
          {secondDekstopSubmenuButtons.map((btn, idx) => {
            return <SecondaryButton key={idx} text={btn.text} onClick={btn.onClick} />;
          })}
        </ButtonsGroup>
        <StatisticsGroup>
          <Statistics description="total" value={total} />
          <Statistics description="current" value={current} />
          <Statistics description="reviewed" value={reviewed} />
        </StatisticsGroup>
      </div>
      {Boolean(cards.length) && (
        <div className="bottom-section mobile-margin-exterior">
          <div className="test-wrapper">
            <div className="test-buttons-wrapper">
              {showPrevBtn && (
                <button className="nav-card-btn" onClick={onPrevCard}>
                  {'<'}
                </button>
              )}
              <div className="question-btns">
                {desktopCardSubmenuButtons.map((btn, idx) => {
                  return <PrimaryButton key={idx} text={btn.text} onClick={btn.onClick} />;
                })}
              </div>
              {showNextBtn && (
                <button className="nav-card-btn" onClick={onNextCard}>
                  {'>'}
                </button>
              )}
            </div>
            <div className="question">{currentCard.question}</div>
            {isAnswerShown && <div className="answer">{currentCard.answer}</div>}
          </div>
        </div>
      )}

      {isCustomizeFormShown && (
        <CustomizeForm
          play={onCustomizeFormPlay}
          close={onCustomizeFormClose}
          customSettings={customSettings}
          changeCustomSettings={changeCustomSettings}
        />
      )}

      <MobileMenu>
        {Boolean(firstMobileSubmenuButtons.length) && (
          <MobileSubmenu className="space-evenly">
            {firstMobileSubmenuButtons.map((button, idx) => (
              <MobileMenuItem key={idx} text={button.text} onClick={button.onClick} />
            ))}
          </MobileSubmenu>
        )}
        {Boolean(secondMobileSubmenuButtons.length) && (
          <MobileSubmenu>
            {secondMobileSubmenuButtons.map((button, idx) => (
              <MobileMenuItem key={idx} text={button.text} onClick={button.onClick} />
            ))}
          </MobileSubmenu>
        )}
      </MobileMenu>
    </div>
  );
};

export default Test;
