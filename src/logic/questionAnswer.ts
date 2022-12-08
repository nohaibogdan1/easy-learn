/* eslint-disable */
import { LEVELS } from '../constants';
import { NextSeeDate } from '../types';

const calculateNewLastSawDate = (): string => {
  const date = new Date();

  return date.getTime().toString();
};

/**
 * date1: milliseconds
 * date2: milliseconds
 */
const getDifferenceInDays = (date1: string, date2: string): number => {
  const differenceInTime = Math.abs(parseFloat(date1) - parseFloat(date2));
  const differenceInDays = Math.floor(differenceInTime / (1000 * 60 * 60 * 24));
  return differenceInDays;
};

const calculateNextSeeDate = (lastSawDate: string | null): NextSeeDate => {
  const date = new Date();
  const currentDate = date.getTime();
  const lastSawDateValue = lastSawDate || currentDate.toString();
  const differenceInDays = getDifferenceInDays(currentDate.toString(), lastSawDateValue);
  const day = 1000 * 60 * 60 * 24;

  const calculateNextSeeDateEasy = (): string => {
    const oneWeek = day * 7;
    const days = differenceInDays < 10 ? 
      oneWeek : 
      differenceInDays * 2;

    const nextSeeDate = currentDate + days;
    return nextSeeDate.toString();
  };

  const calculateNextSeeDateMedium = (): string => {
    const threeDays = day * 3;
    const nextSeeDate = currentDate + threeDays;
    return nextSeeDate.toString();
  };

  const calculateNextSeeDateHard = (): string => {
    const nextSeeDate = currentDate + day;
    return nextSeeDate.toString();
  };

  const result = {
    [LEVELS.EASY]: calculateNextSeeDateEasy(),
    [LEVELS.MEDIUM]: calculateNextSeeDateMedium(),
    [LEVELS.HARD]: calculateNextSeeDateHard()
  };

  return result;
};

const isToday = (date: string) => {
  const days = getDifferenceInDays(date, new Date().getTime().toString());
  return days === 0;
};

export { 
  calculateNewLastSawDate, 
  calculateNextSeeDate, 
  getDifferenceInDays,
  isToday,
};
