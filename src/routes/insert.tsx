/* eslint-disable */
import React, { ReactElement, useState } from 'react';

import { QuestionAnswerInsertion, Label } from '../types';
import useDb from '../db/useDb';
import LabelComponent from '../components/Label';

const Insert = (): ReactElement => {
  const [data, setData] = useState<QuestionAnswerInsertion>({
    question: '',
    answer: '',
    labels: []
  });

  const { insertQuestionAnswer, insertLabels } = useDb();

  const addLabel = (text: string) => {
    setData((data) => {
      const uniqueLabelsSet = Array.from(new Set([...data.labels.map((l) => l.text), text]));
      const uniqueLabels = uniqueLabelsSet.map((text) => ({ text }));

      console.log('uniqueLabels', uniqueLabels);

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

    insertQuestionAnswer({
      question: data.question,
      answer: data.answer
    }).then((questionAnswerId: number) => {
      console.log('addQuestionAnswer: questionAnswerId', questionAnswerId);

      insertLabels({
        questionAnswerId,
        labels: data.labels
      });
    });
  };

  return (
    <div>
      <form>
        <input
          value={data.question}
          type="text"
          name="question"
          id="question"
          onChange={changeQuestionAnswer}
        />
        <input
          value={data.answer}
          type="text"
          name="answer"
          id="answer"
          onChange={changeQuestionAnswer}
        />
        Labels:
        <ul>
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
