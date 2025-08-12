import { Box } from "@mui/material"
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { components } from "react-select";
import cls from "./styles.module.scss";

export const CustomMultiValue = ({
  refetch,
  disabled,
  isNewRouter,
  tableSlug,
  field,
  localValue,
  menuId,
  ...props
}) => {

  const { menuIsOpen } = props.selectProps;

  const { i18n } = useTranslation();
  const dispatch = useDispatch();

  return <components.MultiValue className={cls.multiValue} {...props}>

  </components.MultiValue>
}
