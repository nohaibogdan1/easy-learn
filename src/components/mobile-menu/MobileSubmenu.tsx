/* eslint-disable */

import React, { ReactElement, ReactNode } from 'react';

import './MobileSubmenu.css';

const MobileSubmenu = ({
  children,
  className = ''
}: {
  children: ReactNode;
  className?: string;
}): ReactElement => {
  return <div className={`mobile-submenu-wrapper ${className}`}>{children}</div>;
};

export default MobileSubmenu;
