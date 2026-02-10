import useDebounce from "@/hooks/useDebounce";
import { useGetLang } from "@/hooks/useGetLang";
import { useViewContext } from "@/providers/ViewProvider";
import { useFieldSearchUpdateMutation } from "@/services/constructorFieldService";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export const useSearchPopoverProps = ({ handleSearchOnChange = () => {} }) => {
  const tableLan = useGetLang("Table");
  const { i18n } = useTranslation();

  const {
    tableSlug,
    refetchTableInfo,
    roleInfo,
    permissions,
    columnsForSearch,
    searchText,
  } = useViewContext();
  const [text, setText] = useState(searchText);

  const onChangeDeb = useDebounce((value) => {
    handleSearchOnChange(value);
  }, 300);

  const onChange = (value) => {
    setText(value);
    onChangeDeb(value);
  };

  const { mutate: updateField } = useFieldSearchUpdateMutation({
    onSuccess: () => {
      refetchTableInfo();
    },
  });

  return {
    onChange,
    searchText,
    text,
    tableLan,
    i18n,
    roleInfo,
    permissions,
    updateField,
    tableSlug,
    columnsForSearch,
  };
};
