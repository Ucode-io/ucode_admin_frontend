import {TextField} from "@mui/material";
import React, {useState} from "react";
import styles from "./style.module.scss";
import IconGeneratorIconjs from "./IconGeneratorIconjs";
import IconGenerator from "./IconGenerator";
import {iconsList} from "../../utils/constants/iconsList";
import useDebouncedWatch from "../../hooks/useDebouncedWatch";
import axios from "axios";

function OverallCategoryIcons({
  tabIndex = 0,
  onChange = () => {},
  handleClose = () => {},
}) {
  const [searchText, setSearchText] = useState("");
  const newIconsList = iconsList.slice(0, 17);
  const [computedIconsList, setComputedIconsList] = useState(newIconsList);

  useDebouncedWatch(
    () => {
      const filteredList = iconsList.filter((icon) =>
        icon.includes(searchText)
      );

      if (searchText) {
        setComputedIconsList(filteredList.slice(0, 40));
      } else {
        setComputedIconsList(newIconsList);
      }
    },
    [searchText],
    300
  );

  useDebouncedWatch(
    () => {
      if (!searchText) return;

      axios
        .get(`https://api.iconify.design/search?query=${searchText}`)
        .then((res) => {
          const apiIcons = res?.data?.icons || [];

          const localIcons = iconsList.filter((icon) =>
            icon.includes(searchText)
          );

          const merged = [...new Set([...localIcons, ...apiIcons])];

          setComputedIconsList(merged.slice(0, 40));
        })
        .catch((err) => {
          console.error("Failed to fetch icons", err);
        });
    },
    [searchText],
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
        inputProps={{ tabIndex }}
        onKeyDown={(e) => {
          e.stopPropagation();
        }}
        onChange={(e) => {
          setSearchText(e.target.value);
        }}
        sx={{ marginTop: "10px" }}
      />
      <div className={styles.iconsBlock}>
        {computedIconsList.map((icon) => (
          <div
            key={icon}
            className={styles.popupIconWrapper}
            style={{
              color: newIconsList.includes(icon) ? "transparent" : "#101828",
            }}
            onClick={() => {
              onChange(
                icon.includes(":")
                  ? `${import.meta.env.VITE_ICONJS_PICKER_URL}/${icon}.svg`
                  : `${import.meta.env.VITE_ICON_PICKER_CDN_BASE_URL}${icon}`,
              );
              handleClose();
            }}
          >
            {icon.includes(":") ? (
              <IconGeneratorIconjs icon={icon} />
            ) : (
              <IconGenerator icon={icon} />
            )}
          </div>
        ))}
      </div>
    </>
  );
}

export default OverallCategoryIcons;
