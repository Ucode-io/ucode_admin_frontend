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
  changeHandler,
  computedValue,
  ...props
}) => {
  const { menuIsOpen } = props.selectProps;

  const { i18n } = useTranslation();
  const dispatch = useDispatch();

  return (
    <components.MultiValue
      className={cls.multiValue}
      {...props}
      removeProps={{
        onClick: (e) => {
          e.preventDefault();
          changeHandler(
            computedValue?.filter((el) => el.guid !== props.data.guid)
          );
        },
        onMouseDown: (e) => {
          e.preventDefault();
        },
        onMouseUp: (e) => {
          e.preventDefault();
        },
      }}
    ></components.MultiValue>
  );
};
