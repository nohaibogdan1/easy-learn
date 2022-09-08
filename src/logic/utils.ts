const formatDate = (time: string): string => {
  return new Date(parseFloat(time)).toDateString();
};

export {
  formatDate,
};
