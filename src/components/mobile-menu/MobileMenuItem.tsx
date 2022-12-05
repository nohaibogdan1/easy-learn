/* eslint-disable */

import React, { ReactElement } from 'react';

import './MobileMenuItem.css';

const MobileMenuItem = ({
  text = '',
  className = '',
  onClick
}: {
  text?: string;
  className?: string;
  onClick?: () => void;
}): ReactElement => {
  return (
    <button onClick={onClick} className={`mobile-menu-item ${className}`}>
      {text}
    </button>
  );
};

export default MobileMenuItem;
