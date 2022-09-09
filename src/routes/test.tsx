import React, { ReactElement, useState } from 'react';

import useRandomTests from '../hooks/useRandomTests';
import DisplayCards from '../components/DisplayCards';
import { Card, QuestionAnswerStored } from '../types';

const Test = (): ReactElement => {
  const [cards, setCards] = useState<Card[]>([]);
  const [finish, setFinish] = useState(false);

  const { getRandomTests } = useRandomTests();

  const getNewTests = (): void => {
    getRandomTests()
      .then((randomTests: QuestionAnswerStored[]) => {
        setCards(randomTests);
      })
      .catch((err) => {
        console.log('Err getNewTests', err);
      });
  };

  const onFinish = (): void => {
    setFinish(true);
  };

  return (
    <div>
      <button onClick={getNewTests}>Get new tests</button>
      {Boolean(cards.length) && <DisplayCards cards={cards} onFinish={onFinish} />}
      {finish && <div>Congrats</div>}
    </div>
  );
};

export default Test;
