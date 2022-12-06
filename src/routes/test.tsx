/* eslint-disable */

import React, { ReactElement, SyntheticEvent, useEffect, useState } from 'react';
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
import { convertNewLineToHtmlBreak, sanitizeHtml, shuffle } from '../logic/utils';
import { calculateNextSeeDate, calculateNewLastSawDate } from '../logic/questionAnswer';
import useRecordAudio from '../logic/audio';

const Test = (): ReactElement => {
  /** ----------------- CUSTOM HOOK CALLS -------------------- */
  const {
    state: { db, fontSizeClass },
    getAllCardsForTest,
    updateCard
  } = useDbStore();

  const navigate = useNavigate();

  const {
    state
  } = useLocation() as { 
    state: { 
      decksIds?: number[],
      cardsIds?: number[],
      coursesIds?: number[],
    } | null};

  const { listenRecording } = useRecordAudio();

  let decksIds: number[] | undefined;
  let coursesIds: number[] | undefined;
  let cardsIds: number[] | undefined;
  
  if (state) {
    decksIds = state.decksIds;
    coursesIds = state.coursesIds;
    cardsIds = state.cardsIds;
  }

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
  const [customSettingsNew, setCustomSettingsNew] = useState<TestCustomSettings>({
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
      setCards(cards.sort((c1, c2) => c1.orderId - c2.orderId));
    } catch (err) {
      setError('Error getting cards');
    }
  };

  /** ----------------- FUNCTIONS -------------------- */
  const applyCustomSettings = async () => {
    setCurrentCardIndex(0);
    setReviewedCardsIds([]);
    setIsAnswerShown(false);

    let cardsNew = [...cards];

    if (customSettings.levelFilterSettings.length) {
      cardsNew = [...cardsNew.filter((c) => customSettings.levelFilterSettings.includes(c.level))]
    } else {
      
      try {
        const cards = await getAllCardsForTest({
          cardsIds,
          decksIds,
          coursesIds,
        });

        cardsNew = [...cards];
      
      } catch (e) {
        setError('Error getting cards');
      }
    }

    if (customSettings.orderSettings === OrderSettings.none) {
      cardsNew = [...cardsNew.sort((c1, c2) => c1.orderId - c2.orderId)];
    }

    if (customSettings.orderSettings === OrderSettings.reverseOrder) {
      cardsNew = [...cardsNew.sort((c1, c2) => c2.orderId - c1.orderId)];
    }

    if (customSettings.orderSettings === OrderSettings.shuffleCards) {
      const shuffledOrders = shuffle(cardsNew.map((c) => c.id));
      const shuffledCards = [];

      for (const o of shuffledOrders) {
        const card = cardsNew.find((c) => c.id === o);
        if (card) {
          shuffledCards.push(card);
        }
      }
      
      cardsNew = [...shuffledCards];
    }

    if (customSettings.showAnswerSettings) {
      setIsAnswerShown(true);
    }

    setCards(cardsNew);
  };

  const updateShowAnswer = () => {
    if (customSettings.showAnswerSettings) {
      setIsAnswerShown(true);
    } else {
      setIsAnswerShown(false);
    }
  };

  const changeCustomSettings = (newCustomSettings: TestCustomSettings) => {
    setCustomSettingsNew(newCustomSettings);
  };

  /** ----------------- EVENT HANDLERS -------------------- */

  const onNextCard = () => {
    setCurrentCardIndex((currentCardIndex) => {
      if (currentCardIndex === cards.length - 1) {
        return currentCardIndex;
      }
      return currentCardIndex + 1
    });
  };

  const onPrevCard = () => {
    setCurrentCardIndex((currentCardIndex) => {
      if (currentCardIndex === 0) {
        return currentCardIndex;
      }
      return currentCardIndex - 1;
    });
  };

  const onShowAnswer = () => {
    setIsAnswerShown(true);
  };

  const onEndTest = () => {
    navigate(-1);
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
    setCustomSettings(customSettingsNew);
  };

  const onCustomizeFormClose = () => {
    setIsCustomizeFormShown(false);
  };

  const onTouchStart = (event: any) => {
    touches.push({
      posX: event.touches[0].clientX,
      posY: event.touches[0].clientY,
    });
  };

  const onTouchMove = (event: any) => {
    isSwipe = true;
    touches.push({
      posX: event.touches[0].clientX,
      posY: event.touches[0].clientY,
    });
  };

  const onTouchEnd = () => {
    const detectSwipe = () => {
      const firstTouch = touches[0];
      const lastTouch = touches[touches.length - 1];
  
      const xDiff = Math.abs(firstTouch.posX - lastTouch.posX);
      const yDiff = Math.abs(firstTouch.posY - lastTouch.posY);
  
      if (xDiff > yDiff && xDiff > 40 && isSwipe) {
        if (firstTouch.posX > lastTouch.posX) {
          onNextCard();
        } else {
          onPrevCard();
        }
      }
  
      isSwipe = false;
      touches = [];
    }

    const detectDoubleTap = () => {
      let currentTime = new Date().getTime();
      let tapLength = currentTime - lastTap;

      clearTimeout(timeout);
      if (tapLength < 500 && tapLength > 0) {
        onShowAnswer();
      } else {
        timeout = setTimeout(() => {
          clearTimeout(timeout);
        }, 500);
      }
      
      lastTap = currentTime;
    };


    detectSwipe();
    detectDoubleTap();
  };

  const onClickPlayAudio = () => {
    if (currentCard.recordingId) {
      listenRecording(currentCard.recordingId);
    }
  };


  /** ----------------- VARIABLES ------------------------------ */
  let touches: any[] = [];
  let isSwipe: boolean = false;

  let lastTap = 0;
  let timeout: any;
  
  const currentCard = cards[currentCardIndex];
  const showPrevBtn = currentCardIndex > 0 && !isCustomizeFormShown && !endingTest;
  const showNextBtn = currentCardIndex < cards.length - 1 && !isCustomizeFormShown && !endingTest;

  const total = cards.length.toString();
  const current = (currentCardIndex + 1).toString();
  const reviewed = reviewedCardsIds.length.toString();

  const mobileMenuWhenPlaying = () => {
    return (
      <MobileMenu>
          <MobileSubmenu className="space-evenly">
            <MobileMenuItem onClick={onCustomize} className="icon-btn settings-btn"/>
            {cards.length &&
              <>
                <MobileMenuItem onClick={onSelectHard} className="icon-btn hard-btn"/>
                <MobileMenuItem onClick={onSelectGood} className="icon-btn good-btn"/>
                <MobileMenuItem onClick={onSelectEasy} className="icon-btn easy-btn"/>
              </>
            }
            <MobileMenuItem onClick={onEndTest} className="icon-btn end-test-btn"/>
          </MobileSubmenu>
        
          {cards.length && 
            <MobileSubmenu className='space-evenly'>
              <MobileMenuItem onClick={onPrevCard} className={`icon-btn prev-mobile-btn ${showPrevBtn ? '' : 'hidden'}`}/>
              <MobileMenuItem onClick={onShowAnswer} className="icon-btn show-answer-btn"/>
              {currentCard.recordingId && 
                <MobileMenuItem onClick={onClickPlayAudio} className="icon-btn play-audio-btn"/>
              }
              <MobileMenuItem onClick={onNextCard} className={`icon-btn next-mobile-btn ${showNextBtn ? '' : 'hidden'}`}/>
            </MobileSubmenu>
          }
      </MobileMenu>
    );
  };

  const mobileMenuWhenCustomizing = () => {
    return (
      <MobileMenu>
        <MobileSubmenu className="space-evenly">
          <MobileMenuItem onClick={onCustomizeFormPlay} text="Play"/>
          <MobileMenuItem onClick={onCustomizeFormClose} text="Close"/>
        </MobileSubmenu>
      </MobileMenu>
    )
  };

  const getMobileMenu = () => {
    if (isCustomizeFormShown) {
      return mobileMenuWhenCustomizing();
    } else {
      return mobileMenuWhenPlaying();
    }
  }

  const desktopLevelBtns = () => {
    return (
      <div className="question-btns">
        <PrimaryButton text="Hard" onClick={onSelectHard} />
        <PrimaryButton text="Good" onClick={onSelectGood} />
        <PrimaryButton text="Easy" onClick={onSelectEasy} />
      </div>
    );
  }

  const desktopPrevBtn = () => {
    return (
      <MobileMenuItem 
        className={`icon-btn prev-mobile-btn desktop ${showPrevBtn ? '' : 'hidden'}`} 
        onClick={onPrevCard} 
      />
    );
  }

  const desktopNextBtn = () => {
    return (
      <MobileMenuItem 
        className={`icon-btn next-mobile-btn desktop ${showNextBtn ? '' : 'hidden'}`} 
        onClick={onNextCard} 
      />
    );
  }

  /** ----------------- RETURN --------------------------------- */

  return (
    <div className={`page-wrapper ${fontSizeClass} test-page-wrapper`}>
      <div className="top-section">
        <ButtonsGroup className={'margin-top-medium wrap'}>
          <SecondaryButton text="Customize" onClick={onCustomize} />
          <SecondaryButton text="End test" onClick={onEndTest} />
        </ButtonsGroup>

        <StatisticsGroup>
          <Statistics description="total" value={total} />
          <Statistics description="current" value={current} />
          <Statistics description="reviewed" value={reviewed} />
        </StatisticsGroup>
      </div>
      {cards.length && (
        <div 
          onTouchStart={onTouchStart} 
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          className="bottom-section mobile-margin-exterior">

          <div className="test-wrapper">
            <div className="test-buttons-wrapper">
              {desktopPrevBtn()}
              {desktopLevelBtns()}
              {desktopNextBtn()}
            </div>

            {currentCard.recordingId && 
              <ButtonsGroup>
                <MobileMenuItem
                  onClick={onClickPlayAudio}
                  className={`icon-btn play-audio-btn desktop`}
                />
              </ButtonsGroup>
            }

            <div 
              className="question" 
              dangerouslySetInnerHTML={{
                __html: sanitizeHtml(convertNewLineToHtmlBreak(currentCard.question)) 
              }}
            />

            {isAnswerShown && 
              <div className='answer-wrapper'>
                <div className='line'></div>
                <div 
                  className="answer" 
                  dangerouslySetInnerHTML={{
                    __html: sanitizeHtml(convertNewLineToHtmlBreak(currentCard.answer)) 
                  }}
                />
              </div>
            }

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

      {getMobileMenu()}
    </div>
  );
};

export default Test;
