import { Box } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import HFSelect from "../FormElements/HFSelect";
import style from "./field.module.scss";
import "./style.scss";
import { useTablesListQuery } from "../../services/tableService";
import { store } from "../../store";
import listToOptions from "../../utils/listToOptions";
import constructorFieldService from "../../services/constructorFieldService";
import { useQuery } from "react-query";
import HFMultipleSelect from "../FormElements/HFMultipleSelect";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

export default function RelationFieldForm({
  control,
  watch,
  setValue,
  fieldWatch,
}) {
  const { tableSlug } = useParams();
  const envId = store.getState().company.environmentId;
  const menuItem = useSelector((state) => state.menu.menuItem);

  console.log("menuItem", menuItem);

  useEffect(() => {
    setValue("table_from", menuItem?.data.table?.slug);
  }, []);

  const relatedTableSlug = useMemo(() => {
    if (fieldWatch.table_to === tableSlug) return fieldWatch.table_from;
    else if (fieldWatch.table_from === tableSlug) return fieldWatch.table_to;
    return null;
  }, [fieldWatch, tableSlug]);

  console.log("relatedTableSlug", relatedTableSlug);
  const { data: tables } = useTablesListQuery({
    params: { envId: envId },
    queryParams: {
      select: (res) => {
        return listToOptions(res.tables, "label", "slug");
      },
    },
  });

  const { data: relatedTableFields } = useQuery(
    ["GET_TABLE_FIELDS", relatedTableSlug],
    () => {
      if (!relatedTableSlug) return [];
      return constructorFieldService.getList(
        { table_slug: relatedTableSlug },
        relatedTableSlug
      );
    },
    {
      select: ({ fields }) => {
        return listToOptions(
          fields?.filter((field) => field.type !== "LOOKUP"),
          "label",
          "id"
        );
      },
    }
  );

  console.log("fieldWatchfieldWatch", fieldWatch);

  return (
    <Box className={style.relation}>
      <HFSelect
        disabledHelperText
        options={tables}
        name="table_to"
        control={control}
        fullWidth
        required
        placeholder="Table to"
      />
      <HFSelect
        disabledHelperText
        options={[
          { label: "Single", value: "Many2One" },
          { label: "Multi", value: "Many2Many" },
        ]}
        name="relation_type"
        control={control}
        fullWidth
        required
        placeholder="Relation type"
        onChange={(val) => {
          if (val === "Many2Many") {
            setValue("view_type", "INPUT");
          } else {
            setValue("view_type", undefined);
          }
        }}
      />
      <HFMultipleSelect
        disabledHelperText
        options={relatedTableFields}
        name="view_fields"
        control={control}
        fullWidth
        required
        placeholder="View fields"
      />
    </Box>
  );
}
