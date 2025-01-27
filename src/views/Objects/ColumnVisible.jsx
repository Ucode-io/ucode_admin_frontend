import {Button, CircularProgress, Menu} from "@mui/material";
import React, {useEffect, useMemo, useState} from "react";
import constructorViewService from "../../services/constructorViewService";
import ColumnsTab from "./components/ViewSettings/ColumnsTab";
import {useQueryClient} from "react-query";
import {useParams} from "react-router-dom";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import AppsIcon from "@mui/icons-material/Apps";

export default function ColumnVisible({
  selectedTabIndex,
  views,
  columns,
  relationColumns,
  isLoading,
  form,
  text = "Columns",
  currentView,
  refetch = () => {},
  fieldsMap,
}) {
  const queryClient = useQueryClient();
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setloading] = useState(false);
  const {tableSlug} = useParams();
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const type = views?.[selectedTabIndex]?.type;
  const computedColumns = useMemo(() => {
    return columns;
  }, [columns, relationColumns, type]);

  const visibleFields = useMemo(() => {
    return (
      currentView?.columns
        ?.map((id) => fieldsMap[id])
        .filter((el) => {
          if (el?.type === "LOOKUP" || el?.type === "LOOKUPS") {
            return el?.relation_id;
          } else {
            return el?.id;
          }
        }) ?? []
    );
  }, [currentView?.columns, fieldsMap]);

  const unVisibleFields = useMemo(() => {
    return columns.filter((field) => {
      if (field?.type === "LOOKUP" || field?.type === "LOOKUPS") {
        return !currentView?.columns?.includes(field.relation_id);
      } else {
        return !currentView?.columns?.includes(field.id);
      }
    });
  }, [columns, currentView?.columns]);

  useEffect(() => {
    form.reset({
      columns:
        computedColumns?.map((el) => ({
          ...el,
          is_checked: views?.[selectedTabIndex]?.columns?.find(
            (column) => column === el.id
          ),
        })) ?? [],
    });
  }, [selectedTabIndex, views, form, computedColumns]);

  const updateView = (data) => {
    setloading(true);
    constructorViewService
      .update(tableSlug, {
        ...currentView,
        columns: data,
      })
      .then(() => {
        refetch();
        queryClient.refetchQueries(["GET_VIEWS_AND_FIELDS"]);
      })
      .finally(() => setloading(false));
  };

  const disableAll = () => {
    constructorViewService
      .update(tableSlug, {
        ...currentView,
        attributes: {
          tabs: [],
          ...currentView?.attributes,
        },
        group_fields: [],
        columns: [],
      })
      .then(() => {
        queryClient.refetchQueries(["GET_VIEWS_AND_FIELDS"]);
        queryClient.refetchQueries(["GET_OBJECT_LIST_ALL"]);
      })
      .finally(() => {
        form.setValue("columns", []);
      });
  };

  return (
    <div>
      <Button
        variant={`${currentView?.columns?.length > 0 ? "outlined" : "text"}`}
        style={{
          gap: "5px",
          color:
            currentView?.columns?.length > 0 ? "rgb(0, 122, 255)" : "#A8A8A8",
          borderColor:
            currentView?.columns?.length > 0 ? "rgb(0, 122, 255)" : "#A8A8A8",
          marginRight: "10px",
        }}
        onClick={handleClick}>
        <AppsIcon color={"#A8A8A8"} />
        {text}
        {currentView?.columns?.length > 0 && (
          <span>{currentView?.columns?.length}</span>
        )}
        {currentView?.columns?.length > 0 && (
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
              color:
                currentView?.columns?.length > 0
                  ? "rgb(0, 122, 255)"
                  : "#A8A8A8",
            }}
            onClick={(e) => {
              e.stopPropagation();
              disableAll();
            }}>
            <CloseRoundedIcon
              style={{
                color:
                  currentView?.columns?.length > 0
                    ? "rgb(0, 122, 255)"
                    : "#A8A8A8",
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
        }}>
        {isLoading ? (
          <CircularProgress />
        ) : (
          <ColumnsTab
            form={form}
            loading={loading}
            currentView={currentView}
            updateView={updateView}
            isMenu={true}
            views={views}
            selectedTabIndex={selectedTabIndex}
            computedColumns={computedColumns}
            columns={columns}
            visibleFields={visibleFields}
            unVisibleFields={unVisibleFields}
          />
        )}
      </Menu>
    </div>
  );
}
