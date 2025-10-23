import { useViewContext } from "@/providers/ViewProvider";
import { useFieldsContext } from "@/views/views/providers/FieldsProvider";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export const useBoardSubGroupProps = ({
  viewUpdateMutation,
}) => {

  const {
    view
  } = useViewContext();

  const {
    fieldsMap
  } = useFieldsContext();

  const {i18n} = useTranslation();

  const [search, setSearch] = useState("");

  const handleUpdateSubGroup = (type, checked) => {
    viewUpdateMutation.mutate({
      ...view,
      attributes: {
        ...view.attributes,
        sub_group_by_id: checked ? type : null,
      },
    });
  };

  const renderFields =
    view?.columns?.filter((item) =>
      search === ""
        ? item
        : fieldsMap[item]?.attributes?.field_permission?.label
            ?.toLowerCase()
            .includes(search.toLowerCase())
    ) ?? [];

  return {
    handleUpdateSubGroup,
    search,
    setSearch,
    renderFields,
    view,
    fieldsMap,
    i18n,
  };
};
