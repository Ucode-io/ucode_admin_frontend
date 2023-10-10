export const dateFormat = (currentDate, number) => {
  if (currentDate) {
    const date = new Date();
    date.setDate(currentDate.getDate() + number);
    date.setHours(0, 0, 0, 0);
    return date;
  }
};
