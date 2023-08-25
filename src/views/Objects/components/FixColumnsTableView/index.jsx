import ViewColumnOutlinedIcon from "@mui/icons-material/ViewColumnOutlined";
import { Menu } from "@mui/material";
import React, { useState } from "react";
import style from "./style.module.scss";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import constructorObjectService from "../../../../services/constructorObjectService";
import HFCheckbox from "../../../../components/FormElements/HFCheckbox";
import { CheckBox } from "@mui/icons-material";

export default function FixColumnsTableView() {
  const [anchorEl, setAnchorEl] = useState(null);
  const { tableSlug } = useParams();
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const {
    data: { views, columns, relationColumns } = {
      views: [],
      columns: [],
      relationColumns: [],
    },
    isLoading,
    refetch: refetchViews,
  } = useQuery(
    ["GET_VIEWS_AND_FIELDS_AT_VIEW_SETTINGS", { tableSlug }],
    () => {
      return constructorObjectService.getList(tableSlug, {
        data: { limit: 10, offset: 0, with_relations: true },
      });
    },
    {
      select: ({ data }) => {
        return {
          views: data?.views ?? [],
          columns: data?.fields ?? [],
          relationColumns:
            data?.relation_fields?.map((el) => ({
              ...el,
              label: `${el.label} (${el.table_label})`,
            })) ?? [],
        };
      },
    }
  );

  return (
    <>
      <button className={style.moreButton} onClick={handleClick}>
        <ViewColumnOutlinedIcon
          style={{
            color: "#A8A8A8",
          }}
        />
        Fix columns
      </button>

      <Menu
        open={open}
        onClose={handleClose}
        anchorEl={anchorEl}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              // width: 100,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
      >
        <div className={style.menuItems}>
          {columns.map((column) => (
            <div className={style.menuItem}>
              <span>{column.label}</span>
              <CheckBox/>
            </div>
          ))}
        </div>
      </Menu>
    </>
  );
}
