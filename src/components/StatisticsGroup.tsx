/* eslint-disable */

import React, { ReactElement, ReactNode } from 'react';

import './StatisticsGroup.css';

const StatisticsGroup = ({ children, className }: { children: ReactNode; className?: string }) => {
  return <div className={`statistics-group-wrapper ${className || ''}`}>{children}</div>;
};

export default StatisticsGroup;
