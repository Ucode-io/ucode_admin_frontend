import {Box} from "@mui/material";
import React, { useEffect, useState } from "react";
import "./style.scss";
import style from "./field.module.scss";
import {useTablesListQuery} from "../../services/tableService";
import {store} from "../../store";
import listToOptions from "../../utils/listToOptions";
import constructorFieldService from "../../services/constructorFieldService";
import {useQuery} from "react-query";
import HFMultipleSelect from "../FormElements/HFMultipleSelect";
import DropdownSelect from "../NewFormElements/DropdownSelect";
import { useSelector } from "react-redux";

export default function RelationFieldForm({
  control,
  setValue,
  fieldWatch,
  relatedTableSlug,
}) {
  const envId = store.getState().company.environmentId;
  const menuItem = useSelector((state) => state.menu.menuItem);

  const [page, setPage] = useState(1);
  const [allTables, setAllTables] = useState([]);
  const limit = 20;

  useEffect(() => {
    setValue("table_from", menuItem?.data.table?.slug);
  }, []);

  const { data, isFetching } = useTablesListQuery({
    params: {
      envId: envId,
      offset: (page - 1) * limit,
      limit,
    },
    // queryParams: {
    //   select: (res) => {
    //     return res?.tables?.map((el) => ({
    //       label: el?.label,
    //       value: `${el?.label}/${el?.slug}`,
    //       slug: el?.slug,
    //     }));
    //   },
    // },
  });

  const { data: relatedTableFields } = useQuery(
    ["GET_TABLE_FIELDS", relatedTableSlug],
    () => {
      if (!relatedTableSlug) return [];
      return constructorFieldService.getList(
        { table_slug: relatedTableSlug },
        relatedTableSlug,
      );
    },
    {
      select: ({ fields }) => {
        return listToOptions(
          fields?.filter((field) => field.type !== "LOOKUP"),
          "label",
          "id",
        );
      },
    },
  );

  useEffect(() => {
    if (data?.tables) {
      const mappedTables = data?.tables.map((el) => ({
        label: el?.label,
        value: `${el?.label}/${el?.slug}`,
        slug: el?.slug,
      }));

      if (page === 1) {
        setAllTables(mappedTables);
      } else {
        setAllTables((prev) => [...prev, ...mappedTables]);
      }
    }
  }, [data, page]);

  const hasMore = data?.count > allTables.length;

  const handleScroll = (event) => {
    const target = event.currentTarget;
    ``;
    if (target.scrollHeight - target.scrollTop <= target.clientHeight + 10) {
      if (hasMore && !isFetching) {
        setPage((prev) => prev + 1);
      }
    }
  };

  return (
    <Box className={style.relation}>
      {fieldWatch.relation_type !== "Recursive" && (
        <DropdownSelect
          disabledHelperText
          options={allTables}
          name="table_to"
          control={control}
          fullWidth
          required
          placeholder="Table to"
          className={style.input}
          handleScroll={handleScroll}
          isLoading={isFetching}
        />
      )}
      <HFMultipleSelect
        disabledHelperText
        options={relatedTableFields}
        name="view_fields"
        control={control}
        fullWidth
        isClearable
        required
        placeholder="View fields"
        className={style.input}
      />
    </Box>
  );
}
