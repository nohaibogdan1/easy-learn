/* eslint-disable */

import React, { ReactElement } from 'react';

import './Statistics.css';

const Statistics = ({
  description,
  value
}: {
  description: string;
  value: string;
}): ReactElement => {
  return (
    <div className="statistics-wrapper">
      <div className="description">{description}</div>
      <div className="value">{value}</div>
    </div>
  );
};

export default Statistics;
