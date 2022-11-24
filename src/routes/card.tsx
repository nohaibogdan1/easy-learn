/* eslint-disable */

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CardStored } from '../data/interfaces';
import { useDbStore } from '../stores/db-store/store';
import ButtonsGroup from '../components/buttons/ButtonsGroup';
import MobileMenuItem from '../components/mobile-menu/MobileMenuItem';
import ConfirmationForm from '../components/forms/ConfirmationForm';
import { formatToCalendarDate } from '../logic/utils';
import "./card.css";

const CardPage = (args: any) => {
  /** ----------------- CUSTOM HOOK CALLS -------------------- */
  const cardId = parseInt(useParams()?.id ?? "-");

  const { 
    state: {db}, 
    getCard
  } = useDbStore();

  /** ----------------- USE STATE -------------------- */
  const [card, setCard] = useState<CardStored | null>(null);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [showConfirmationForm, setShowConfirmationForm] = useState<Boolean>(false);
  const [confirmationFormError, setConfirmationFormError] = useState<string | null>(null);
  const [questionEditing, setQuestionEditing] = useState(false);
  const [answerEditing, setAnswerEditing] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');

  /** ----------------- USE EFFECT -------------------- */
  useEffect(() => {
    if (db && !isNaN(cardId)) {
      (async () => {
        await getCardData();
      })();
    }
  }, [Boolean(db)]);

  useEffect(() => {
    if (questionEditing || answerEditing) {
      setConfirmationFormError(null);
      setShowConfirmationForm(true);
    }
  }, [questionEditing, answerEditing]);

  useEffect(() => {
    if (!showConfirmationForm) {
      setQuestionEditing(false);
      setAnswerEditing(false);
    }
  }, [showConfirmationForm]);

  useEffect(() => {
    setQuestion(_ => card?.question ?? "");
    setAnswer(_ => card?.answer ?? "");
    setNewQuestion(_ => card?.question ?? "");
    setNewAnswer(_ => card?.answer ?? "");
  }, [JSON.stringify(card)])

  /** ----------------- DATA HANDLING FUNCTIONS -------------------- */
  const getCardData = async () => {
    const cardData = await getCard(cardId);
    setCard(card => cardData ?? card);
  };

  const onConfirmationFormOk = async () => {
    let error = null;

    if (questionEditing) {
      // const data = await 
      // error = data.error; 
    }

    if (answerEditing) {
      // const data = await 
      // error = data.error; 
    }

    if (error) {
      setConfirmationFormError(error);
      return;
    }

    setShowConfirmationForm(false);

    getCardData();
  };

  const onConfirmationFormCancel = () => {
    setShowConfirmationForm(false);
  };

  const onClickEditQuestion = () => {
    setQuestionEditing(true);
  };

  const onClickEditAnswer = () => {
    setAnswerEditing(true);
  };

  /** ----------------- VARIABLES ------------------------------ */
  let displayLastSawDate = null;
  let displayNextSeeDate = null;

  if (card?.lastSawDate) {
    displayLastSawDate = new Date(parseInt(card.lastSawDate)).toString();
  }

  if (card?.nextSeeDate) {
    displayNextSeeDate = new Date(parseInt(card.nextSeeDate)).toString();
  }

  let confirmationFormData;
  let setConfirmationFormData;
  let message = "";

  if (questionEditing) {
    confirmationFormData = newQuestion;
    setConfirmationFormData = setNewQuestion;
    message = "Edit the question";
  }

  if (answerEditing) {
    confirmationFormData = newAnswer;
    setConfirmationFormData = setNewAnswer;
    message = "Edit the answer";
  }

  /** ----------------- RETURN --------------------------------- */
  if (!card) {
    return <div>Card Not Found</div>;
  }
  return (
    <div className="card-page-wrapper">
      <h3>question</h3>
      <div className="question-wrapper">
        <div className="text">{question}</div>
        <MobileMenuItem
          onClick={onClickEditQuestion}
          className={`icon-btn edit-btn`}
        />
      </div>
      <h3>answer</h3>
      <div className="answer-wrapper">
        <div className="text">{answer}</div>
        <MobileMenuItem
          onClick={onClickEditAnswer}
          className={`icon-btn edit-btn`}
        />
      </div>
      <h3>Level of confidence</h3>
      <div>{card.level ?? "No Level"}</div>
      <p>Last saw date: <span>{formatToCalendarDate(displayLastSawDate) ?? "Never"}</span></p>
      <p>Next see date: <span>{formatToCalendarDate(displayNextSeeDate) ?? "immediately"}</span></p>

      {showConfirmationForm && (
        <ConfirmationForm
          onOk={onConfirmationFormOk}
          onCancel={onConfirmationFormCancel}
          error={confirmationFormError}
          data={confirmationFormData}
          setData={setConfirmationFormData}
          message={message}
        />
      )}
    </div>
  );
};

export default CardPage;
