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
import useRecordAudio from '../logic/audio';
import MobileMenu from '../components/mobile-menu/MobileMenu';
import MobileSubmenu from '../components/mobile-menu/MobileSubmenu';
import { BUTTONS_TEXT } from '../constants';
import { getMenuStateForCardPage, getMenuStateForCardsPage, mapButtonsTextToHandlers } from '../logic/menu-helpers';
import PrimaryButton from '../components/buttons/PrimaryButton';
import { convertNewLineToHtmlBreak, sanitizeHtml } from '../logic/utils';

const CardPage = (args: any) => {

  /** ----------------- CUSTOM HOOK CALLS -------------------- */
  const cardId = parseInt(useParams()?.id ?? "-");

  const { 
    state: {db}, 
    getCard,
    updateCard,
  } = useDbStore();

  const {
    startRecord, 
    stopRecord,
    playRecord,
    saveRecord,
    listenRecording,
    canRecord,
    canPlay,
    canStopRecord,
  } = useRecordAudio();

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
      await updateCard({...card, question: newQuestion});
    }

    if (answerEditing) {
      await updateCard({...card, answer: newAnswer});
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

  const onRecordClick = async () => {
    startRecord?.();
  };

  const onStopRecordClick = async () => {
    stopRecord?.();
  };

  const onListenClick = () => {
    playRecord?.();
  };

  const onSaveClick = async () => {
    const id = await saveRecord?.();
    await updateCard({...card, recordingId: id});
    getCardData();
  };

  const onListenRecordClick = () => {
    if (!card?.recordingId) {
      return;
    }

    listenRecording(card.recordingId);
  };

  /** ----------------- VARIABLES ------------------------------ */
  const buttonTextHandlersMap = {
    [BUTTONS_TEXT.EDIT_QUESTION]: onClickEditQuestion,
    [BUTTONS_TEXT.EDIT_ANSWER]: onClickEditAnswer,
    [BUTTONS_TEXT.OK_CONFIRMATION_FORM]: onConfirmationFormOk,
    [BUTTONS_TEXT.CANCEL_CONFIRMATION_FORM]: onConfirmationFormCancel,
    [BUTTONS_TEXT.LISTEN]: onListenRecordClick,
    [BUTTONS_TEXT.RECORD]: onRecordClick,
    [BUTTONS_TEXT.SAVE]: onSaveClick,
    [BUTTONS_TEXT.STOP]: onStopRecordClick,
    [BUTTONS_TEXT.LISTEN_NEW]: onListenClick,
  };

  const {
    firstDesktopSubmenu,
    secondDesktopSubmenu,
    firstMobileSubmenu,
    secondMobileSubmenu,
  } = getMenuStateForCardPage({
    editing: questionEditing || answerEditing,
    hasRecording: Boolean(card?.recordingId),
    canPlay,
    canStopRecord,
  });

  const firstDekstopSubmenuButtons = mapButtonsTextToHandlers({
    buttonTextHandlersMap,
    buttonsText: firstDesktopSubmenu
  });

  const secondDekstopSubmenuButtons = mapButtonsTextToHandlers({
    buttonTextHandlersMap,
    buttonsText: secondDesktopSubmenu
  });

  const firstMobileSubmenuButtons = mapButtonsTextToHandlers({
    buttonTextHandlersMap,
    buttonsText: firstMobileSubmenu
  });

  const secondMobileSubmenuButtons = mapButtonsTextToHandlers({
    buttonTextHandlersMap,
    buttonsText: secondMobileSubmenu
  });

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

  const questionHtml = sanitizeHtml(convertNewLineToHtmlBreak(question));
  const answerHtml = sanitizeHtml(convertNewLineToHtmlBreak(answer));

  /** ----------------- RETURN --------------------------------- */
  if (!card) {
    return <div>Card Not Found</div>;
  }
  return (
    <div className="card-page-wrapper">
      <h3>question</h3>
      <div className="question-wrapper">
        <div className="text" dangerouslySetInnerHTML={{__html: questionHtml}}/>
        <MobileMenuItem
          onClick={onClickEditQuestion}
          className={`icon-btn edit-btn`}
        />
      </div>
      <h3>answer</h3>
      <div className="answer-wrapper">
        <div className="text" dangerouslySetInnerHTML={{__html: answerHtml}}/>
        <MobileMenuItem
          onClick={onClickEditAnswer}
          className={`icon-btn edit-btn`}
        />
      </div>
      <h3>Level of confidence</h3>
      <div>{card.level ?? "No Level"}</div>
      <p>Last saw date: <span>{formatToCalendarDate(displayLastSawDate) ?? "Never"}</span></p>
      <p>Next see date: <span>{formatToCalendarDate(displayNextSeeDate) ?? "immediately"}</span></p>

      <ButtonsGroup>
        {firstDekstopSubmenuButtons.map((btn, idx) => {
          return <PrimaryButton key={idx} text={btn.text} onClick={btn.onClick} />;
        })}
      </ButtonsGroup>

      <MobileMenu>
        {Boolean(firstMobileSubmenuButtons.length) && (
          <MobileSubmenu>
            {firstMobileSubmenuButtons.map((button, idx) => (
              <MobileMenuItem key={idx} text={button.text} onClick={button.onClick} />
            ))}
          </MobileSubmenu>
        )}
        {Boolean(secondMobileSubmenuButtons.length) && (
          <MobileSubmenu>
            {secondMobileSubmenuButtons.map((button, idx) => (
              <MobileMenuItem key={idx} text={button.text} onClick={button.onClick} />
            ))}
          </MobileSubmenu>
        )}
      </MobileMenu>

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
