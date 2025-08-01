import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export const useFieldParams = ({ 
  tableSlug,
  formType,
  reset = () => {},
  field,
  setFolder,
  selectedAutofillFieldSlug,
  menuItem
}) => {
  const { i18n } = useTranslation();

  const [isTypeListOpen, setIsTypeListOpen] = useState(false);

  const handleTypeClick = (e) => {
    e.stopPropagation();
    setIsTypeListOpen((prev) => !prev);
  }

  const handleCloseTypeList = (e) => {
    e.stopPropagation();
    setIsTypeListOpen(false);
  }

  return {
    handleTypeClick,
    handleCloseTypeList,
    isTypeListOpen,
    i18n,
  }
}