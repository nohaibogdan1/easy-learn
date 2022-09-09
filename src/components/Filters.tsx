import { BaseSyntheticEvent, ReactElement, useState } from "react";
import { LEVELS } from "../constants";

import { Filter, SelectedLevels } from "../types";

const Filters = ({
  today,
  setToday,
  levels,
  setLevels,
}: {
  today: boolean,
  setToday: (arg: boolean) => void,
  levels: SelectedLevels,
  setLevels: (arg: (levels: SelectedLevels) => SelectedLevels) => void,
}): ReactElement => {

  const onChangeToday = (event: BaseSyntheticEvent) => {
    setToday(event.target.checked)
  };

  const onChangeLevels = (event: BaseSyntheticEvent) => {
    setLevels((levels: SelectedLevels) => ({
      ...levels,
      [event.target.name]: event.target.checked,
    }));
  };

  return (
    <>
      <div>
        <label htmlFor='today'>Today</label>
        <input type="checkbox" name='today' id='today' checked={today} onChange={onChangeToday}/>
      </div>
      <div>
        <div>level</div>
        <div>
          <label htmlFor='easy'>Easy</label>
          <input type="checkbox" name={LEVELS.EASY} id={LEVELS.EASY} checked={levels[LEVELS.EASY]} onChange={onChangeLevels}/>
        </div>
        <div>
          <label htmlFor='medium'>Medium</label>
          <input type="checkbox" name={LEVELS.MEDIUM} id={LEVELS.MEDIUM} checked={levels[LEVELS.MEDIUM]} onChange={onChangeLevels}/>
        </div>
        <div>
          <label htmlFor='hard'>Hard</label>
          <input type="checkbox" name={LEVELS.HARD} id={LEVELS.HARD} checked={levels[LEVELS.HARD]} onChange={onChangeLevels}/>
        </div>
      </div>
    </>
  )
};

export default Filters;
