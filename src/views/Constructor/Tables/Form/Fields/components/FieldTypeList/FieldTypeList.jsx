import cls from "./styles.module.scss";
import { Box } from "@mui/material";
import { fieldTypesOptions } from "@/utils/constants/fieldTypes";
import { fieldTypeIcons } from "@/utils/constants/icons";
import clsx from "clsx";

export const FieldTypeList = ({ setValue = () => {}, activeType, onSelect = () => {} }) => {

  return <Box padding="8px">
    {
      fieldTypesOptions?.map(item => (
        <Box key={item?.label}>
          <p className={cls.title}>{item?.label}</p>
          {
            item?.options?.map(el => (
              <Box 
                className={clsx(cls.item, { [cls.active]: el?.value === activeType?.value })}
                key={el?.value}
                onClick={() => {
                  setValue("type", el?.value);
                  onSelect()
                }}
              >
                <span>{fieldTypeIcons[el?.value]}</span>
                <span className={cls.label}>{el?.label}</span>
              </Box>
            ))
          }
        </Box>
      ))
    }
  </Box>
}
