import React, {useState} from "react";
import styles from "./style.module.scss";
import {Box, CircularProgress, Menu, MenuItem, Typography} from "@mui/material";
import {IOSSwitch} from "../../../../theme/overrides/IosSwitch";
import constructorViewService from "../../../../services/constructorViewService";
import {useQueryClient} from "react-query";
import {useParams} from "react-router-dom";

function TableHead({columns, view}) {
  const {tableSlug} = useParams();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const queryClient = useQueryClient();
  const handleClose = () => setAnchorEl(null);
  const handleClick = (e) => setAnchorEl(e.currentTarget);
  const [switchLoading, setSwitchLoading] = useState(false);

  const updateView = (data, fieldId) => {
    setSwitchLoading((prev) => ({...prev, [fieldId]: true}));
    constructorViewService
      .update(tableSlug, {
        ...view,
        columns: data,
      })
      .then(() => {
        queryClient.refetchQueries(["GET_VIEWS_AND_FIELDS"]);
      })
      .finally(() => {
        handleClose();
        setSwitchLoading((prev) => ({...prev, [fieldId]: false}));
      });
  };

  return (
    <>
      <thead>
        <tr>
          {columns?.map((column) => (
            <th key={column.accessor}>
              <div className={styles.tableHeaditem}>
                <p>{column?.label}</p>
                <button onClick={handleClick}>
                  <img src="/img/dots_horizontal.svg" alt="" />
                </button>
              </div>

              <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
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
                    <IOSSwitch color="primary" />
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
                      switchLoading[column.relation_id] ? (
                        <CircularProgress sx={{color: "#449424"}} size={24} />
                      ) : (
                        <IOSSwitch
                          size="small"
                          checked={
                            !view?.columns?.includes(column?.relation_id)
                          }
                          onChange={(e) => {
                            updateView(
                              !e.target.checked
                                ? [...view?.columns, column?.relation_id]
                                : view?.columns?.filter(
                                    (el) => el !== column?.relation_id
                                  ),
                              column?.relation_id
                            );
                          }}
                        />
                      )
                    ) : switchLoading[column.id] ? (
                      <CircularProgress sx={{color: "#449424"}} size={24} />
                    ) : (
                      <IOSSwitch
                        size="small"
                        checked={!view?.columns?.includes(column?.id)}
                        onChange={(e) => {
                          updateView(
                            !e.target.checked
                              ? [...view?.columns, column?.id]
                              : view?.columns?.filter(
                                  (el) => el !== column?.id
                                ),
                            column?.id
                          );
                        }}
                      />
                    )}
                  </MenuItem>
                </Box>
              </Menu>
            </th>
          ))}
        </tr>
      </thead>
    </>
  );
}

export default TableHead;
