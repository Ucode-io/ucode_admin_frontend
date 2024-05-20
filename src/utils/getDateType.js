export const FromDateType = (date, currentUpdatedDate, firstUpdatedDate) => {
  switch (true) {
    case date === "DAY":
      return currentUpdatedDate;
    case date === "WEEK":
      return firstUpdatedDate;
    default:
      return getFirstDayOfMonth(currentUpdatedDate);
  }
};

export const ToDateType = (date, tomorrow, lastUpdatedDate) => {
  switch (true) {
    case date === "DAY":
      return tomorrow;
    case date === "WEEK":
      return lastUpdatedDate;
    default:
      return getFirstDayOfNextMonth(tomorrow);
  }
};

const getFirstDayOfMonth = (date) => {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1);
};

const getFirstDayOfNextMonth = (date) => {
  const d = new Date(date);
  return new Date(d.getFullYear(), d.getMonth() + 1, 1);
};
