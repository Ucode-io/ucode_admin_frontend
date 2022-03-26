// A custom hook to deal with initial status of products
// and then update them accordingly when a user changes
// constraints: products => [{ is_active: bool, id: string }, ...]
// It is side effect free :)
import { useReducer, useCallback } from "react";

var switchReducer = function (state, { type, id }) {
  var [...products] = state;

  switch (type) {
    case "update":
      var index = products.findIndex((product) => {
        return product.id === id;
      });

      if (index !== -1) {
        products[index].is_active = !products[index].is_active;
      }
      return products;
    default:
      return products;
  }
};

export default function useIsActive(products = []) {
  var transformed = products.map(({ id, is_active }) => {
    return { id, is_active };
  });

  var [list, dispatch] = useReducer(switchReducer, transformed);

  var toggleStatus = useCallback(function (id) {
    dispatch({ type: "update", id });
  }, []);

  return [list, toggleStatus];
}
