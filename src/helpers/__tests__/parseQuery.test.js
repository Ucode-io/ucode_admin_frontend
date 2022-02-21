import parseQuery from "helpers/parseQuery";

// global.window = {
//   location: {
//     pathname: "/",
//     origin: "https://subdomain.domain.io",
//     hash: "#/home/orders?tab=1&limit=10&offset=30",
//   },
// };

// jest.spyOn(window.location, "href").mockImplementation((key) => key)

// const newUrl = 'orders?tab=1&limit=10&offset=30';
// Object.defineProperty(window.location, 'hash', {
//   writable: true,
//   configurable: true,
//   value: newUrl
// });

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
