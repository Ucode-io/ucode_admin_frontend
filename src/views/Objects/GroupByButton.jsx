import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import LayersOutlinedIcon from "@mui/icons-material/LayersOutlined";
import { Button, CircularProgress, Menu } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useQuery, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import constructorObjectService from "../../services/constructorObjectService";
import constructorViewService from "../../services/constructorViewService";
import GroupsTab from "./components/ViewSettings/GroupsTab";

export default function GroupByButton({ selectedTabIndex, view, fieldsMap, relationColumns, text = "Tab group", width = "" }) {
  const form = useForm();
  const queryClient = useQueryClient();
  const [anchorEl, setAnchorEl] = useState(null);
  // const { tableSlug } = useParams();
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  // const {
  //   data: { views, columns, relationColumns } = {
  //     views: [],
  //     columns: [],
  //     relationColumns: [],
  //   },
  //   isLoading,
  //   refetch: refetchViews,
  // } = useQuery(
  //   ["GET_VIEWS_AND_FIELDS_AT_VIEW_SETTINGS", { tableSlug }],
  //   () => {
  //     return constructorObjectService.getListV2(tableSlug, {
  //       data: { limit: 10, offset: 0 },
  //     });
  //   },
  //   {
  //     select: ({ data }) => {
  //       return {
  //         views: data?.views ?? [],
  //         columns: data?.fields ?? [],
  //         relationColumns:
  //           data?.relation_fields?.map((el) => ({
  //             ...el,
  //             label: `${el.label} (${el.table_label})`,
  //           })) ?? [],
  //       };
  //     },
  //   }
  // );

  // const type = view?.type;

  const computedColumns = useMemo(() => {
    if (view?.type !== "CALENDAR" && view?.type !== "GANTT") {
      return Object.values(fieldsMap);
    } else {
      return [...Object.values(fieldsMap), ...relationColumns];
    }
  }, [fieldsMap, relationColumns, view?.type]);

  useEffect(() => {
    form.reset({
      group_fields: view?.group_fields ?? [],
    });
  }, [selectedTabIndex, view, form]);

  const [updateLoading, setUpdateLoading] = useState(false);

  const updateView = () => {
    setUpdateLoading(true);
    constructorViewService
      .update({
        ...view,
        group_fields: form.watch("group_fields"),
      })
      .then(() => {
        queryClient.refetchQueries(["GET_VIEWS_AND_FIELDS"]);
      })
      .finally(() => {
        setUpdateLoading(false);
      });
  };

  const selectedColumns = useWatch({
    control: form.control,
    name: "group_fields",
  });

  const disableAll = () => {
    setUpdateLoading(true);
    constructorViewService
      .update({
        ...view,
        group_fields: [],
      })
      .then(() => {
        queryClient.refetchQueries(["GET_VIEWS_AND_FIELDS"]);
      })
      .finally(() => {
        setUpdateLoading(false);
        form.setValue("group_fields", []);
      });
  };

  return (
    <div>
      <Button
        variant={`${selectedColumns?.length > 0 ? "outlined" : "text"}`}
        style={{
          gap: "5px",
          color: selectedColumns?.length > 0 ? "rgb(0, 122, 255)" : "#A8A8A8",
          borderColor: selectedColumns?.length > 0 ? "rgb(0, 122, 255)" : "#A8A8A8",
        }}
        onClick={handleClick}
      >
        <LayersOutlinedIcon color={"#A8A8A8"} />
        {text}
        {selectedColumns?.length > 0 && <span>{selectedColumns?.length}</span>}
        {selectedColumns?.length > 0 && (
          <button
            style={{
              border: "none",
              background: "none",
              outline: "none",
              cursor: "pointer",
              padding: "0",
              margin: "0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: selectedColumns?.length > 0 ? "rgb(0, 122, 255)" : "#A8A8A8",
            }}
            onClick={(e) => {
              e.stopPropagation();
              disableAll();
            }}
          >
            <CloseRoundedIcon
              style={{
                color: selectedColumns?.length > 0 ? "rgb(0, 122, 255)" : "#A8A8A8",
              }}
            />
          </button>
        )}
      </Button>
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
        <GroupsTab columns={computedColumns} updateLoading={updateLoading} updateView={updateView} selectedView={view} form={form} />
      </Menu>
    </div>
  );
}
