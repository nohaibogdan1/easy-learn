import React, { ReactElement, useState } from 'react';

import { QuestionAnswer } from '../types';
import useDb from '../db/useDb';

const Insert = (): ReactElement => {
  const [questionAnswer, setQuestionAnswer] = useState<QuestionAnswer>({
    question: '',
    answer: '',
    label: ''
  });

  const { insert } = useDb();

  const changeQuestionAnswer = (event: React.BaseSyntheticEvent) => {
    const { name, value } = event.target;

    setQuestionAnswer((questionAnswer) => ({
      ...questionAnswer,
      [name]: value
    }));
  };

  const addQuestionAnswer = (event: React.SyntheticEvent) => {
    event.preventDefault();
    insert(questionAnswer);
  };

  return (
    <div>
      <form>
        <input
          value={questionAnswer.question}
          type="text"
          name="question"
          id="question"
          onChange={changeQuestionAnswer}
        />
        <input
          value={questionAnswer.answer}
          type="text"
          name="answer"
          id="answer"
          onChange={changeQuestionAnswer}
        />
        <input
          value={questionAnswer.label}
          type="label"
          name="label"
          id="label"
          onChange={changeQuestionAnswer}
        />
        <input type="submit" onClick={addQuestionAnswer} value="Add" />
      </form>

      <div>question: {questionAnswer.question}</div>
      <div>answer: {questionAnswer.answer}</div>
      <div>label: {questionAnswer.label}</div>
    </div>
  );
};

export default Insert;
