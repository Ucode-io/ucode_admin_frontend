import {Box, Menu} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import React, {useState} from "react";
import {Delete} from "@mui/icons-material";
import RectangleIconButton from "@/components/Buttons/RectangleIconButton";
import layoutService from "@/services/layoutService";

function RemoveRelationView({
  tab,
  layout,
  tableSlug,
  layoutTabs,
  setLayoutTabs = () => {},
  setSelectTab = () => {},
  setSelectedTabIndex = () => {},
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  function updateLayout(tabVal) {
    const filteredTabs = layoutTabs?.filter((el) => el?.id !== tabVal?.id);

    const currentUpdatedLayout = {
      ...layout,
      tabs: filteredTabs,
    };

    layoutService.update(currentUpdatedLayout, tableSlug).then((res) => {
      handleClose();
      setSelectTab(res?.tabs[res?.tabs?.length - 1]);
      setSelectedTabIndex(res?.tabs?.length - 1);
      setLayoutTabs(res?.tabs);
    });
  }

  return (
    <>
      <Box onClick={handleClick} sx={{height: "14px", width: "14px"}}>
        <MoreVertIcon style={{height: "14px", width: "14px"}} />
      </Box>

      <Menu open={open} anchorEl={anchorEl} onClose={handleClose}>
        <RectangleIconButton
          style={{
            width: "120px",
            // height: "32px",
            border: "none",
            cursor: "pointer",
            padding: "8px 4px",
          }}
          color="error"
          onClick={() => updateLayout(tab)}>
          <Box
            sx={{
              padding: "2px 4px",
              display: "flex",
              alignItems: "center",
              color: "#fe4842",
              gap: "4px",
              borderRadius: "6px",
            }}>
            <Delete color="error" />
            <Box sx={{fontWeight: "400"}}>Delete view</Box>
          </Box>
        </RectangleIconButton>
      </Menu>
    </>
  );
}

export default RemoveRelationView;
