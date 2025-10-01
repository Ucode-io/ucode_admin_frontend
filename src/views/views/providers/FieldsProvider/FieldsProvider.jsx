import { createContext, useContext } from "react"

const FieldsContext = createContext({});

export const FieldsProvider = ({ children, state }) => {
  return <FieldsContext.Provider value={state}>{children}</FieldsContext.Provider>
}

export const useFieldsContext = () => useContext(FieldsContext)
