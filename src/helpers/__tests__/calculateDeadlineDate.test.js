import moment from "moment";
import calculateDeadlineDate from "helpers/calculateDeadlineDate";

describe("calculateDeadlineDate function", () => {
  it("calculates the deadline in iso string format", () => {
    var deadline = calculateDeadlineDate("2022-01-01", "2020-01-01");
    // it gives us moment object, so we format it and check the result
    var formattedDeadline = deadline.format("DD-MM-YYYY");
    var expectedDeadline = moment("2019-12-31T19:00:00.000Z").format(
      "DD-MM-YYYY",
    );
    expect(formattedDeadline).toBe(expectedDeadline);
  });
});
