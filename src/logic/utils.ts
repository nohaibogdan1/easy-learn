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

export { formatDate, isTruthyValue };
