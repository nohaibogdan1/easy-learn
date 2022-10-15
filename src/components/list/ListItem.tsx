/* eslint-disable */

import React, { BaseSyntheticEvent, ReactElement, ReactNode, useState } from 'react';

import './ListItem.css';

const ListItem = ({
  text,
  showArrow,
  usesCheckbox,
  checked,
  onCheckboxChange,
  id,
  onRedirect,
  textSecondary,
  showRemove,
  onRemove,
  showExpand,
  children
}: {
  text: string;
  showArrow?: boolean;
  usesCheckbox?: boolean;
  checked?: boolean;
  onCheckboxChange?: ({ checked, id }: { checked: boolean; id: number }) => void;
  id?: number;
  onRedirect?: (arg: number) => void;
  onRemove?: (arg: number) => void;
  textSecondary?: string;
  showRemove?: boolean;
  showExpand?: boolean;
  children?: ReactNode;
}): ReactElement => {
  const [isExpanded, setIsExpanded] = useState(false);

  const onChange = (event: BaseSyntheticEvent) => {
    if (id) {
      onCheckboxChange?.({ checked: event.target.checked, id });
    }
  };

  const onRedirectClick = () => {
    if (id) {
      onRedirect?.(id);
    }
  };

  const onRemoveClick = () => {
    if (id) {
      onRemove?.(id);
    }
  };

  const onToggleExpand = () => {
    setIsExpanded((isExpanded) => !isExpanded);
  };

  return (
    <div className="list-item-wrapper">
      <div className="text">{text}</div>
      {showArrow && <div className="arrow" onClick={onRedirectClick}></div>}
      {showRemove && (
        <div className="remove-btn" onClick={onRemoveClick}>
          X
        </div>
      )}
      {showExpand && !isExpanded && (
        <div className="expand-btn" onClick={onToggleExpand}>
          V
        </div>
      )}
      {showExpand && isExpanded && (
        <div className="expand-btn" onClick={onToggleExpand}>
          A
        </div>
      )}
      {usesCheckbox && (
        <input className="checkbox" type={'checkbox'} checked={checked} onChange={onChange} />
      )}
      {textSecondary && <div>{textSecondary}</div>}
      {Boolean(children) && isExpanded && children}
    </div>
  );
};

export default ListItem;
