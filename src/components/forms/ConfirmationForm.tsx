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
  setData
}: {
  error: string | null;
  data?: string;
  onOk: () => void;
  onCancel: () => void;
  setData?: (arg: string) => void;
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
        {Boolean(error) && <div>Error: {error}</div>}
        {typeof data === 'string' && Boolean(setData) && (
          <label>
            <span>Description</span>
            <input type={'text'} value={data} onChange={onChange} />
          </label>
        )}
        <ButtonsGroup className={'margin-top-medium wrap display-flex'}>
          <PrimaryButton onClick={onClickOk} text={BUTTONS_TEXT.OK} />
          <SecondaryButton onClick={onClickCancel} text={BUTTONS_TEXT.CANCEL} />
        </ButtonsGroup>
      </div>
    </div>
  );
};

export default ConfirmationForm;
