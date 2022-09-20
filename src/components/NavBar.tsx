/* eslint-disable */

import React from 'react';
import { Link } from 'react-router-dom';

import { ROOT_NAME } from '../constants';
import './NavBar.css';

const NavBar = () => {
  return (
    <nav className='nav-wrapper'>
      <div className='logo'>easy learn</div>
      <input id="menu-toggle" type="checkbox" />
      <label className="menu-button-container" htmlFor="menu-toggle">
        <div className="menu-button"></div>
      </label>
      <ul className="menu">
        <li>
          <Link to={ROOT_NAME + '/'}> Dashboard </Link>
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
  )
};

export default NavBar;
