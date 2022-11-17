/* eslint-disable */

import React, { BaseSyntheticEvent, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ROOT_NAME } from '../constants';

import { useDbStore } from '../stores/db-store/store';

const AddCardPage = (args: any) => {
  const state = useLocation().state as { deckId?: string } | null; 

  let deckId: string | undefined;

  if (state) {
    deckId = state.deckId;
  }

  const navigate = useNavigate();

  const { insertCard } = useDbStore();

  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  let parsedDeckId: number | undefined;

  if (deckId) {
    parsedDeckId = parseInt(deckId);
  }

  const onChangeQuestion = (event: BaseSyntheticEvent) => {
    setQuestion(event.target.value);
  };

  const onChangeAnswer = (event: BaseSyntheticEvent) => {
    setAnswer(event.target.value);
  };

  const onClickAddCard = async () => {
    if (!question.trim() || !answer.trim()) {
      return;
    }

    await insertCard({
      deckId: parsedDeckId,
      question,
      answer
    });

    if (parsedDeckId) {
      navigate(`/${ROOT_NAME}/decks/${parsedDeckId}`);
    } else {
      navigate(`/${ROOT_NAME}/cards`);
    }
  };

  const onClickAddExistentCard = () => {
    navigate(`/${ROOT_NAME}/cards`);
  };

  const onClickCancel = () => {
    if (parsedDeckId) {
      navigate(`/${ROOT_NAME}/decks/${parsedDeckId}`);
    } else {
      navigate(`/${ROOT_NAME}/cards`);
    }
  };

  return (
    <>
      <div className="add-new-card">
        <button onClick={onClickAddExistentCard}>Add existent card</button>
        <textarea value={question} onChange={onChangeQuestion} />
        <textarea value={answer} onChange={onChangeAnswer} />
        <button onClick={onClickAddCard}>Save</button>
        <button onClick={onClickCancel}>Cancel</button>
      </div>
    </>
  );
};

export default AddCardPage;
