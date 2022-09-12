/* eslint-disable */

import React, { ReactElement } from 'react';

import { SelectedLevels, LabelStored } from '../types';
import { LEVELS } from '../constants';
import './FiltersSummary.css';

const FiltersSummary = ({
  today,
  levels,
  labels,
}: {
  today: boolean;
  levels: SelectedLevels;
  labels: LabelStored[]
}) => {

  const selectedLevels = Object.values(LEVELS)
    .filter((key) => levels[key as LEVELS]);

  return (
    <div className='filters-summary'>
      {today && <div>Today</div>}
      {selectedLevels.length && 
        <div>
          Levels: {
            selectedLevels
              .map((l) => 
                <span key={l}>{l}</span>)
          }
        </div> 
      }
      {labels.length && 
        <div>
          Labels: {
            labels 
              .map((l) => 
                <span key={l.id}>{l.text}</span>)
          }
        </div>
      }
    </div>
  );
};

export default FiltersSummary;
