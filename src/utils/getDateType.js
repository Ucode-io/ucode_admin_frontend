export const FromDateType = (date, currentUpdatedDate, firstUpdatedDate) => {
  switch (true) {
    case date === "DAY":
      return currentUpdatedDate;
    case date === "WEEK":
      return firstUpdatedDate;
    default:
      return currentUpdatedDate;
  }
};

export const ToDateType = (date, tomorrow, lastUpdatedDate) => {
  switch (true) {
    case date === "DAY":
      return tomorrow;
    case date === "WEEK":
      return lastUpdatedDate;
    default:
      return tomorrow;
  }
};
