/* eslint-disable */

import React, { ReactElement, ReactNode } from 'react';

import './List.css';

const List = ({ children }: { children: ReactNode }): ReactElement => {
  return <div className="list">{children}</div>;
};

export default List;
