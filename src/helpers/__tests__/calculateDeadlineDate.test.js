import calculateDeadlineDate from "helpers/calculateDeadlineDate";

xit("calculates the deadline", () => {
  expect(calculateDeadlineDate("2022-01-01", "2020-01-01")).toBe(
    "2019-12-31T19:00:00.000Z"
  );
});
