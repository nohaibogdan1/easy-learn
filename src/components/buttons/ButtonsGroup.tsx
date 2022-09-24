/* eslint-disable */

import React, { ReactElement, ReactNode } from 'react';

import './ButtonsGroup.css';

const ButtonsGroup = ({
  children,
  className = ''
}: {
  children: ReactNode;
  className?: string;
}): ReactElement => {
  return <div className={`buttons-group ${className}`}>{children}</div>;
};

export default ButtonsGroup;
