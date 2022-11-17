/* eslint-disable */

import React, { BaseSyntheticEvent, ReactElement, useEffect, useState } from 'react';

import './CustomizeForm.css';
import { LEVELS, OrderSettings } from '../../constants';
import { TestCustomSettings } from '../../data/interfaces';
import PrimaryButton from '../buttons/PrimaryButton';
import SecondaryButton from '../buttons/SecondaryButton';
import ButtonsGroup from '../buttons/ButtonsGroup';

const CustomizeForm = ({
  customSettings,
  play,
  close,
  changeCustomSettings
}: {
  customSettings: TestCustomSettings;
  changeCustomSettings: (arg: TestCustomSettings) => void;
  play: () => void;
  close: () => void;
}): ReactElement => {
  const [order, setOrder] = useState<OrderSettings>(customSettings.orderSettings);
  const [showAnswer, setShowAnswer] = useState(customSettings.showAnswerSettings);
  const [levelFilter, setLevelFilter] = useState<LEVELS[]>(customSettings.levelFilterSettings);

  useEffect(() => {
    changeCustomSettings({
      orderSettings: order,
      showAnswerSettings: showAnswer,
      levelFilterSettings: levelFilter
    });
  }, [order, showAnswer, JSON.stringify(levelFilter)]);

  const changeLevelFilter = (level: LEVELS) => {
    setLevelFilter((levelFilter) => {
      if (levelFilter.includes(level)) {
        return levelFilter.filter((l) => l !== level);
      }
      return [...levelFilter, level];
    });
  };

  const changeOrderSettings = (newOrder: OrderSettings) => {
    setOrder(newOrder);
  };

  const changeShowAnswer = () => {
    setShowAnswer((showAnswer) => !showAnswer);
  };

  const onEasyCheck = () => {
    changeLevelFilter(LEVELS.EASY);
  };

  const onGoodCheck = () => {
    changeLevelFilter(LEVELS.MEDIUM);
  };

  const onHardCheck = () => {
    changeLevelFilter(LEVELS.HARD);
  };

  const onShowAnswerCheck = () => {
    changeShowAnswer();
  };

  const onPlayClick = () => {
    play();
  };

  const onCloseClick = () => {
    close();
  };

  const onOrderChange = (event: BaseSyntheticEvent) => {
    changeOrderSettings(event.target.value);
  };

  const isEasyChecked = Boolean(levelFilter.includes(LEVELS.EASY));
  const isGoodChecked = Boolean(levelFilter.includes(LEVELS.MEDIUM));
  const isHardChecked = Boolean(levelFilter.includes(LEVELS.HARD));
  const isShuffleCardsChecked = order === OrderSettings.shuffleCards;
  const isReverseOrderChecked = order === OrderSettings.reverseOrder;
  const isNoneOrderSettingsChecked = order === OrderSettings.none;

  return (
    <div className="customize-form-wrapper">
      <div className="customize-form">
        <div className="settings-wrapper">
          <div className="order-settings-wrapper">
            <h3>Order Settings</h3>
            <label>
              None
              <input
                name="order-settings"
                checked={isNoneOrderSettingsChecked}
                type="radio"
                value={OrderSettings.none}
                onChange={onOrderChange}
              />
            </label>
            <label>
              Shuffle cards
              <input
                name="order-settings"
                checked={isShuffleCardsChecked}
                type="radio"
                value={OrderSettings.shuffleCards}
                onChange={onOrderChange}
              />
            </label>
            <label>
              Reverse order
              <input
                name="order-settings"
                checked={isReverseOrderChecked}
                type="radio"
                value={OrderSettings.reverseOrder}
                onChange={onOrderChange}
              />
            </label>
          </div>

          <div className="answer-settings-wrapper">
            <h3>Answer Settings</h3>
            <label >
              Show answer
              <input type="checkbox" checked={showAnswer} onChange={onShowAnswerCheck} />
            </label>
          </div>

          <div className="level-settings-wrapper">
            <h3>Level Settings</h3>
            <label>
              Easy
              <input type="checkbox" checked={isEasyChecked} onChange={onEasyCheck} />
            </label>
            <label>
              Good
              <input type="checkbox" checked={isGoodChecked} onChange={onGoodCheck} />
            </label>
            <label>
              Hard
              <input type="checkbox" checked={isHardChecked} onChange={onHardCheck} />
            </label>
          </div>
        </div>

        <ButtonsGroup>
          <PrimaryButton onClick={onPlayClick} text={"Play"}/>
          <SecondaryButton onClick={onCloseClick} text={"Close"}/>
        </ButtonsGroup>
      </div>
    </div>
  );
};

export default CustomizeForm;
