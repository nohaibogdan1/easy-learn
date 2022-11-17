/* eslint-disable */
import React, { ReactElement, useState, BaseSyntheticEvent } from 'react';

import PrimaryButton from '../buttons/PrimaryButton';
import SecondaryButton from '../buttons/SecondaryButton';
import ButtonsGroup from '../buttons/ButtonsGroup';
import { BUTTONS_TEXT } from '../../constants';
import './ConfirmationForm.css';

const ConfirmationForm = ({
  onOk,
  onCancel,
  error,
  data,
  setData, 
  message,
}: {
  error: string | null;
  data?: string;
  onOk: () => void;
  onCancel: () => void;
  setData?: (arg: string) => void;
  message: string;
}): ReactElement => {
  const onChange = (event: BaseSyntheticEvent) => {
    setData?.(event.target.value);
  };

  const onClickOk = () => {
    onOk();
  };

  const onClickCancel = () => {
    onCancel();
  };

  return (
    <div className="confirmation-form-wrapper">
      <div className="confirmation-form">
        <h3>{message}</h3>
        {Boolean(error) && <div>Error: {error}</div>}
        {typeof data === 'string' && Boolean(setData) && (
          <textarea className='text-input' value={data} onChange={onChange} />
        )}
        <ButtonsGroup className={'mobile-hidden margin-top-medium wrap display-flex'}>
          <PrimaryButton onClick={onClickOk} text={BUTTONS_TEXT.OK} />
          <SecondaryButton onClick={onClickCancel} text={BUTTONS_TEXT.CANCEL} />
        </ButtonsGroup>
      </div>
    </div>
  );
};

export default ConfirmationForm;
