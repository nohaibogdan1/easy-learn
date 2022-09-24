/* eslint-disable */
import React, { ReactElement } from 'react';

import './PrimaryButton.css';

const PrimaryButton = ({ text }: { text: string }): ReactElement => {
  return <button className="primary-btn">{text}</button>;
};

export default PrimaryButton;
