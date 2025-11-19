import {Box, Button, Flex, Input} from "@chakra-ui/react";
import {Menu} from "@mui/material";
import React, {useState, useMemo} from "react";
import {useTranslation} from "react-i18next";
import {default as SVG} from "react-inlinesvg";
import AddIcon from "@mui/icons-material/Add";
import { ViewSettingsModal } from "../ViewSettingsModal";

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

export const MoreViews = ({
  anchorEl = null,
  open = false,
  views = [],
  tableLan = {},
  selectedView = {},
  selectedTabIndex = 0,
  refetchViews = () => {},
  handleClose = () => {},
  handleViewClick = () => {},
  setSelectedView = () => {},
  setViewAnchorEl = () => {},
  getViewName = () => {},
}) => {
  const { i18n } = useTranslation();
  const [searchText, setSearchText] = useState("");
  const query = new URLSearchParams(window.location.search);
  const viewId = query.get("v");

  const handleMenuSelect = (view) => {
    setSelectedView(view);
    handleViewClick(view);
    handleClose();
  };

  const filteredViews = useMemo(() => {
    const lowerSearch = searchText.toLowerCase();
    return views.filter((view) => {
      const name = view?.is_relation_view
        ? view?.table_label || view.type
        : view?.attributes?.[`name_${i18n?.language}`] ||
          view?.name ||
          view.type;

      return name?.toLowerCase().includes(lowerSearch);
    });
  }, [views, searchText, i18n?.language]);

  return (
    <>
      <Box sx={{ width: "20px" }}>
        <Menu open={open} anchorEl={anchorEl} onClose={handleClose}>
          <Box
            sx={{
              borderRadius: "8px",
              width: "250px",
              border: "1px solid #eee",
              display: "flex",
              alignItems: "flex-start",
              flexDirection: "column",
              padding: "5px",
            }}
          >
            <Input
              h={"30px"}
              placeholder="Search"
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
                e.stopPropagation();
              }}
              onKeyDown={(e) => e.stopPropagation()}
            />

            <Box
              sx={{
                width: "100%",
                padding: "0px",
                borderBottom: "1px solid #eee",
                maxHeight: "300px",
                overflowY: "auto",
              }}
            >
              {filteredViews.length > 0 ? (
                filteredViews.map((view, index) => (
                  <Flex
                    m={"5px 0"}
                    key={view.id}
                    p={"0 4px"}
                    w={"100%"}
                    h={"26px"}
                    alignItems={"center"}
                    borderRadius={"6px"}
                    _hover={{
                      background: "#edf2f6",
                    }}
                  >
                    <Button
                      w={"100%"}
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
                      fontSize={12}
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
                      }}
                    >
                      {getViewName(view)}
                    </Button>

                    <ViewSettingsModal
                      viewSetting={true}
                      refetchViews={refetchViews}
                      selectedTabIndex={selectedTabIndex}
                      tableLan={tableLan}
                      selectedView={selectedView}
                    />
                  </Flex>
                ))
              ) : (
                <Box fontSize="14px" color="gray" p="10px">
                  No results found
                </Box>
              )}
            </Box>

            <Button
              onClick={(e) => {
                setViewAnchorEl(e.currentTarget);
              }}
              p={"0"}
              h={"26px"}
              mt={"5px"}
              bg={"none"}
              justifyContent={"flex-start"}
              gap={"2px"}
              _hover={{
                bg: "#eee",
              }}
              color={"#475467"}
              w={"100%"}
              textAlign={"justify"}
            >
              <AddIcon style={{ width: "20px", height: "20px" }} />
              <Box fontSize={"14px"} fontWeight={"400"}>
                New view
              </Box>
            </Button>
          </Box>
        </Menu>
      </Box>
    </>
  );
};
