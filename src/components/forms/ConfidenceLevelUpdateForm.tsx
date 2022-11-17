/* eslint-disable */
import React, {BaseSyntheticEvent, ReactElement, useState} from 'react';
import { LEVELS } from '../../constants';
import ButtonsGroup from '../buttons/ButtonsGroup';
import PrimaryButton from '../buttons/PrimaryButton';
import SecondaryButton from '../buttons/SecondaryButton';

import './ConfidenceLevelUpdateForm.css';

const ConfidenceLevelUpdateForm = ({
  confidenceLevelToUpdate,
  setConfidenceLevelToUpdate,
  ok,
  close,
}: {
  confidenceLevelToUpdate: LEVELS,
  setConfidenceLevelToUpdate: (level: LEVELS) => void,
  ok: () => void;
  close: () => void,
}): ReactElement => {

  const onLevelChange = (event: BaseSyntheticEvent) => {
    setConfidenceLevelToUpdate(event.target.value);
  }

  const onOkClick = () => {
    ok();
  }

  const onCloseClick = () => {
    close();
  }

  const isEasyLevelChecked = confidenceLevelToUpdate === LEVELS.EASY;
  const isGoodLevelChecked = confidenceLevelToUpdate === LEVELS.MEDIUM;
  const isHardLevelChecked = confidenceLevelToUpdate === LEVELS.HARD;

  return (
    <div className="confidence-level-update-form-wrapper">
      <div className="confidence-level-update-form">
        <label>
          Easy
          <input
            name="order-settings"
            checked={isEasyLevelChecked}
            type="radio"
            value={LEVELS.EASY}
            onChange={onLevelChange}
          />
        </label>

        <label>
          Good
          <input
            name="order-settings"
            checked={isGoodLevelChecked}
            type="radio"
            value={LEVELS.MEDIUM}
            onChange={onLevelChange}
          />
        </label>

        <label>
          Hard
          <input
            name="order-settings"
            checked={isHardLevelChecked}
            type="radio"
            value={LEVELS.HARD}
            onChange={onLevelChange}
          />
        </label>

        <ButtonsGroup>
          <PrimaryButton onClick={onOkClick} text={"Ok"} />
          <SecondaryButton onClick={onCloseClick} text={"Close"}/>
        </ButtonsGroup>
      </div>
    </div>
  )
}

export default ConfidenceLevelUpdateForm;
