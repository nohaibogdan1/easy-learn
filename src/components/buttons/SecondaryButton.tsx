/* eslint-disable */
import React, { ReactElement } from 'react';

import './SecondaryButton.css';

const SecondaryButton = ({ text }: { text: string }): ReactElement => {
  return <button className="secondary-btn">{text}</button>;
};

export default SecondaryButton;
