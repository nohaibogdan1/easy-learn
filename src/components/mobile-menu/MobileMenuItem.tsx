/* eslint-disable */

import React, { ReactElement } from 'react';

import './MobileMenuItem.css';

const MobileMenuItem = ({
  text = '',
  className = ''
}: {
  text?: string;
  className?: string;
}): ReactElement => {
  return <button className={`mobile-menu-item-wrapper ${className}`}>{text}</button>;
};

export default MobileMenuItem;
