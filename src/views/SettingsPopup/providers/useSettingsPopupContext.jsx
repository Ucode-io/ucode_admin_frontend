import { useContext } from "react";
import { SettingsPopupContext } from "./SettingsPopupProvider";

export const useSettingsPopupContext = () => {
  const value = useContext(SettingsPopupContext);

  return value
}
