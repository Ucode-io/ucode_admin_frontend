import clsx from "clsx";
import cls from "./styles.module.scss";
import { useState } from "react";
import { Box } from "@mui/material";
import { fieldTypesOptions } from "@/utils/constants/fieldTypes";
import { fieldTypeIcons } from "@/utils/constants/icons";
import { SearchInput } from "../../../components/SearchInput";
import { iconsComponents } from "../../../../../../table-redesign/icons";

export const FieldTypeList = ({
  setValue = () => {},
  activeType,
  onSelect = () => {},
}) => {
  const [search, setSearch] = useState("");

  const filteredList = fieldTypesOptions?.filter((item) =>
    item?.options?.some((el) =>
      el?.label?.toLowerCase().includes(search.toLowerCase())
    )
  );

  return (
    <Box>
      <Box marginBottom="5px">
        <SearchInput onChange={(e) => setSearch(e.target.value)} />
      </Box>
      <Box padding="8px">
        {(search ? filteredList : fieldTypesOptions)?.map((item) => (
          <Box key={item?.label}>
            <p className={cls.title}>{item?.label}</p>
            {item?.options?.map((el) => (
              <Box
                className={clsx(cls.item, {
                  [cls.active]: el?.value === activeType?.value,
                })}
                key={el?.value}
                onClick={() => {
                  setValue("type", el?.value);
                  onSelect();
                }}
              >
                <span>{iconsComponents[el?.value]}</span>
                <span className={cls.label}>{el?.label}</span>
              </Box>
            ))}
          </Box>
        ))}
      </Box>
    </Box>
  );
};
