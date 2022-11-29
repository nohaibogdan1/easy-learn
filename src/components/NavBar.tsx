/* eslint-disable */

import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { ROOT_NAME } from '../constants';
import './NavBar.css';

const NavBar = () => {
  const {pathname} = useLocation();

  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setChecked(false);
  }, [pathname]);

  const onChange = () => {
    setChecked((checked) => !checked);
  }

  return (
    <nav className="nav-wrapper">
      <div className="logo">easy learn</div>
      <input 
        id="menu-toggle" 
        type="checkbox"
        checked={checked}
        onChange={onChange}
      />
      <label className="menu-button-container" htmlFor="menu-toggle">
        <div className="menu-button"></div>
      </label>
      <ul className="menu">
        <li>
          <Link to={ROOT_NAME + '/home'}> Home </Link>
        </li>
        <li>
          <Link to={ROOT_NAME + '/cards'}> Cards </Link>
        </li>
        <li>
          <Link to={ROOT_NAME + '/import'}> Import </Link>
        </li>
        <li>
          <Link to={ROOT_NAME + '/settings'}> Settings </Link>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
