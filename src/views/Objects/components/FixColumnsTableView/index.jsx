import ViewColumnOutlinedIcon from "@mui/icons-material/ViewColumnOutlined";
import { Checkbox, Menu } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import constructorObjectService from "../../../../services/constructorObjectService";
import style from "./style.module.scss";
import constructorViewService from "../../../../services/constructorViewService";
import { tr } from "date-fns/locale";

export default function FixColumnsTableView({ selectedTabIndex }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedView, setSelectedView] = useState({});
  const { tableSlug } = useParams();
  const queryClient = useQueryClient();
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const {
    data: { views, columns } = {
      views: [],
      columns: [],
    },
    refetch,
  } = useQuery(
    ["GET_VIEWS_AND_FIELDS_AT_VIEW_SETTINGS", { tableSlug }],
    () => {
      return constructorObjectService.getList(tableSlug, {
        data: { limit: 10, offset: 0, with_relations: true },
      });
    },
    {
      cacheTime: 0,
      select: ({ data }) => {
        return {
          views: data?.views ?? [],
          columns: data?.fields ?? [],
        };
      },
    }
  );

  useEffect(() => {
    setSelectedView(views?.[selectedTabIndex] ?? {});
  }, [views, selectedTabIndex]);

  const changeHandler = (column, e) => {
    setIsLoading(true);
    const computedData = {
      ...selectedView,
      attributes: {
        ...selectedView.attributes,
        fixedColumns: {
          ...selectedView.attributes?.fixedColumns,
          [column.id]: e,
        },
      },
    };

    setSelectedView(computedData);

    constructorViewService.update(computedData).then((res) => {
      queryClient.refetchQueries(["GET_VIEWS_AND_FIELDS"]).finally(() => {
        setIsLoading(false);
      });
    });
  };

  const visibleColumns = useMemo(() => {
    refetch();
    return columns.filter((column) => {
      return views[selectedTabIndex].columns.find((el) => el === column.id);
    });
  }, [views, columns, selectedTabIndex, anchorEl]);

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
          {visibleColumns.map((column) => (
            <div className={style.menuItem}>
              <span>{column.label}</span>

              <Checkbox
                onChange={(e) => {
                  changeHandler(column, e.target.checked);
                }}
                disabled={isLoading}
                checked={selectedView?.attributes?.fixedColumns?.[column.id]}
              />
            </div>
          ))}
        </div>
      </Menu>
    </>
  );
}
