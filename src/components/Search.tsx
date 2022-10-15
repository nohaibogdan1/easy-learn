/* eslint-disable */

import React, { BaseSyntheticEvent, ReactElement, useState } from 'react';

import './Search.css';

const Search = ({ setSearchInput }: { setSearchInput: (arg: string) => void }): ReactElement => {
  const [search, setSearch] = useState('');

  const onChangeSearch = (event: BaseSyntheticEvent) => {
    setSearch(event.target.value);
    setSearchInput(event.target.value);
  };

  return (
    <input
      value={search}
      onChange={onChangeSearch}
      className="search"
      type="text"
      placeholder="search"
    />
  );
};

export default Search;
