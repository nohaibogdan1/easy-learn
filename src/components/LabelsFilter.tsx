/* eslint-disable */
import React, { BaseSyntheticEvent, ReactElement, useEffect, useState } from 'react';

import { LabelStored } from '../types';
import './LabelsFilter.css';
import { sortLabelsAlphabetically } from '../logic/utils';

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
    setDisplayedLabels(labels.sort(sortLabelsAlphabetically));
  }, [labels.length]);

  useEffect(() => {
    const filteredLabels = labels.filter((l) => 
      l.text.startsWith(searchValue));
    setDisplayedLabels(filteredLabels);
  }, [searchValue]);

  useEffect(() => {
    const filteredLabels = labels.filter((l) => 
      !selectedLabels.find((sl) => sl.id === l.id))

    filteredLabels.sort(sortLabelsAlphabetically);
    selectedLabels.sort(sortLabelsAlphabetically);

    const displayedLabelsReordered = [
      ...selectedLabels, 
      ...filteredLabels,
    ];

    setDisplayedLabels(displayedLabelsReordered);

  }, [JSON.stringify(selectedLabels)]);

  const onInputClick = () => {
    setExpanded(true);
  };

  const onSearchChange = (event: BaseSyntheticEvent) => {
    setSearchValue(event.target.value);
  };

  const onSelectCheckbox = (event: BaseSyntheticEvent) => {
    const selectedId = parseInt(event.target.value);

    const currentSelected = labels.find((l) => 
      l.id === selectedId);

    if (currentSelected) {
      onSelectLabel(selectedId)

      setSelectedLabels((selectedLabels) => {
        const exist = selectedLabels.find((l) => 
          l.id === currentSelected.id);
        if (!exist) {
          return [...selectedLabels, currentSelected]
        } else {
          return [...selectedLabels.filter((sl) => 
            sl.id !== currentSelected.id)];
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
        <input type="text" 
          onClick={onInputClick} 
          onChange={onSearchChange} 
          value={searchValue}
        />
        <div className={`labels-wrapper ${expanded ? 'show' : 'hide'}`}>
          {displayedLabels.map((label) => {
            const checked = Boolean(
              selectedLabels.find((l) => l.id === label.id));

            return (
              <div key={label.id}>
                <label>
                  <input 
                    type="checkbox" 
                    name={label.text}
                    value={label.id} 
                    checked={checked} 
                    onChange={onSelectCheckbox} 
                  />
                    {label.text}
                  </label>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LabelsFilter;
