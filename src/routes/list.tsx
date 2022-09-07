import React, { useState, ReactElement } from 'react';

import { QuestionAnswerStored } from '../types';
import useDb from '../db/useDb';

const List = (): ReactElement => {
  const [data, setData] = useState<QuestionAnswerStored[]>([]);

  const { get } = useDb();

  const getStoredData = (): void => {
    const a = get();
    a.then((i) => {
      console.log('i', i);
      setData(i);
    });
  };

  return (
    <div>
      <button onClick={getStoredData}>Get data</button>
      <div>
        Data:
        <ul>
          {data.map((item) => {
            return (
              <li key={item.id}>
                <div>Question: {item.question}</div>
                <div>Answer: {item.answer}</div>
                <div>Label: {item.label}</div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default List;
