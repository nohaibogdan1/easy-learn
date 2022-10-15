/* eslint-disable */
import React, { ReactElement } from 'react';

import './SecondaryButton.css';

const SecondaryButton = ({
  onClick,
  text
}: {
  onClick?: () => void;
  text: string;
}): ReactElement => {
  return (
    <button onClick={onClick} className="secondary-btn">
      {text}
    </button>
  );
};

export default SecondaryButton;
