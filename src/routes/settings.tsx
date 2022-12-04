/* eslint-disable */
import React, { BaseSyntheticEvent, useState, useEffect } from 'react';
import useTextSize from '../hooks/useTextSize';

const SettingsPage = () => {
  const {
    textSize,
    textSizeClass,
    decreaseText,
    increaseText,
  } = useTextSize();

  const onClickDecreaseText = () => {
    decreaseText();
  }

  const onClickIncreaseText = () => {
    increaseText();
  }

  useEffect(() => {
    console.log("BLUUU", textSizeClass)
  }, [textSizeClass]);

  return (
    <div className={`page-wrapper ${textSizeClass} settings-page-wrapper`}>
      <h3>Change size of text</h3>
      <button onClick={onClickDecreaseText}>-</button>
      {textSize}
      <button onClick={onClickIncreaseText}>+</button>
    </div>
  );
};

export default SettingsPage;
