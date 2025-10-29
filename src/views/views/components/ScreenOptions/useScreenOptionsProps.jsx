import { useViewContext } from "@/providers/ViewProvider";
import { DRAWER_LAYOUT_TYPES, DRAWER_VIEW_TYPES } from "@/utils/constants/drawerContants";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const useScreenOptionsProps = () => {

  const {
    menuId,
    projectInfo,
    selectedView,
    selectedViewType,
    selectedRow,
    setLayoutType,
    setSelectedViewType,
  } = useViewContext();

  const options = [
    {label: "Side peek", icon: "SidePeek", value: DRAWER_VIEW_TYPES.SidePeek},
    {label: "Center peek", icon: "CenterPeek", value: DRAWER_VIEW_TYPES.CenterPeek},
    {label: "Full page", icon: "FullPage", value: DRAWER_VIEW_TYPES.FullPage},
  ];

  const location = useLocation();
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelectOption = (option) => {
    if(option) {
      localStorage.setItem("detailPage", option?.value);
      if (location?.state?.fullPage) {
        navigate(-1);
        setLayoutType(DRAWER_VIEW_TYPES.SidePeek);
      }
      if (option?.icon === "FullPage") {
        setLayoutType(DRAWER_LAYOUT_TYPES.SIMPLE);
        navigate(`/${menuId}/detail?p=${selectedRow?.guid}`, {
          state: {
            viewId: selectedView?.id,
            table_slug: selectedView?.table_slug,
            projectInfo: projectInfo,
            selectedRow: selectedRow,
            fullPage: true,
          },
        });
      }
      setSelectedViewType(option?.value);
    }

    handleClose();
  }

  return {
    selectedViewType,
    handleSelectOption,
    handleClose,
    handleClick,
    anchorEl,
    options,
  }

}