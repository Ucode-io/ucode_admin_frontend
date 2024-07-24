import React, {useState} from "react";
import {Tab, TabList, TabPanel, Tabs} from "react-tabs";
import {Box, Menu, MenuItem} from "@mui/material";
import styles from "./style.module.scss";
import DetailPageSection from "./DetailPageSection";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

function DetailPageTabs({control, selectedTab, setSelectedTab, data}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const open = Boolean(anchorEl);

  const maxVisibleTabs = 5;
  const visibleTabs = data?.tabs?.slice(0, maxVisibleTabs);
  const moreTabs = data?.tabs?.slice(maxVisibleTabs);

  const handleMoreClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleTabChange = (index) => {
    setSelectedIndex(index);
    handleClose();
  };

  return (
    <Box id="detailPageTabs">
      <Tabs selectedIndex={selectedIndex} onSelect={handleTabChange}>
        <TabList>
          {visibleTabs?.map((item, index) => (
            <Tab key={item.id} className={styles.reactTabs}>
              {item.label}
            </Tab>
          ))}
          {moreTabs?.length > 0 && (
            <>
              <button onClick={handleMoreClick} className={styles.moreButton}>
                Еще
                <KeyboardArrowDownIcon />
              </button>
              <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                <Box sx={{minWidth: "200px"}}>
                  {moreTabs?.map((item, index) => (
                    <MenuItem
                      sx={{
                        padding: "10px 15px",
                        fontSize: "13px",
                        fontWeight: "600",
                        color: "#667085",
                      }}
                      key={item.id}
                      onClick={() => handleTabChange(maxVisibleTabs + index)}>
                      {item.label}
                    </MenuItem>
                  ))}
                </Box>
              </Menu>
            </>
          )}
        </TabList>

        {data?.tabs?.map((item) => (
          <TabPanel key={item.id}>
            <DetailPageSection control={control} item={item} />
          </TabPanel>
        ))}
      </Tabs>
    </Box>
  );
}

export default DetailPageTabs;
