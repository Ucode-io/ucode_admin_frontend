import {Box} from "@mui/material";
import React, {useEffect, useMemo} from "react";
import HFSelect from "../FormElements/HFSelect";
import "./style.scss";
import style from "./field.module.scss";
import {useTablesListQuery} from "../../services/tableService";
import {store} from "../../store";
import listToOptions from "../../utils/listToOptions";
import constructorFieldService from "../../services/constructorFieldService";
import {useQuery} from "react-query";
import HFMultipleSelect from "../FormElements/HFMultipleSelect";
import {useParams} from "react-router-dom";
import {useSelector} from "react-redux";
import {generateLangaugeText} from "../../utils/generateLanguageText";
import {useGetLang} from "../../hooks/useGetLang";
import {useTranslation} from "react-i18next";
import {relationTyes} from "../../utils/constants/relationTypes";
import DropdownSelect from "../NewFormElements/DropdownSelect";

export default function RelationFieldForm({
  control,
  watch,
  setValue,
  fieldWatch,
  relatedTableSlug,
}) {
  const {tableSlug} = useParams();
  const envId = store.getState().company.environmentId;
  const menuItem = useSelector((state) => state.menu.menuItem);

  useEffect(() => {
    setValue("table_from", menuItem?.data.table?.slug);
  }, []);

  const {data: tables} = useTablesListQuery({
    params: {envId: envId},
    queryParams: {
      select: (res) => {
        return res?.tables?.map((el) => ({
          label: el?.label,
          value: `${el?.label}/${el?.slug}`,
          slug: el?.slug,
        }));
      },
    },
  });

  const {data: relatedTableFields} = useQuery(
    ["GET_TABLE_FIELDS", relatedTableSlug],
    () => {
      if (!relatedTableSlug) return [];
      return constructorFieldService.getList(
        {table_slug: relatedTableSlug},
        relatedTableSlug
      );
    },
    {
      select: ({fields}) => {
        return listToOptions(
          fields?.filter((field) => field.type !== "LOOKUP"),
          "label",
          "id"
        );
      },
    }
  );

  const lang = useGetLang("Table");
  const {i18n} = useTranslation();

  return (
    <Box className={style.relation}>
      {/* <HFSelect
        className={style.input}
        disabledHelperText
        defaultValue="Many2One"
        disabled={true}
        options={[{label: "Single", value: "Many2One"}]}
        name="relation_type"
        control={control}
        isClearable={false}
        fullWidth
        required
        placeholder="Relation type"
        onChange={(val) => {
          if (val === "Many2Many") {
            setValue("view_type", "INPUT");
          } else if (val === "Recursive") {
            setValue("table_to", tableSlug);
          } else {
            setValue("view_type", undefined);
          }
        }}
      /> */}
      {/* {fieldWatch.relation_type !== "Recursive" && ( */}
      <>
        {/* <HFSelect
          disabledHelperText
          options={tables}
          name="table_to"
          control={control}
          fullWidth
          required
          placeholder="Table to"
          className={style.input}
          disabled={fieldWatch.relation_type === "Recursive"}
        />
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
        <HFSelect
          disabledHelperText
          options={relationTyes
            .slice(0, 3)
            .map((option) => ({ label: option, value: option }))}
          name="relation_type"
          control={control}
          required
          fullWidth
          onChange={(value) =>
            value === "Recursive"
              ? setValue(
                  "table_to",
                  tables?.find((table) => table.slug === tableSlug)?.value
                )
              : null
          }
          placeholder={
            generateLangaugeText(lang, i18n?.language, "Relation type") ||
            "Relation type"
          }
          className={style.input}
        /> */}
        {fieldWatch.relation_type !== "Recursive" && (
          <DropdownSelect
            disabledHelperText
            options={tables}
            name="table_to"
            control={control}
            fullWidth
            required
            placeholder="Table to"
            className={style.input}
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
      </>
      {/* )} */}
    </Box>
  );
}
