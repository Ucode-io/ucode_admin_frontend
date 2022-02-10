import hundredsDivider from "helpers/hundredsDivider";

it("divides a number to the hundreds with a separator", () => {
  expect(hundredsDivider(55000)).toBe("55 000");
  expect(hundredsDivider("55000", ",")).toBe("55,000");
  expect(hundredsDivider(999000, ",")).toBe("999,000");
});
