import { useGetLang } from "@/hooks/useGetLang";
import { useViewContext } from "@/providers/ViewProvider";
import { detailDrawerActions } from "@/store/detailDrawer/detailDrawer.slice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

export const useHeaderProps = ({ data }) => {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { tableSlug, isRelationView, handleCloseDrawer, menuId, tableInfo } =
    useViewContext();

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

  return {
    navigate,
    tableSlug,
    tableLan,
    isRelationView,
    handleCloseDrawer,
    handleSpaceDashboardClick,
  };
};