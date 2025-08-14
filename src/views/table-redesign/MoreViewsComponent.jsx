import {Box, Button, Flex, Input} from "@chakra-ui/react";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import {Menu} from "@mui/material";
import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {default as SVG} from "react-inlinesvg";
import AddIcon from "@mui/icons-material/Add";

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

function MoreViewsComponent({
  views = [],
  setViewAnchorEl = () => {},
  handleViewClick = () => {},
  setSelectedView = () => {},
}) {
  const {i18n} = useTranslation();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const query = new URLSearchParams(window.location.search);
  const viewId = query.get("v");

  const handleClick = (e) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };
  const handleClose = () => setAnchorEl(null);

  const handleMenuSelect = (view) => {
    setSelectedView(view);
    handleViewClick(view);
    handleClose();
  };
  return (
    <>
      <Box sx={{width: "20px"}}>
        <Box
          onClick={handleClick}
          sx={{height: "19px", cursor: "pointer", marginRight: "15px"}}>
          <KeyboardArrowDownIcon />
        </Box>

        <Menu open={open} anchorEl={anchorEl} onClose={handleClose}>
          <Box
            sx={{
              borderRadius: "8px",
              width: "300px",
              border: "1px solid #eee",
              display: "flex",
              alignItems: "flex-start",
              flexDirection: "column",
              padding: "5px",
            }}>
            <Input
              placeholder="Search"
              onChange={(e) => {
                e.stopPropagation();
              }}
            />

            <Box
              sx={{
                width: "100%",
                padding: "5px",
                borderBottom: "1px solid #eee",
              }}>
              {views?.map((view, index) => (
                <Flex
                  w={"100%"}
                  alignItems={"center"}
                  borderRadius={"6px"}
                  _hover={{
                    background: "#edf2f6",
                  }}>
                  <Button
                    w={"20px"}
                    p={"0"}
                    bg={"none"}
                    h={"24px"}
                    _hover={{
                      bg: "none",
                    }}
                    color={viewId === view?.id ? "#175CD3" : "#475467"}>
                    <DragIndicatorIcon />
                  </Button>
                  <Button
                    w={"100%"}
                    key={view.id}
                    variant="ghost"
                    colorScheme="gray"
                    padding={"0"}
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
                    _hover={{
                      bg: "none",
                    }}
                    fontWeight={500}
                    color={viewId === view?.id ? "#175CD3" : "#475467"}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewClick(view, index);
                      handleMenuSelect(view);
                    }}>
                    {view?.is_relation_view
                      ? view?.table_label || view.type
                      : view?.attributes?.[`name_${i18n?.language}`] ||
                        view?.name ||
                        view.type}
                  </Button>
                  <Button
                    color={"#000"}
                    bg={"none"}
                    h={"24px"}
                    _hover={{
                      background: "none",
                    }}>
                    <MoreHorizIcon />
                  </Button>
                </Flex>
              ))}
            </Box>

            <Button
              onClick={(e) => {
                setViewAnchorEl(e.currentTarget);
              }}
              mt={"5px"}
              bg={"none"}
              justifyContent={"flex-start"}
              gap={"5px"}
              _hover={{
                bg: "#eee",
              }}
              color={"#475467"}
              w={"100%"}
              textAlign={"justify"}>
              <AddIcon style={{width: "20px", height: "20px"}} />
              <Box fontSize={"14px"} fontWeight={"400"}>
                New view
              </Box>
            </Button>
          </Box>
        </Menu>
      </Box>
    </>
  );
}

export default MoreViewsComponent;
