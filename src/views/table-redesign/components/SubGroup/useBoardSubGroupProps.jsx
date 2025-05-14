import { useState } from "react";
import { useTranslation } from "react-i18next";

export const useBoardSubGroupProps = ({
  viewUpdateMutation,
  view,
  fieldsMap,
}) => {
  const [search, setSearch] = useState("");

  const { i18n } = useTranslation();

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
    i18n,
  };
};
