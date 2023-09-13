import ClearIcon from "@mui/icons-material/Clear";
import SortIcon from "@mui/icons-material/Sort";
import { Autocomplete, Button, Menu, TextField } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import constructorObjectService from "../../services/constructorObjectService";
import style from "./style.module.scss";
import SortMenuRow from "./SortMenuRow";

export default function SortButton({ selectedTabIndex, sortedDatas, setSortedDatas }) {
  const form = useForm({
    defaultValues: {
      sort: [],
    },
  });
  const [anchorEl, setAnchorEl] = useState(null);
  const { tableSlug } = useParams();
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const typeSorts = [
    {
      label: "A -> Z",
      value: "ASC",
    },
    {
      label: "Z -> A",
      value: "DESC",
    },
  ];

  const {
    data: { views, columns, relationColumns } = {
      views: [],
      columns: [],
      relationColumns: [],
    },
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

  const type = views?.[selectedTabIndex]?.type;

  const computedColumns = useMemo(() => {
    if (type !== "CALENDAR" && type !== "GANTT") {
      return columns;
    } else {
      return [...columns, ...relationColumns];
    }
  }, [columns, relationColumns, type]);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "sort",
  });

  const watchedSorts = useWatch({
    control: form.control,
    name: "sort",
  });

  useEffect(() => {
    setSortedDatas(watchedSorts);
  }, [watchedSorts, form, setSortedDatas]);

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
        <SortIcon color={"#A8A8A8"} />
        Sort
      </div>

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
        <div
          style={{
            padding: "10px",
          }}
        >
          <div
            className={style.menuItems}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            {fields.map((field, index) => (
              <div
                key={field.id}
                className={style.menuItem}
                style={{
                  display: "flex",
                  gap: "10px",
                }}
              >
                <SortMenuRow computedColumns={computedColumns} index={index} form={form} typeSorts={typeSorts} />

                <Button onClick={() => remove(index)}>
                  <ClearIcon />
                </Button>
              </div>
            ))}

            <Button
              onClick={() => {
                append({
                  field: "",
                  order: "ASC",
                });
              }}
            >
              + Add sort field
            </Button>
          </div>
        </div>
      </Menu>
    </div>
  );
}
