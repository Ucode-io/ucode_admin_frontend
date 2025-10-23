import {useState} from "react";
import {useTranslation} from "react-i18next";
import { useViewContext } from "@/providers/ViewProvider";
import { useSelector } from "react-redux";
import { useGetLang } from "@/hooks/useGetLang";

export const useLayoutComponentProps = ({setIsChanged}) => {
  const {
    view,
    tableInfo,
    refetchViews
  } = useViewContext();

  const selectedTabIndex = useSelector((state) => state.drawer.mainTabIndex);

  const {i18n} = useTranslation();
  const tableLan = useGetLang("Table")

  const [typeNewView, setTypeNewView] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const onOpen = () => {
    setIsChanged(false);
    setIsOpen(true);
  };

  const onClose = () => {
    setIsOpen(false);
    setIsChanged(false);
  };

  return {
    view,
    tableInfo,
    refetchViews,
    i18n,
    typeNewView,
    isOpen,
    onOpen,
    onClose,
    selectedTabIndex,
    setTypeNewView,
    tableLan,
  }
}