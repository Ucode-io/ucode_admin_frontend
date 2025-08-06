import {Badge, Box, Menu} from "@mui/material";
import React, {useState} from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {Button} from "@chakra-ui/react";
import {default as InlineSVG, default as SVG} from "react-inlinesvg";
import {useTranslation} from "react-i18next";
import {useSearchParams} from "react-router-dom";

const viewIcons = {
  TABLE: "layout-alt-01.svg",
  CALENDAR: "calendar.svg",
  BOARD: "rows.svg",
  GRID: "grid.svg",
  TIMELINE: "line-chart-up.svg",
  WEBSITE: "globe.svg",
  TREE: "tree.svg",
  SECTION: "layout.svg",
};

function MoreViewsComponent({views = [], handleViewClick = () => {}}) {
  const {i18n} = useTranslation();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const query = new URLSearchParams(window.location.search);
  const viewId = query.get("v");

  const isViewExist = views?.find((item) => item?.id === viewId);

  const handleClick = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <>
      <Box>
        {Boolean(isViewExist?.id) ? (
          <Badge variant="dot" color="primary">
            <Box
              onClick={handleClick}
              sx={{height: "19px", width: "14px", cursor: "pointer"}}>
              <MoreVertIcon />
            </Box>
          </Badge>
        ) : (
          <Box
            onClick={handleClick}
            sx={{height: "19px", width: "14px", cursor: "pointer"}}>
            <MoreVertIcon />
          </Box>
        )}

        <Menu open={open} anchorEl={anchorEl} onClose={handleClose}>
          <Box
            sx={{
              borderRadius: "8px",
              minWidth: "100px",
              border: "1px solid #eee",
              display: "flex",
              alignItems: "flex-start",
              flexDirection: "column",
              padding: "5px",
            }}>
            {views?.map((view, index) => (
              <Button
                minW={"100%"}
                key={view.id}
                variant="ghost"
                colorScheme="gray"
                padding={"0 0 0 6px"}
                margin={"3px 0"}
                leftIcon={
                  <SVG
                    src={`/img/${viewIcons[view.type]}`}
                    color={viewId === view?.id ? "#175CD3" : "#475467"}
                    width={18}
                    height={18}
                  />
                }
                display={"flex"}
                alignItems={"center"}
                justifyContent={"flex-start"}
                fontSize={13}
                h={"30px"}
                fontWeight={500}
                color={viewId === view?.id ? "#175CD3" : "#475467"}
                bg={viewId === view?.id ? "#D1E9FF" : "#fff"}
                _hover={viewId === view?.id ? {bg: "#D1E9FF"} : undefined}
                onClick={() => handleViewClick(view, index)}>
                {view?.is_relation_view
                  ? view?.table_label || view.type
                  : view?.attributes?.[`name_${i18n?.language}`] ||
                    view?.name ||
                    view.type}
              </Button>
            ))}
          </Box>
        </Menu>
      </Box>
    </>
  );
}

export default MoreViewsComponent;
