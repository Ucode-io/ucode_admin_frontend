import {Box, Menu} from "@mui/material";
import React, {useMemo, useState} from "react";
import {useQueryClient} from "react-query";
import constructorViewService from "../../../services/constructorViewService";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import FiltersTab from "../components/ViewSettings/FiltersTab";
import {useDispatch, useSelector} from "react-redux";
import {quickFiltersActions} from "../../../store/filter/quick_filter";
import styles from "./styles.module.scss";
import {useParams} from "react-router-dom";
import PermissionWrapperV2 from "../../../components/PermissionWrapper/PermissionWrapperV2";

const customStyles = {
  gap: "5px",
  color: "#A8A8A8",
  borderColor: "#A8A8A8",
  width: "100%",
  height: "50px",
  display: "flex",
  alignItems: "center",
  justifyItems: "center",
  cursor: "pointer",
};

export default function FilterVisible({
  onChange,
  selectedTabIndex,
  columns,
  views,
  relationColumns,
  form,
  setFilterVisible,
}) {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const {tableSlug} = useParams();
  const [filterAnchor, setFilterAnchor] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const permissions = useSelector((state) => state.permissions?.[tableSlug]);
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
      .update(tableSlug, {
        ...views,
        attributes: {
          ...views?.attributes,
          quick_filters: result,
        },
      })
      .then(() => {
        queryClient.refetchQueries(["GET_VIEWS_AND_FIELDS", tableSlug]);
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
      <PermissionWrapperV2 tableSlug={tableSlug} type="add_filter">
        <Box
          id="add_filter_btn"
          variant={"text"}
          className={styles.add_filter}
          sx={customStyles}
          onClick={handleClickFilter}>
          <FilterAltOutlinedIcon color={"#A8A8A8"} />
          Add Filters
        </Box>
      </PermissionWrapperV2>
      <Menu open={open} onClose={handleCloseFilter} anchorEl={filterAnchor}>
        <FiltersTab
          form={form}
          onChange={onChange}
          updateView={updateView}
          isMenu={true}
          handleCloseFilter={handleCloseFilter}
          views={views}
          selectedTabIndex={selectedTabIndex}
          computedColumns={computedColumns}
          columns={columns}
          isLoading={updateLoading}
          setFilterVisible={setFilterVisible}
        />
      </Menu>
    </div>
  );
}
