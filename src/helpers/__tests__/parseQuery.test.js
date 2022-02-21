import parseQuery from "helpers/parseQuery";

describe("parseQuery function", () => {
  beforeAll(() => {
    window.history.pushState(
      {},
      "Test Title",
      ":8080/#/home/orders?tab=1&limit=10&offset=30",
    );
  });

  it("parses current url's search params", () => {
    expect(parseQuery()).toEqual({ tab: "1", limit: "10", offset: "30" });
  });
});
