import parseQuery from "helpers/parseQuery";

global.window = {
  location: {
    pathname: "/",
    origin: "https://subdomain.domain.io",
    hash: "#/home/orders?tab=1&limit=10&offset=30",
  },
};

it("parses current url's search params", () => {
  expect(parseQuery()).toStrictEqual({ tab: "1", limit: "10", offset: "30" });
});
