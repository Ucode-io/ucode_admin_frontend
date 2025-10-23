import useDebounce from "@/hooks/useDebounce";
import { useGetLang } from "@/hooks/useGetLang";
import { useViewContext } from "@/providers/ViewProvider";
import { useFieldSearchUpdateMutation } from "@/services/constructorFieldService";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export const useSearchPopoverProps = ({ handleSearchOnChange = () => {} }) => {

  const tableLan = useGetLang("Table");
  const { i18n } = useTranslation();

  const {tableSlug, refetchTableInfo, roleInfo, permissions, columnsForSearch } = useViewContext();

  const [searchText, setSearchText] = useState("");

  const onChange = useDebounce((value) => {
    setSearchText(value);
    handleSearchOnChange(value)
  }, 300);

  const { mutate: updateField, isLoading: updateLoading } =
    useFieldSearchUpdateMutation({
      onSuccess: () => {
        refetchTableInfo();
      },
    });

  return { 
    onChange,
    searchText,
    tableLan,
    i18n,
    roleInfo,
    permissions,
    updateField,
    tableSlug,
    columnsForSearch,
  }

}
