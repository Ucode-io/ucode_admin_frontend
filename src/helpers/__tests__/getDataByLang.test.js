import getDataByLang from "helpers/getDataByLang";

describe("getDataByLang function", () => {
  it("gets property of an object by lang", () => {
    expect(getDataByLang("uz", "abc", { abc_uz: "data" })).toBe("data");
  });
});
