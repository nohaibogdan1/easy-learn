/* eslint-disable */
import React, { ReactElement, useState } from 'react';

import { Card, NextSeeDate } from '../types';
import { LEVELS } from '../constants';
import { calculateNewLastSawDate, calculateNextSeeDate } from '../logic/questionAnswer';
import { formatDate, isTruthyValue } from '../logic/utils';
import useDbMethods from '../db/useDb';

const DisplayCards = ({
  cards,
  onFinish
}: {
  cards: Card[];
  onFinish: () => void;
}): ReactElement => {
  const { updateQuestionAnswer, insertLabels, findLabelByText, addLabelToQuestionAnswer } =
    useDbMethods();

  const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);

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

    const newLastSawDate = calculateNewLastSawDate();

    updateQuestionAnswer({
      ...currentCard,
      lastSawDate: newLastSawDate,
      nextSeeDate: nextSeeDate[level]
    })
      .then(() => {
        findLabelByText(level)
          .then((foundLabelId) => {
            if (foundLabelId) {
              addLabelToQuestionAnswer({
                questionAnswerId: currentCard.id,
                labelId: foundLabelId
              })
                .then(() => {
                  const nextCardIndex = currentCardIndex + 1;
                  setCurrentCardIndex(nextCardIndex);
                  if (nextCardIndex === cards.length) {
                    onFinish();
                  }
                })
                .catch(() => {
                  setCurrentCardIndex(currentCardIndex);
                });
            } else {
              insertLabels({
                labels: [
                  {
                    text: level
                  }
                ],
                questionAnswerId: currentCard.id
              })
                .then(() => {
                  const nextCardIndex = currentCardIndex + 1;
                  setCurrentCardIndex(nextCardIndex);
                  if (nextCardIndex === cards.length) {
                    onFinish();
                  }
                })
                .catch(() => {
                  setCurrentCardIndex(currentCardIndex);
                });
            }
          })
          .catch(() => {
            setCurrentCardIndex(currentCardIndex);
          });
      })
      .catch(() => {
        setCurrentCardIndex(currentCardIndex);
      });
  };

  return (
    <div>
      {showCard && (
        <div>
          <div>Question: {currentCard.question}</div>
          <div>Answer: {currentCard.answer}</div>
          <div>Last seen {lastSawDateFormatted}</div>
          <button onClick={getNextCard(LEVELS.EASY)}>
            {LEVELS.EASY} - {nextSeeDateFormatted[LEVELS.EASY]}
          </button>
          <button onClick={getNextCard(LEVELS.MEDIUM)}>
            {LEVELS.MEDIUM} - {nextSeeDateFormatted[LEVELS.MEDIUM]}
          </button>
          <button onClick={getNextCard(LEVELS.HARD)}>
            {LEVELS.HARD} - {nextSeeDateFormatted[LEVELS.HARD]}
          </button>
        </div>
      )}
    </div>
  );
};

export default DisplayCards;
