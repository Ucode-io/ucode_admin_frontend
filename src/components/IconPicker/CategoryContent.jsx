import {useEffect, useState} from "react";
import useDebouncedWatch from "../../hooks/useDebouncedWatch";
import axios from "axios";
import {TextField} from "@mui/material";
import styles from "./style.module.scss";
import IconGeneratorIconjs from "./IconGeneratorIconjs";

function CategoryContent({
  tabIndex = 0,
  selectedTab = null,
  onChange = () => {},
  selectedTabIndex = 0,
  handleClose = () => {},
}) {
  const [searchText, setSearchText] = useState("");
  const [prefix, setPrefix] = useState(false);
  const [computedIconsList, setComputedIconsList] = useState([]);

  useEffect(() => {
    if (!searchText) {
      setPrefix(selectedTab?.category);

      axios
        .get(
          `https://api.iconify.design/collection?prefix=${selectedTab?.category}`
        )
        .then((res) => {
          const categoriesObj = res?.data?.categories || {};
          const hiddenIcons = res?.data?.uncategorized || [];
          let iconsArray = [];

          if (Object.keys(categoriesObj).length > 0) {
            const firstKey = Object.keys(categoriesObj)[0];
            iconsArray = categoriesObj[firstKey] || [];
          } else if (Array.isArray(hiddenIcons) && hiddenIcons.length > 0) {
            iconsArray = hiddenIcons;
          }

          setComputedIconsList(iconsArray.slice(0, 40));
        })
        .catch((err) => console.error("Failed to fetch icons", err));
    }
  }, [searchText, selectedTab?.category]);

  useDebouncedWatch(
    () => {
      if (!searchText) return;
      setPrefix("");
      axios
        .get(
          `https://api.iconify.design/search?query=${searchText}&prefix=${selectedTab?.category}`
        )
        .then((res) => {
          const apiIcons = res?.data?.icons || [];
          setComputedIconsList(apiIcons.slice(0, 40));
        })
        .catch((err) => console.error("Failed to fetch icons", err));
    },
    [searchText, selectedTabIndex, selectedTab?.category],
    500
  );

  return (
    <>
      <TextField
        placeholder="Search Icon"
        size="small"
        fullWidth
        value={searchText}
        autoFocus={tabIndex === 1}
        inputProps={{tabIndex}}
        onChange={(e) => setSearchText(e.target.value)}
        sx={{marginTop: "10px"}}
      />
      <div className={styles.iconsBlock}>
        {computedIconsList.map((icon) => (
          <div
            key={icon}
            className={styles.popupIconWrapper}
            onClick={() => {
              onChange(`${selectedTab?.category}:${icon}`);
              handleClose();
            }}>
            <IconGeneratorIconjs prefix={prefix} icon={icon} />
          </div>
        ))}
      </div>
    </>
  );
}

export default CategoryContent;
