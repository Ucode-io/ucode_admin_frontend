import AppsIcon from "@mui/icons-material/Apps";
import { CircularProgress, Menu } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import constructorObjectService from "../../services/constructorObjectService";
import constructorViewService from "../../services/constructorViewService";
import GroupByTab from "./components/ViewSettings/GroupByTab";

export default function GroupColumnVisible({ selectedTabIndex }) {
  const form = useForm();
  const queryClient = useQueryClient();
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

  const watchedGroupColumns = form.watch("attributes.group_by_columns");
  const watchedColumns = form.watch("columns");
  const group_by = views?.[selectedTabIndex]?.attributes.group_by_columns;
  const type = views?.[selectedTabIndex]?.type;

  const computedColumns = useMemo(() => {
    if (type !== "CALENDAR" && type !== "GANTT") {
      return columns;
    } else {
      return [...columns, ...relationColumns];
    }
  }, [columns, relationColumns, type]);

  useEffect(() => {
    form.reset({
      attributes: {
        group_by_columns: columns?.map((item) => {
          return {
            ...item,
            is_checked: group_by?.find((el) => el === item.id) ? true : false,
          };
        }),
      },
      columns:
        computedColumns?.map((el) => ({
          ...el,
          is_checked: views?.[selectedTabIndex]?.columns?.find(
            (column) => column === el.id
          ),
        })) ?? [],
    });
  }, [selectedTabIndex, views, form, group_by, columns]);

  const updateView = () => {
    constructorViewService
      .update({
        ...views?.[selectedTabIndex],
        attributes: {
          group_by_columns: watchedGroupColumns
            ?.filter((el) => el.is_checked)
            ?.map((el) => el.id),
        },
        columns: watchedColumns
          ?.filter((el) => el.is_checked)
          ?.map((el) => el.id),
      })
      .then(() => {
        queryClient.refetchQueries(["GET_VIEWS_AND_FIELDS"]);
        queryClient.refetchQueries(["GET_OBJECTS_LIST"]);
      });
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 5,
          color: "#A8A8A8",
          cursor: "pointer",
          fontSize: "13px",
          fontWeight: 500,
          lineHeight: "16px",
          letterSpacing: "0em",
          textAlign: "left",
          padding: "0 10px",
        }}
        onClick={handleClick}
      >
        <AppsIcon color={"#A8A8A8"} />
        Group by columns
      </div>

      <Menu
        open={open}
        onClose={handleClose}
        anchorEl={anchorEl}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            mt: 1.5,
            "& .MuiAvatar-root": {
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              left: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
      >
        {isLoading ? (
          <CircularProgress />
        ) : (
          <GroupByTab form={form} updateView={updateView} isMenu={true} />
        )}
      </Menu>
    </div>
  );
}
