import React, {useState} from "react";
import styles from "./style.module.scss";
import {Box, CircularProgress, Menu, MenuItem, Typography} from "@mui/material";
import {IOSSwitch} from "../../../../theme/overrides/IosSwitch";

function DetailPageHead({fields, column, view}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);
  return (
    <>
      <th>
        {column?.label}
        <button onClick={handleClick} className={styles.detailRelationhead}>
          <img src="/img/dots_horizontal.svg" alt="" />
        </button>
      </th>

      <Menu open={open} anchorEl={anchorEl} onClose={handleClose}>
        <Box sx={{width: "244px"}}>
          <MenuItem
            sx={{
              display: "flex",
              justifyContent: "space-between",
              padding: "11px 14px",
            }}>
            <Typography
              sx={{
                color: "#101828",
                fontWeight: 500,
                fontSize: "14px",
              }}>
              Fix
            </Typography>
            {/* {columnFix ? (
              <CircularProgress sx={{color: "#449424"}} size={24} />
            ) : ( */}
            <IOSSwitch
              //   checked={view?.attributes?.fixedColumns?.[selectedColumn?.id]}
              // onChange={(e) => {
              //   fixColumnChangeHandler(selectedColumn, e.target.checked);
              // }}
              color="primary"
            />
            {/* )} */}
          </MenuItem>
          <MenuItem
            sx={{
              display: "flex",
              justifyContent: "space-between",
              padding: "11px 14px",
            }}>
            <Typography
              sx={{
                color: "#101828",
                fontWeight: 500,
                fontSize: "14px",
              }}>
              Hide
            </Typography>

            {column?.type === "LOOKUP" || column?.type === "LOOKUPS" ? (
              isLoading ? (
                <CircularProgress sx={{color: "#449424"}} size={24} />
              ) : (
                <IOSSwitch
                  size="small"
                  //   checked={computedColumns?.includes(column?.relation_id)}
                  //   onChange={(e) => {
                  //     updateView(
                  //       e.target.checked
                  //         ? data?.tabs?.[selectedTabIndex]?.attributes?.columns ??
                  //           data?.tabs?.[selectedTabIndex]?.relation?.columns
                  //           ? [
                  //               ...(data?.tabs?.[selectedTabIndex]?.attributes
                  //                 ?.columns ??
                  //                 data?.tabs?.[selectedTabIndex]?.relation
                  //                   ?.columns),
                  //               column?.relation_id,
                  //             ]
                  //           : [column?.relation_id]
                  //         : (
                  //             data?.tabs?.[selectedTabIndex]?.attributes
                  //               ?.columns ??
                  //             data?.tabs?.[selectedTabIndex]?.relation?.columns
                  //           )?.filter((el) => el !== column?.relation_id)
                  //     );
                  //   }}
                />
              )
            ) : isLoading ? (
              <CircularProgress sx={{color: "#449424"}} size={24} />
            ) : (
              <IOSSwitch
                size="small"
                // checked={computedColumns?.includes(column?.id)}
                // onChange={(e) => {
                //   updateView(
                //     e.target.checked
                //       ? data?.tabs?.[selectedTabIndex]?.attributes?.columns ??
                //         data?.tabs?.[selectedTabIndex]?.relation?.columns
                //         ? [
                //             ...(data?.tabs?.[selectedTabIndex]?.attributes
                //               ?.columns ??
                //               data?.tabs?.[selectedTabIndex]?.relation
                //                 ?.columns),
                //             column?.id,
                //           ]
                //         : [column?.id]
                //       : (
                //           data?.tabs?.[selectedTabIndex]?.attributes?.columns ??
                //           data?.tabs?.[selectedTabIndex]?.relation?.columns
                //         )?.filter((el) => el !== column?.id)
                //   );
                // }}
              />
            )}
          </MenuItem>
        </Box>
      </Menu>
    </>
  );
}

export default DetailPageHead;
