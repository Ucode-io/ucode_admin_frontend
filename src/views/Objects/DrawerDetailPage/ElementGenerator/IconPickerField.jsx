import {Lock} from "@mui/icons-material";
import {CircularProgress, IconButton, Menu, Tooltip} from "@mui/material";
import {memo, useId, useRef, useState} from "react";
import {Tab, TabList, TabPanel, Tabs} from "react-tabs";
import styles from "./style.module.scss";
import {useSelector} from "react-redux";
import IconGeneratorIconjs from "../../../../components/IconPicker/IconGeneratorIconjs";
import IconGenerator from "../../../../components/IconPicker/IconGenerator";
import OverallCategoryIcons from "../../../../components/IconPicker/OverallCategoryIcons";
import CategoryContent from "../../../../components/IconPicker/CategoryContent";

const defaultOverallTab = {label: "Overall", category: "", value: "overall"};

const IconPicker = ({
  value = "",
  onChange,
  customeClick,
  clickItself,
  tabIndex,
  error,
  loading,
  shape = "circle",
  disabled,
  ...props
}) => {
  const buttonRef = useRef();
  const id = useId();
  const [selectedTab, setSelectedTab] = useState();
  const [dropdownIsOpen, setDropdownIsOpen] = useState(false);
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);

  const iconCategoriesFromRedux = useSelector((state) =>
    state?.iconCategories?.iconCategories?.map((item, index) => ({
      label: item?.split("#")?.[1],
      category: item?.split("#")?.[0],
      value: index + 1,
    }))
  );

  const iconCategories = [
    defaultOverallTab,
    ...(iconCategoriesFromRedux || []),
  ];

  const handleClose = () => setDropdownIsOpen(false);
  const handleOpen = () => setDropdownIsOpen(true);

  if (loading)
    return (
      <IconButton color="primary">
        <CircularProgress size={17} />
      </IconButton>
    );

  return (
    <div
      style={{height: "16px"}}
      onClick={(e) => e.stopPropagation()}
      {...props}>
      <div
        ref={buttonRef}
        className={`${styles.iconWrapper} ${error ? styles.error : ""} ${styles[shape]}`}
        style={{backgroundColor: value ?? "#fff"}}
        aria-describedby={id}
        onClick={customeClick ? clickItself : !disabled && handleOpen}>
        {disabled ? (
          <Tooltip title="This field is disabled for this role!">
            <Lock style={{fontSize: "20px"}} />
          </Tooltip>
        ) : value?.includes(":") ? (
          <IconGeneratorIconjs icon={value} disabled={disabled} />
        ) : (
          <IconGenerator icon={value} disabled={disabled} />
        )}
      </div>

      <Menu
        id={id}
        anchorEl={buttonRef.current}
        onClose={handleClose}
        open={dropdownIsOpen}
        anchorOrigin={{horizontal: "left", vertical: "bottom"}}
        classes={{paper: styles.menuPaper, list: styles.menuList}}>
        <Tabs onSelect={(e) => setSelectedTabIndex(e)} className={styles.tabs}>
          <TabList className={styles.tabList}>
            {iconCategories?.map((tab, index) => (
              <Tab
                onClick={() => setSelectedTab(tab)}
                key={index}
                selectedClassName={styles.active}
                className={styles.tab}>
                {tab?.label}
              </Tab>
            ))}
          </TabList>
          {iconCategories?.map((itemTab, index) => {
            const isFirst = index === 0;
            return (
              <TabPanel key={itemTab?.value || index}>
                {isFirst ? (
                  <OverallCategoryIcons
                    tabIndex={index}
                    handleClose={handleClose}
                    onChange={onChange}
                    selectedTabIndex={selectedTabIndex}
                  />
                ) : (
                  <CategoryContent
                    tabIndex={index}
                    selectedTab={selectedTab}
                    handleClose={handleClose}
                    onChange={onChange}
                    selectedTabIndex={selectedTabIndex}
                  />
                )}
              </TabPanel>
            );
          })}
        </Tabs>
      </Menu>
    </div>
  );
};

export default memo(IconPicker);
