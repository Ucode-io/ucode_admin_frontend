import {Box, Button, CircularProgress, Menu, Skeleton} from "@mui/material";
import React, {useEffect, useMemo, useState} from "react";
import {useQuery, useQueryClient} from "react-query";
import constructorViewService from "../../../services/constructorViewService";

import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";

import FiltersTab from "../components/ViewSettings/FiltersTab";
import {useDispatch} from "react-redux";
import {quickFiltersActions} from "../../../store/filter/quick_filter";

export default function FilterVisible({
  selectedTabIndex,
  columns,
  views,
  relationColumns,
  isLoading,
  form,
  text = "",
}) {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  const [filterAnchor, setFilterAnchor] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);

  const handleClickFilter = (event) => {
    setFilterAnchor(event.currentTarget);
  };
  const handleCloseFilter = () => {
    setFilterAnchor(null);
  };
  const open = Boolean(filterAnchor);

  const type = views?.type;

  const computedColumns = useMemo(() => {
    return columns;
  }, [columns, relationColumns, type]);

  const updateView = (data) => {
    setUpdateLoading(true);
    const result = data?.map((item) => ({
      ...item,
      is_checked: true,
    }));
    constructorViewService
      .update({
        ...views,
        attributes: {
          ...views?.attributes,
          quick_filters: result,
        },
      })
      .then(() => {
        queryClient.refetchQueries(["GET_VIEWS_AND_FIELDS"]);
        setTimeout(() => {
          setUpdateLoading(false);
        }, 400);
      })
      .finally(() => {
        dispatch(quickFiltersActions.setQuickFiltersCount(data?.length));
      });
  };

  return (
    <div>
      <Box
        variant={"text"}
        sx={{
          gap: "5px",
          color: "#A8A8A8",
          borderColor: "#A8A8A8",
          width: "100%",
          height: "50px",
          display: "flex",
          alignItems: "center",
          justifyItems: "center",
          cursor: "pointer",
        }}
        onClick={handleClickFilter}
      >
        <FilterAltOutlinedIcon color={"#A8A8A8"} />
        Add Filters
      </Box>
      <Menu open={open} onClose={handleCloseFilter} anchorEl={filterAnchor}>
        <FiltersTab
          form={form}
          updateView={updateView}
          isMenu={true}
          views={views}
          selectedTabIndex={selectedTabIndex}
          computedColumns={computedColumns}
          columns={columns}
          isLoading={updateLoading}
        />
      </Menu>
    </div>
  );
}
