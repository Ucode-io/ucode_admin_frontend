import { usePermission } from "@/hooks/usePermission";
import { useViewContext } from "@/providers/ViewProvider";
import { store } from "@/store/index";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";

export const useTableRowProps = ({
  selectedObjectsForDelete,
  setSelectedObjectsForDelete,
  row,
}) => {
  const { tableSlug, viewForm, view } = useViewContext();

  const navigate = useNavigate();
  const projectId = store.getState().auth?.projectId;
  const hasPermission = usePermission({ tableSlug, type: "delete" });

  const changeSetDelete = (row) => {
    if (selectedObjectsForDelete?.find((item) => item === row?.[0]?.guid)) {
      setSelectedObjectsForDelete(
        selectedObjectsForDelete?.filter((item) => item !== row?.[0]?.guid),
      );
    } else {
      setSelectedObjectsForDelete([
        ...selectedObjectsForDelete,
        row?.[0]?.guid,
      ]);
    }
  };
  const parentRef = useRef(null);
  const selected = Boolean(
    selectedObjectsForDelete?.find((item) => item === row?.[0]?.guid),
  );

  return {
    navigate,
    projectId,
    hasPermission,
    changeSetDelete,
    parentRef,
    selected,
    viewForm,
    view,
    tableSlug,
  };
};
