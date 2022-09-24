/* eslint-disable */

import React, { ReactElement, ReactNode } from 'react';

import './MobileMenu.css';

const MobileMenu = ({ children }: { children: ReactNode }): ReactElement => {
  return <div className="mobile-menu-wrapper">{children}</div>;
};

export default MobileMenu;
