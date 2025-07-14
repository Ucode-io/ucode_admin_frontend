import { createContext, useContext } from "react";

const ViewProviderContext = createContext({view: {}})


export const ViewProvider = ({children, state = {}}) => {
  return <ViewProviderContext.Provider value={state}>
    {children}
  </ViewProviderContext.Provider>
}

export const useViewContext = () => {
  const values = useContext(ViewProviderContext);

  return values
}
