/* eslint-disable */

const formatDate = (time: string): string => {
  return new Date(parseFloat(time)).toDateString();
};

const isTruthyValue = (value: any): boolean => {
  if (value === undefined || value === null) {
    return false;
  }

  if (typeof value === 'number') {
    if (isNaN(value) || value === 0) {
      return false;
    }
  }

  return true;
};

function shuffle(array: number[]) {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }

  return array;
}

export { formatDate, isTruthyValue, shuffle };
