import { createContext, useContext } from "react";

const FilterContext = createContext({});

export const FilterProvider = ({ children, state }) => {
  return (
    <FilterContext.Provider value={state}>{children}</FilterContext.Provider>
  );
};

export const useFilterContext = () => useContext(FilterContext);
