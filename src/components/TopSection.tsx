/* eslint-disable */

import React, { ReactElement, ReactNode } from 'react';

import './TopSection.css';

const TopSection = ({
  children,
  className = ''
}: {
  children: ReactNode;
  className?: string;
}): ReactElement => {
  return <div className={`top-section mobile-margin-exterior ${className}`}>{children}</div>;
};

export default TopSection;
