/* eslint-disable */
import React, { ReactElement, useState } from 'react';

import { CardAdd } from '../data/interfaces';
import './insert.css';
import { useDbStore } from '../stores/db-store/store';

const Insert = (): ReactElement => {
  const [data, setData] = useState<CardAdd>({
    question: '',
    answer: ''
  });

  const { insertCard } = useDbStore();

  const changeQuestionAnswer = (event: React.BaseSyntheticEvent) => {
    const { name, value } = event.target;

    setData((data) => ({
      ...data,
      [name]: value
    }));
  };

  const addQuestionAnswer = (event: React.SyntheticEvent) => {
    event.preventDefault();

    (async () => {
      try {
        const questionAnswerId = await insertCard({
          question: data.question,
          answer: data.answer
        });

        setData({
          question: '',
          answer: ''
        });
      } catch (err) {}
    })();
  };

  return (
    <div>
      <form>
        <div className="label">Question: </div>
        <textarea
          value={data.question}
          name="question"
          id="question"
          onChange={changeQuestionAnswer}
        />
        <div className="label">Answer: </div>
        <textarea value={data.answer} name="answer" id="answer" onChange={changeQuestionAnswer} />
        <input type="submit" onClick={addQuestionAnswer} value="Add" />
      </form>
    </div>
  );
};

export default Insert;
