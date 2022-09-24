/* eslint-disable */

import React, { ReactElement, useState } from 'react';

import './ListItem.css';

const ListItem = ({
  text,
  showArrow,
  usesCheckbox
}: {
  text: string;
  showArrow?: boolean;
  usesCheckbox?: boolean;
}): ReactElement => {
  const [checked, setChecked] = useState<boolean>(false);

  return (
    <div className="list-item-wrapper">
      <div className="text">{text}</div>
      {showArrow && <div className="arrow"></div>}
      {usesCheckbox && <input className="checkbox" type={'checkbox'} />}
    </div>
  );
};

export default ListItem;
