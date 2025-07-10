import { useState } from "react";

export const useBoardSubGroupProps = ({
  viewUpdateMutation,
  view,
  fieldsMap,
}) => {
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
  };
};
