import {Lock} from "@mui/icons-material";
import {CircularProgress, IconButton, Menu, Tooltip} from "@mui/material";
import {memo, useId, useRef, useState} from "react";
import {Tab, TabList, TabPanel, Tabs} from "react-tabs";
import CategoryContent from "./CategoryContent";
import IconGenerator from "./IconGenerator";
import IconGeneratorIconjs from "./IconGeneratorIconjs";
import OverallCategoryIcons from "./OverallCategoryIcons";
import styles from "./style.module.scss";

const iconCategories = [
  {label: "Overall", value: 1, category: ""},
  {
    label: "Google material icons",
    category: "ic",
    value: 2,
  },
  {
    label: "Solar",
    value: 3,
    category: "solar",
  },
  {
    label: "Remix",
    value: 4,
    category: "ri",
  },

  {
    label: "Carbon",
    value: 5,
    category: "carbon",
  },
  {
    label: "Fluent ui system ",
    value: 6,
    category: "fluent",
  },
  {
    label: "Material icon theme",
    value: 7,
    category: "material-icon-theme",
  },
  {
    label: "Openmoji",
    value: 8,
    category: "openmoji",
  },
  {
    label: "Flag icons",
    value: 9,
    category: "flag",
  },
  {
    label: "Twitter emoji",
    value: 10,
    category: "twemoji",
  },
  {
    label: "SVG logos",
    value: 11,
    category: "logos",
  },
];

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
