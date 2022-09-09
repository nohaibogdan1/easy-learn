/* eslint-disable */
import React, { ReactElement, useState } from 'react';

import { Card, NextSeeDate } from '../types';
import { LEVELS } from '../constants';
import { calculateNewLastSawDate, calculateNextSeeDate } from '../logic/questionAnswer';
import { formatDate, isTruthyValue } from '../logic/utils';
import useDbMethods from '../db/useDb';
import './DisplayCards.css';

const DisplayCards = ({
  cards,
  onFinish
}: {
  cards: Card[];
  onFinish: () => void;
}): ReactElement => {
  const { 
    updateQuestionAnswer, 
    insertLabels, 
    findLabelByText, 
    addLabelToQuestionAnswer,
    removeLabelsFromQA,
  } = useDbMethods();

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

  const { 
    nextSeeDate, 
    nextSeeDateFormatted, 
    lastSawDateFormatted
  } = getFormatted();

  const showCard = 
    currentCard && 
    nextSeeDateFormatted && 
    nextSeeDate && 
    lastSawDateFormatted;

  const getNextCard = (level: LEVELS) => () => {
    if (!showCard) {
      setCurrentCardIndex(currentCardIndex);
      return;
    }

    const newLastSawDate = calculateNewLastSawDate();

    (async () => {
      try {
        await updateQuestionAnswer({
          ...currentCard,
          lastSawDate: newLastSawDate,
          nextSeeDate: nextSeeDate[level]
        });

        // remove any level label
        const otherLevels = Object.values(LEVELS).filter(l => l !== level);
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
            labels: [{
              text: level
            }],
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
    if (!showAnswer){
      setShowAnswer(true);
    }
  };

  return (
    <div>
      {showCard && (
        <div className='card'>
          <div className='question'>{currentCard.question} ?</div>
          {showAnswer && <div className='answer'>{currentCard.answer}</div>}
          {!showAnswer && <button onClick={onShowAnswer}>Show answer</button>}
          <div className='last-seen'>Last seen {lastSawDateFormatted}</div>
          <div className='buttons'>
            <button onClick={getNextCard(LEVELS.EASY)} disabled={!showAnswer}>
              <div className='level'>{LEVELS.EASY}</div> <div className='next-see-date'>{nextSeeDateFormatted[LEVELS.EASY]}</div>
            </button>
            <button onClick={getNextCard(LEVELS.MEDIUM)} disabled={!showAnswer}>
              <div className='level'>{LEVELS.MEDIUM}</div> <div className='next-see-date'>{nextSeeDateFormatted[LEVELS.MEDIUM]}</div>
            </button>
            <button onClick={getNextCard(LEVELS.HARD)} disabled={!showAnswer}>
              <div className='level'>{LEVELS.HARD}</div> <div className='next-see-date'> {nextSeeDateFormatted[LEVELS.HARD]}</div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DisplayCards;
