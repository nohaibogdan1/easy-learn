/* eslint-disable */
import React, { ReactElement, useState, BaseSyntheticEvent } from 'react';

import PrimaryButton from '../buttons/PrimaryButton';
import SecondaryButton from '../buttons/SecondaryButton';
import ButtonsGroup from '../buttons/ButtonsGroup';
import { BUTTONS_TEXT } from '../../constants';
import './InsertCourseOrDeckForm.css';

const InsertCourseOrDeckForm = ({
  onOk,
  onCancel,
  error,
  description,
  setDescription
}: {
  error: string | null;
  description: string;
  onOk: () => void;
  onCancel: () => void;
  setDescription: (arg: string) => void;
}): ReactElement => {
  console.log('descripo', description);

  const onChange = (event: BaseSyntheticEvent) => {
    console.log('eve', event.target.value);

    setDescription(event.target.value);
  };

  const onClickOk = () => {
    onOk();
  };

  const onClickCancel = () => {
    onCancel();
  };

  return (
    <div className="insert-course-or-deck-form-wrapper">
      <div className="insert-course-or-deck-form">
        {Boolean(error) && <div>Error: {error}</div>}
        <label>
          <span>Description</span>
          <input type={'text'} value={description} onChange={onChange} />
        </label>
        <ButtonsGroup className={'margin-top-medium wrap'}>
          <PrimaryButton onClick={onClickOk} text={BUTTONS_TEXT.OK} />
          <SecondaryButton onClick={onClickCancel} text={BUTTONS_TEXT.CANCEL} />
        </ButtonsGroup>
      </div>
    </div>
  );
};

export default InsertCourseOrDeckForm;
