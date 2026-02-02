import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

export const useSidebarListProps = () => {
  const menuChilds = useSelector((state) => state?.menuAccordion?.menuChilds);

  const { i18n } = useTranslation();

  const getMenuLabel = (item) => {
    const label =
      item?.attributes?.[`label_${i18n.language}`] ??
      item?.attributes?.[`title_${i18n.language}`] ??
      item?.label ??
      item?.name;

    return label?.length > 18 ? `${label?.slice(0, 18)}..` : label;
  };

  return { getMenuLabel, menuChilds };
};
