import {Box, Container} from "@mui/material";
import React, {useMemo, useState} from "react";
import TableUiHead from "./TableUiHead/TableUiHead";
import TableHeadTitle from "./TableUiHead/TableHeadTitle";
import TableFilterBlock from "./TableFilterBlock";
import TableComponent from "./TableComponent/TableComponent";
import constructorObjectService from "../../../services/constructorObjectService";
import {useQuery} from "react-query";
import {useParams} from "react-router-dom";
import constructorViewService from "../../../services/constructorViewService";
import {viewsReducer} from "../../../store/views/view.slice";

function Table1CUi({menuItem, view, fieldsMap}) {
  const {tableSlug} = useParams();
  const [openFilter, setOpenFilter] = useState(false);

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
      />
      <TableComponent fields={columns} openFilter={openFilter} />
    </Box>
  );
}

export default Table1CUi;
