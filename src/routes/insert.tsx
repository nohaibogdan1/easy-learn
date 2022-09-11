/* eslint-disable */
import React, { ReactElement, useState } from 'react';

import { QuestionAnswerInsertion, Label } from '../types';
import useDb from '../db/useDb';
import LabelComponent from '../components/Label';
import './insert.css';
import { useDbStore } from '../stores/db-store/store';

const Insert = (): ReactElement => {
  const [data, setData] = useState<QuestionAnswerInsertion>({
    question: '',
    answer: '',
    labels: []
  });

  const { insertQuestionAnswer, insertLabels } = useDbStore();

  const addLabel = (text: string) => {
    setData((data) => {
      const uniqueLabelsSet = Array.from(new Set([...data.labels.map((l) => l.text), text]));
      const uniqueLabels = uniqueLabelsSet.map((text) => ({ text }));

      return {
        ...data,
        labels: uniqueLabels
      };
    });
  };

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
        const questionAnswerId = await insertQuestionAnswer({
          question: data.question,
          answer: data.answer
        });

        await insertLabels({
          questionAnswerId,
          labels: data.labels
        });

        setData({
          question: '',
          answer: '',
          labels: []
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
        <div className="label">Labels:</div>
        <ul className="labels">
          {data.labels.map((l) => (
            <li key={l.text}>{l.text}</li>
          ))}
        </ul>
        <LabelComponent addLabel={addLabel} />
        <input type="submit" onClick={addQuestionAnswer} value="Add" />
      </form>
    </div>
  );
};

export default Insert;
