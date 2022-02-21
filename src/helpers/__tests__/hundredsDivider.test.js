import hundredsDivider from "helpers/hundredsDivider";

describe("hundredsDivider function", () => {
  it("divides a number to the hundreds with a separator", () => {
    expect(hundredsDivider(999000, ",")).toBe("999,000");
  });

  it("works with string numbers as well", () => {
    expect(hundredsDivider("55000", ",")).toBe("55,000");
  });

  it("provides with a custom separator if you didn't pass", () => {
    expect(hundredsDivider(55000)).toBe("55 000");
  });
});
