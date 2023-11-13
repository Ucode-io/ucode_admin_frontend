import AppsIcon from "@mui/icons-material/Apps";
import {Button, CircularProgress, Menu} from "@mui/material";
import React, {useEffect, useMemo, useState} from "react";
import {useQuery, useQueryClient} from "react-query";
import constructorViewService from "../../../services/constructorViewService";
import ColumnsTab from "../components/ViewSettings/ColumnsTab";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import constructorObjectService from "../../../services/constructorObjectService";
import {useParams} from "react-router-dom";
import useFilters from "../../../hooks/useFilters";
import FiltersTab from "../components/ViewSettings/FiltersTab";

export default function FilterVisible({
  selectedTabIndex,
  columns,
  views,
  relationColumns,
  isLoading,
  form,
  text = "",
  width = "",
}) {
  const queryClient = useQueryClient();
  const {tableSlug} = useParams();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const type = views?.[selectedTabIndex]?.type;

  //   const {filters, clearFilters, clearOrders} = useFilters(tableSlug, view.id);

  const computedColumns = useMemo(() => {
    return columns;
  }, [columns, relationColumns, type]);

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

  const updateView = () => {
    constructorViewService
      .update({
        ...views?.[selectedTabIndex],
        quick_filters: form.getValues("quick_filters").map((item) => ({
          default_value: "",
          field_id: item?.id,
        })),
      })
      .then(() => {
        queryClient.refetchQueries(["GET_VIEWS_AND_FIELDS"]);
      });
  };
  console.log('form.getValues("quick_filters")', form.getValues());
  return (
    <div>
      <Button
        variant={"text"}
        sx={{
          gap: "5px",
          color: "#A8A8A8",
          borderColor: "#A8A8A8",
          width: "50px",
          height: "50px",
          borderRadius: "0px",
        }}
        onClick={handleClick}
      >
        <FilterAltOutlinedIcon color={"#A8A8A8"} />
        {text}
      </Button>
      <Menu open={open} onClose={handleClose} anchorEl={anchorEl}>
        {isLoading ? (
          <CircularProgress />
        ) : (
          <FiltersTab
            form={form}
            updateView={updateView}
            isMenu={true}
            views={views}
            selectedTabIndex={selectedTabIndex}
            computedColumns={computedColumns}
            columns={columns}
          />
        )}
      </Menu>
    </div>
  );
}
