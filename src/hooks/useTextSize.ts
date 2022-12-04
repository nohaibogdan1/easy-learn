/* eslint-disable */

import { useEffect, useState } from "react";
import { useDbStore } from "../stores/db-store/store";

export const textSizeMapper = {
  1: 'xs',
  2: 's',
  3: 'm',
  4: 'l',
  5: 'xl',
};

const useTextSize = () => {
  const [textSize, setTextSize] = useState(3);

  const {updateTextSizeClass} = useDbStore();

  useEffect(() => {
    const savedTextSize = localStorage.getItem('text-size');
    if (savedTextSize) {
      setTextSize(parseInt(savedTextSize));
    }
  }, []);

  useEffect(() => {
    updateTextSizeClass(textSizeClass);
  }, [textSize]);

  const increaseText = () => {
    const newTextSize = textSize === 5 ? textSize : textSize + 1;
    setTextSize(newTextSize);
    localStorage.setItem('text-size', newTextSize.toString());
  };

  const decreaseText = () => {
    const newTextSize = textSize === 1 ? textSize : textSize - 1;
    setTextSize(newTextSize);
    localStorage.setItem('text-size', newTextSize.toString());
  };

  const textSizeClass = textSizeMapper[textSize as keyof typeof textSizeMapper];

  return {
    textSize,
    textSizeClass,
    increaseText,
    decreaseText,
  };
};

export default useTextSize;
