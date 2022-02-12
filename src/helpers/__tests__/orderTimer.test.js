import orderTimer from "../orderTimer";

it("calculates the difference between two dates in hours", () => {
  expect(orderTimer("2022-01-01 15:00:00", "2022-01-01 16:00:00")).toBe(
    "01:00:00",
  );
});
