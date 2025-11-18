import { useViewContext } from "@/providers/ViewProvider";
import { DRAWER_VIEW_TYPES } from "@/utils/constants/drawerConstants";
import { useState } from "react";

export const useScreenOptionsProps = () => {
  const { selectedViewType, setSelectedViewType } = useViewContext();

  const options = [
    { label: "Side peek", icon: "SidePeek", value: DRAWER_VIEW_TYPES.SidePeek },
    {
      label: "Center peek",
      icon: "CenterPeek",
      value: DRAWER_VIEW_TYPES.CenterPeek,
    },
    { label: "Full page", icon: "FullPage", value: DRAWER_VIEW_TYPES.FullPage },
  ];

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelectOption = (option) => {
    if (option) {
      setSelectedViewType(option?.value);
    }

    handleClose();
  };

  return {
    selectedViewType,
    handleSelectOption,
    handleClose,
    handleClick,
    anchorEl,
    options,
  };
};