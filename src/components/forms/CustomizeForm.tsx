/* eslint-disable */

import React, { BaseSyntheticEvent, ReactElement, useState } from 'react';

import './CustomizeForm.css';
import { LEVELS, OrderSettings } from '../../constants';
import { TestCustomSettings } from '../../data/interfaces';

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
    changeCustomSettings({
      orderSettings: order,
      showAnswerSettings: showAnswer,
      levelFilterSettings: levelFilter
    });
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

        <label>
          Show answer
          <input type="checkbox" checked={showAnswer} onChange={onShowAnswerCheck} />
        </label>
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

        <button onClick={onPlayClick}>Play</button>
        <button onClick={onCloseClick}>Close</button>
      </div>
    </div>
  );
};

export default CustomizeForm;
