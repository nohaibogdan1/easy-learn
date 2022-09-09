/* eslint-disable */
import React, { BaseSyntheticEvent, ReactElement, useState } from 'react';

const LabelComponent = ({ addLabel }: { addLabel: (value: string) => void }): ReactElement => {
  const [text, setText] = useState('');

  const textChange = (event: BaseSyntheticEvent) => {
    setText(event.target.value);
  };

  const insertLabel = (event: BaseSyntheticEvent) => {
    event.preventDefault();
    addLabel(text);
  };

  return (
    <div>
      <form>
        <input type="text" name="text" onChange={textChange} value={text}></input>
        <input type="submit" onClick={insertLabel} value="Add Label" />
      </form>
    </div>
  );
};

export default LabelComponent;
