import numberToPrice from "helpers/numberToPrice";

describe("numberToPrice function", () => {
  it("converts number to price with currency", () => {
    expect(numberToPrice(10000, "dollars")).toBe("10 000 dollars");
    expect(numberToPrice(10000, "euros", ",")).toBe("10,000 euros");
  });

  it("works with string numbers as well", () => {
    expect(numberToPrice("10000", "tenge", ",")).toBe("10,000 tenge");
  });

  it("provides with a deafult currency type if you didn't pass", () => {
    expect(numberToPrice(10000)).toBe("10 000 сум");
  });
});
