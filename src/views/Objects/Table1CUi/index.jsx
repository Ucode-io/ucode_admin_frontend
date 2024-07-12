import {Box, Container} from "@mui/material";
import React, {useMemo, useState} from "react";
import TableUiHead from "./TableUiHead/TableUiHead";
import TableHeadTitle from "./TableUiHead/TableHeadTitle";
import TableFilterBlock from "./TableFilterBlock";
import TableComponent from "./TableComponent/TableComponent";
import constructorObjectService from "../../../services/constructorObjectService";
import {useQuery} from "react-query";
import {useParams} from "react-router-dom";
import newTableService from "../../../services/newTableService";
import useFilters from "../../../hooks/useFilters";

function Table1CUi({menuItem, view, fieldsMap}) {
  const {tableSlug} = useParams();
  const [openFilter, setOpenFilter] = useState(false);
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(1);
  const {filters} = useFilters(tableSlug, view.id);

  const {data: {fields} = {data: []}, isLoading} = useQuery(
    ["GET_OBJECT_FIELDS", {tableSlug}],
    () => {
      return constructorObjectService.getList(tableSlug, {
        data: {},
      });
    },
    {
      cacheTime: 10,
      select: (res) => {
        const fields = res.data?.fields ?? [];
        return {
          fields,
        };
      },
    }
  );

  const {data: {folders, count} = {data: []}, isLoading2} = useQuery(
    ["GET_FOLDER_LIST", {tableSlug, limit, offset, filters}],
    () => {
      return newTableService.getFolderList({
        table_id: menuItem?.table_id,
        ...filters,
        limit: limit,
        offset: offset,
      });
    },
    {
      enabled: Boolean(menuItem?.table_id),
      cacheTime: 10,
      select: (res) => {
        const folders = res?.folder_groups ?? [];
        const count = res?.count;
        return {
          folders,
          count,
        };
      },
    }
  );

  const columns = useMemo(() => {
    const result = [];
    for (const key in view.attributes.fixedColumns) {
      if (view.attributes.fixedColumns.hasOwnProperty(key)) {
        if (view.attributes.fixedColumns[key]) {
          result.push({id: key, value: view.attributes.fixedColumns[key]});
        }
      }
    }

    const uniqueIdsSet = new Set();
    const uniqueColumns = view?.columns?.filter((column) => {
      if (!uniqueIdsSet.has(column)) {
        uniqueIdsSet.add(column);
        return true;
      }
      return false;
    });

    return customSortArray(
      uniqueColumns,
      result.map((el) => el.id)
    )
      ?.map((el) => fieldsMap[el])
      ?.filter((el) => el);
  }, [view, fieldsMap]);

  function customSortArray(a, b) {
    const commonItems = a?.filter((item) => b.includes(item));
    commonItems?.sort();
    const remainingItems = a?.filter((item) => !b.includes(item));
    const sortedArray = commonItems?.concat(remainingItems);
    return sortedArray;
  }

  return (
    <Box>
      <TableUiHead menuItem={menuItem} />
      <TableHeadTitle />
      <TableFilterBlock
        fields={columns}
        openFilter={openFilter}
        setOpenFilter={setOpenFilter}
        view={view}
        fieldsMap={fieldsMap}
        menuItem={menuItem}
      />
      <TableComponent
        folders={folders}
        fields={columns}
        openFilter={openFilter}
        count={count}
        limit={limit}
        setLimit={setLimit}
        offset={offset}
        setOffset={setOffset}
      />
    </Box>
  );
}

export default Table1CUi;
