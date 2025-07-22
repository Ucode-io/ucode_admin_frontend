import {computedViewTypes} from "@/utils/constants/viewTypes";
import {
  Box,
  Button,
} from "@chakra-ui/react";
import { Popover as MuiPopover} from "@mui/material";
import { ViewCreate } from "../ViewCreate/ViewCreate";
import { useViewCreatePopupProps } from "./useViewCreatePopupProps";

export const ViewCreatePopup = ({
  views,
  viewAnchorEl,
  handleClosePop,
  handleClose,
  refetchViews,
  relationView,
  setSelectedView,
  relationFields,
  tableSlug,
  menuId,
  fieldsMapRel,
  fieldsMap,
}) => {

  const {
    getViewSettings,
    viewsWithSettings,
    createView,
    handleSelectViewType,
    selectedViewAnchor,
    selectedViewTab,
    closeViewSettings,
  } = useViewCreatePopupProps({
    relationFields,
    relationView,
    tableSlug,
    menuId,
    views,
    fieldsMapRel,
    fieldsMap,
    handleClose,
    handleClosePop,
    refetchViews,
  })

  return <>
    <MuiPopover
      open={Boolean(viewAnchorEl)}
      anchorEl={viewAnchorEl}
      anchorPosition={{ top: 200, left: 600 }}
      onClose={() => {
        handleClosePop();
      }}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      PaperProps={{
        sx: {
          overflow: "visible !important",
        },
      }}
    >
      <ViewCreate
        views={views}
        computedViewTypes={computedViewTypes}
        handleClose={handleClose}
        setSelectedView={setSelectedView}
        handleSelectViewType={handleSelectViewType}
        refetchViews={refetchViews}
      />
    </MuiPopover>
    <MuiPopover
      id={"view-settings"}
      open={
        !!selectedViewAnchor &&
        (viewsWithSettings.includes(selectedViewTab) ||
          Boolean(relationView))
      }
      anchorEl={selectedViewAnchor}
      onClose={closeViewSettings}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      anchorPosition={{ top: 200, left: 600 }}
    >
      <Box
        sx={{
          backgroundColor: "#fff",
          borderRadius: "8px",
          overflow: "hidden",
          width: "250px",
          border: "1px solid #D0D5DD",
          padding: "10px",
        }}
      >
        {getViewSettings(selectedViewTab)}
        <Box marginTop={"10px"}>
          <Button
            w="100%"
            h="32px"
            borderRadius="8px"
            color="#fff"
            bg="#175CD3"
            type="button"
            // disabled={loading}
            onClick={() => createView()}
          >
            Save
          </Button>
        </Box>
      </Box>
    </MuiPopover>
  </>
}