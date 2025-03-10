import { createContext } from "react";

export const SettingsPopupContext = createContext({
  activeTab: "",
  handleChangeTab: () => {},
  searchParams: {},
  setSearchParams: () => {},
  updateSearchParam: () => {},
});

export const SettingsPopupProvider = ({ children, value }) => {
  return <SettingsPopupContext.Provider value={value}>{children}</SettingsPopupContext.Provider>;
};
