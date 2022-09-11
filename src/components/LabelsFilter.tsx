/* eslint-disable */
import React, { BaseSyntheticEvent, ReactElement, useEffect, useState } from 'react';

import { Label, LabelStored } from '../types';
import './LabelsFilter.css';
import { useDbStore } from '../stores/db-store/store';

const LabelsFilter = (): ReactElement => {
  const [labels, setLabels] = useState<LabelStored[]>([]);
  const [selectedLabels, setSelectedLabels] = useState<Label[]>([]);
  const [expanded, setExpanded] = useState<boolean>(false);

  const {state: {db}, getAllLabels} = useDbStore();

  useEffect(() => {
    (async () => {
      if (db) {
        const storedLabels = await getAllLabels();
        setLabels(storedLabels);
        return;
      }
      setLabels([]);
    })();
  }, [db]);

  const onInputClick = () => {
    setExpanded(true);
  };

  return (
    <div className='labels-container'>
      Labels:
      <div className='select'>
        <input type="text" onClick={onInputClick}/>
        <div className={`labels-wrapper ${expanded ? 'show' : 'hide'}`}>
          {labels.map((label) => {
            return (
              <div key={label.id}>
                <input type="checkbox" name={label.text}/>
                <label>{label.text}</label>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LabelsFilter;
