/* eslint-disable */
import React, { BaseSyntheticEvent, ReactElement, useEffect, useState } from 'react';

import { Label, LabelStored } from '../types';
import './LabelsFilter.css';
import { useDbStore } from '../stores/db-store/store';

const LabelsFilter = ({
  labels, 
  onSelectLabel
}: {
  labels: LabelStored[], 
  onSelectLabel: (arg: number) => void
}): ReactElement => {
  const [expanded, setExpanded] = useState<boolean>(false);
  const [selectedLabels, setSelectedLabels] = useState<LabelStored[]>([]);
  const [searchValue, setSearchValue] = useState<string>('');
  const [displayedLabels, setDisplayedLabels] = useState<LabelStored[]>([]);

  useEffect(() => {
    setDisplayedLabels(labels);
  }, [labels.length]);

  useEffect(() => {
    const filteredLabels = labels.filter((l) => 
      l.text.startsWith(searchValue));
    setDisplayedLabels(filteredLabels);
  }, [searchValue]);

  useEffect(() => {

    const filteredLabelsOrdered = labels.filter((l) => 
      !selectedLabels.find((sl) => sl.id === l.id)).sort();

    console.log('filteredLabelsOrdered', filteredLabelsOrdered)

    const selectedLabelsOrdered = selectedLabels.sort();

    console.log('selectedLabelsOrdered', selectedLabelsOrdered)



    const displayedLabelsReordered = [
      ...selectedLabelsOrdered, 
      ...filteredLabelsOrdered,
    ];

    console.log('displayedLabelsReordered', displayedLabelsReordered)

    setDisplayedLabels(displayedLabelsReordered);

  }, [JSON.stringify(selectedLabels)]);

  const onInputClick = () => {
    setExpanded(true);
  };

  const onSearchChange = (event: BaseSyntheticEvent) => {
    setSearchValue(event.target.value);
  };

  const onSelectCheckbox = (event: BaseSyntheticEvent) => {
    const currentSelected = labels.find((l) => 
      l.id === parseInt(event.target.value));

    if (currentSelected) {
      setSelectedLabels((selectedLabels) => {
        const exist = selectedLabels.find(l => l.id === currentSelected.id);
        if (!exist) {
          return [...selectedLabels, currentSelected]
        } else {
          return selectedLabels;
        }
      });
    } else {
      setSelectedLabels((selectedLabels) => selectedLabels);
    }
  };

  return (
    <div className='labels-container'>
      Labels: 
      <div className='select'>
        <input type="text" onClick={onInputClick} onChange={onSearchChange} value={searchValue}/>
        <div className={`labels-wrapper ${expanded ? 'show' : 'hide'}`}>
          {displayedLabels.map((label) => {
            const checked = Boolean(selectedLabels.find(l => l.id === label.id));

            return (
              <div key={label.id}>
                <input type="checkbox" name={label.text} value={label.id} checked={checked} onChange={onSelectCheckbox} />
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
