/* eslint-disable */
import React, { ReactElement, useState } from 'react';

import { Card, NextSeeDate } from '../types';
import { LEVELS } from '../constants';
import { calculateNewLastSawDate, calculateNextSeeDate } from '../logic/questionAnswer';
import { formatDate, isTruthyValue } from '../logic/utils';
import './DisplayCards.css';
import { useDbStore } from '../stores/db-store/store';

const DisplayCards = ({
  cards,
  onFinish,
  onAnswerQuestion
}: {
  cards: Card[];
  onFinish: () => void;
  onAnswerQuestion: () => void;
}): ReactElement => {
  const {
    updateQuestionAnswer,
    insertLabels,
    findLabelByText,
    addLabelToQuestionAnswer,
    removeLabelsFromQA
  } = useDbStore();

  const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);
  const [showAnswer, setShowAnswer] = useState(false);

  const currentCard: Card | undefined = cards[currentCardIndex];

  const getFormatted = (): {
    nextSeeDate: NextSeeDate | null;
    nextSeeDateFormatted: NextSeeDate | null;
    lastSawDateFormatted: string | null;
  } => {
    if (!isTruthyValue(currentCard)) {
      return {
        nextSeeDate: null,
        nextSeeDateFormatted: null,
        lastSawDateFormatted: null
      };
    }

    const nextSeeDate = calculateNextSeeDate(currentCard.lastSawDate);
    const lastSawDate: string = currentCard.lastSawDate || new Date().getTime().toString();
    const lastSawDateFormatted: string = formatDate(lastSawDate);
    const nextSeeDateFormatted: NextSeeDate = {
      [LEVELS.EASY]: formatDate(nextSeeDate[LEVELS.EASY]),
      [LEVELS.MEDIUM]: formatDate(nextSeeDate[LEVELS.MEDIUM]),
      [LEVELS.HARD]: formatDate(nextSeeDate[LEVELS.HARD])
    };

    return {
      nextSeeDate,
      nextSeeDateFormatted,
      lastSawDateFormatted
    };
  };

  const { nextSeeDate, nextSeeDateFormatted, lastSawDateFormatted } = getFormatted();

  const showCard = currentCard && nextSeeDateFormatted && nextSeeDate && lastSawDateFormatted;

  const getNextCard = (level: LEVELS) => () => {
    if (!showCard) {
      setCurrentCardIndex(currentCardIndex);
      return;
    }

    onAnswerQuestion();

    const newLastSawDate = calculateNewLastSawDate();

    (async () => {
      try {
        await updateQuestionAnswer({
          ...currentCard,
          lastSawDate: newLastSawDate,
          nextSeeDate: nextSeeDate[level]
        });

        // remove any level label
        const otherLevels = Object.values(LEVELS).filter((l) => l !== level);
        await removeLabelsFromQA({
          questionAnswerId: currentCard.id,
          labels: otherLevels
        });

        // add the new level label
        const foundLabelId = await findLabelByText(level);

        if (foundLabelId) {
          await addLabelToQuestionAnswer({
            questionAnswerId: currentCard.id,
            labelId: foundLabelId
          });
        } else {
          await insertLabels({
            labels: [
              {
                text: level
              }
            ],
            questionAnswerId: currentCard.id
          });
        }

        // update state
        const nextCardIndex = currentCardIndex + 1;
        setCurrentCardIndex(nextCardIndex);
        setShowAnswer(false);
        if (nextCardIndex === cards.length) {
          onFinish();
        }
      } catch (err) {
        // update state
        setCurrentCardIndex(currentCardIndex);
      }
    })();
  };

  const onShowAnswer = () => {
    if (!showAnswer) {
      setShowAnswer(true);
    }
  };

  return (
    <div className="wrapper">
      {showCard && (
        <div className="card">
          <div className="buttons">
            {!showAnswer && <button onClick={onShowAnswer}>Show answer</button>}
            {showAnswer && (
              <button onClick={getNextCard(LEVELS.EASY)} disabled={!showAnswer}>
                {LEVELS.EASY}
              </button>
            )}
            {showAnswer && (
              <button onClick={getNextCard(LEVELS.MEDIUM)} disabled={!showAnswer}>
                {LEVELS.MEDIUM}
              </button>
            )}
            {showAnswer && (
              <button onClick={getNextCard(LEVELS.HARD)} disabled={!showAnswer}>
                {LEVELS.HARD}
              </button>
            )}
          </div>
          <div className={`qa-wrapper ${showAnswer ? '' : 'question-center'}`}>
            <div className={'question'}>{currentCard.question} ?</div>
            <div className={`answer ${showAnswer ? 'visible' : 'hidden'}`}>
              {currentCard.answer}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DisplayCards;
