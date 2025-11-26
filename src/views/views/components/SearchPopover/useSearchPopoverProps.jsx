import useDebounce from "@/hooks/useDebounce";
import { useGetLang } from "@/hooks/useGetLang";
import { useViewContext } from "@/providers/ViewProvider";
import { useFieldSearchUpdateMutation } from "@/services/constructorFieldService";
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

  const onChange = useDebounce((value) => {
    handleSearchOnChange(value);
  }, 300);

  const { mutate: updateField } = useFieldSearchUpdateMutation({
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
  };
};
