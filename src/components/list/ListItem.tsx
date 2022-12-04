/* eslint-disable */

import React, { BaseSyntheticEvent, ReactElement, ReactNode, useState } from 'react';
import { convertNewLineToHtmlBreak, sanitizeHtml } from '../../logic/utils';

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

  return (
    <div className="list-item-wrapper">
      <div className="text-wrapper">
        <div 
          className={`text ${textSecondary ? 'italic' : ''}`} 
          dangerouslySetInnerHTML={{__html: sanitizeHtml(convertNewLineToHtmlBreak(text)) }}
        />
        {textSecondary && 
          <div 
            className="text-secondary"
            dangerouslySetInnerHTML={{
              __html: sanitizeHtml(convertNewLineToHtmlBreak(textSecondary)) 
            }}
          />
        }
      </div>
      {showArrow && <div className="arrow" onClick={onRedirectClick}></div>}
      {usesCheckbox && (
        <input className="checkbox" type={'checkbox'} checked={checked} onChange={onChange} />
      )}
      {Boolean(children) && isExpanded && children}
    </div>
  );
};

export default ListItem;
