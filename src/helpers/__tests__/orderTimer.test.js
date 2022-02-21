import orderTimer from "../orderTimer";

describe("orderTimer function", () => {
  it("calculates the difference between two dates in hours", () => {
    var received = orderTimer("2022-01-01 15:00:00", "2022-01-01 16:00:00");
    var expected = "01:00:00";
    expect(received).toBe(expected);
  });
});
