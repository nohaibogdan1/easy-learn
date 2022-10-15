/* eslint-disable */
import React, { ReactElement } from 'react';

import './PrimaryButton.css';

const PrimaryButton = ({ text, onClick }: { text: string; onClick?: () => void }): ReactElement => {
  return (
    <button onClick={onClick} className="primary-btn">
      {text}
    </button>
  );
};

export default PrimaryButton;
