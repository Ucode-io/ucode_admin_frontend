import { useGetLang } from "@/hooks/useGetLang";
import { useViewContext } from "@/providers/ViewProvider";
import { detailDrawerActions } from "@/store/detailDrawer/detailDrawer.slice";
import { groupFieldActions } from "@/store/groupField/groupField.slice";
import { updateQueryWithoutRerender } from "@/utils/useSafeQueryUpdater";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export const useHeaderProps = ({ data }) => {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { tableSlug, isRelationView, handleCloseDrawer, menuId, tableInfo } =
    useViewContext();

  const viewsList = useSelector((state) => state.groupField.viewsList);

  const tableLan = useGetLang("Table");

  const handleSpaceDashboardClick = () => {
    navigate(`/${menuId}/customize/${tableInfo?.id}`, {
      state: {
        ...data,
        tableSlug,
        backLink: location?.pathname,
      },
    });
    dispatch(detailDrawerActions.closeDrawer());
  };

  const handleBreadCrumb = (item, index) => {
    if (!viewsList?.length) return;

    if (index === viewsList.length - 1) return;

    if (index === 0) {
      dispatch(detailDrawerActions.setDrawerTabIndex(0));
      dispatch(groupFieldActions.trimViewsUntil(viewsList[0]));
      dispatch(groupFieldActions.trimViewsDataUntil(viewsList[0]));
      updateQueryWithoutRerender("p", viewsList[0]?.detailId);
    } else {
      dispatch(detailDrawerActions.setDrawerTabIndex(0));
      dispatch(groupFieldActions.trimViewsUntil(item));
      dispatch(groupFieldActions.trimViewsDataUntil(item));
      updateQueryWithoutRerender("p", item?.detailId);
    }
  };

  return {
    navigate,
    tableSlug,
    tableLan,
    isRelationView,
    handleCloseDrawer,
    handleSpaceDashboardClick,
    viewsList,
    handleBreadCrumb,
  };
};