import numberToPrice from "helpers/numberToPrice";

it("converts number to price with currency", () => {
  expect(numberToPrice(10000)).toBe("10 000 сум");
  expect(numberToPrice(10000, "dollars")).toBe("10 000 dollars");
  expect(numberToPrice(10000, "euros", ",")).toBe("10,000 euros");
});
