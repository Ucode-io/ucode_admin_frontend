import { useViewContext } from "@/providers/ViewProvider";
import { useFieldsContext } from "@/views/views/providers/FieldsProvider";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export const useFixColumnsProps = () => {

  const {
    isViewUpdating,
    view,
    handleUpdateView
  } = useViewContext()

  const {
    fieldsMap
  } = useFieldsContext()

  const [search, setSearch] = useState("");
  const { i18n } = useTranslation();

  const checkedElements = Object.values(fieldsMap)
    .filter((column) => {
      return view?.columns?.find((el) => el === column?.id);
    })
    ?.filter((column) =>
      Object.keys(view?.attributes?.fixedColumns ?? {}).includes(column?.id)
    );

  const uncheckedElements = Object.values(fieldsMap)
    .filter((column) => {
      return view?.columns?.find((el) => el === column?.id);
    })
    ?.filter(
      (column) =>
        !Object.keys(view?.attributes?.fixedColumns ?? {}).includes(column?.id)
    );

  const columns = [...checkedElements, ...uncheckedElements].filter((column) =>
    search === ""
      ? true
      : column?.label?.toLowerCase().includes(search.toLowerCase())
  );

  const onChange = (column, checked) => {
    let fixed = [...Object.keys(view?.attributes?.fixedColumns ?? {})];
    if (checked) {
      fixed.push(column.id);
    } else {
      fixed = fixed.filter((el) => el !== column.id);
    }
    handleUpdateView({
      ...view,
      attributes: {
        ...view.attributes,
        fixedColumns: Object.fromEntries(fixed.map((key) => [key, true])),
      },
    });
  };

  return {
    isViewUpdating,
    setSearch,
    i18n,
    columns,
    onChange,
    view,
    search,
  }
}