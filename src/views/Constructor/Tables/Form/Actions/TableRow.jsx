import { Delete } from "@mui/icons-material";
import { Autocomplete, CircularProgress, TextField } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { Controller, useFieldArray, useWatch } from "react-hook-form";
import RectangleIconButton from "../../../../../components/Buttons/RectangleIconButton";
import HFSelect from "../../../../../components/FormElements/HFSelect";
import HFTextField from "../../../../../components/FormElements/HFTextField";
import useDebounce from "../../../../../hooks/useDebounce";
import constructorObjectService from "../../../../../services/constructorObjectService";
import constructorRelationService from "../../../../../services/constructorRelationService";
import styles from "./style.module.scss";

function TableRow({
  summary,
  control,
  typeList,
  index,
  remove,
  update,
  slug,
  relation,
  setValue,
}) {
  const [relations, setRelations] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [data, setData] = useState([]);
  const [debouncedValue, setDebouncedValue] = useState("");
  const selectedTableOptions = useWatch({
    control: control,
    name: `attributes.additional_parameters.${index}.table_slug`,
  });
  const selectedValueOptions = useWatch({
    control: control,
    name: `attributes.additional_parameters.${index}.value`,
  });

  const getList = useMemo(() => {
    const relationsWithRelatedTableSlug = relations?.map((relation) => ({
      ...relation,
      relatedTableSlug:
        relation.table_to?.slug === slug ? "table_from" : "table_to",
    }));

    return relationsWithRelatedTableSlug
      ?.filter((relation) => {
        return !(
          (relation.type === "Many2One" &&
            relation.table_from?.slug === slug) ||
          (relation.type === "One2Many" && relation.table_to?.slug === slug) ||
          relation.type === "Recursive" ||
          (relation.type === "Many2Many" && relation.view_type === "INPUT") ||
          (relation.type === "Many2Dynamic" &&
            relation.table_from?.slug === slug)
        );
      })
      .map((relation) => ({
        label: relation.table_from.label,
        value: relation.table_from.slug,
        view:
          relation?.table_from.subtitle_field_slug ||
          relation?.table_to?.subtitle_field_slug,
      }));
  }, [relations, slug]);

  const getFilterData = useMemo(() => {
    return getList?.find((item) => {
      if (item?.value === selectedTableOptions) {
        return item;
      }
    });
  }, [getList, selectedTableOptions]);

  const valueList = useMemo(() => {
    return data?.map((item) => ({
      label: item?.[getFilterData?.view],
      value: item?.guid,
    }));
  }, [data, getFilterData]);

  // const computedValue = useMemo(() => {
  //   const val = [];
  //   valueList?.map((item) => {
  //     if (selectedValueOptions[item?.value]) {
  //       val.push(item);
  //     }
  //   });
  //   return val;
  // }, [selectedValueOptions, valueList]);

  // FUNCTIONS

  const onUpdate = () => {
    update([...relation]);
  };

  // Delete function
  const deleteSummary = (index) => {
    remove(index);
  };

  const inputChangeHandler = useDebounce((val) => setDebouncedValue(val), 300);

  useEffect(() => {
    if (selectedTableOptions) {
      selectedTableOptions &&
        constructorObjectService
          ?.getList(selectedTableOptions, {
            data: {
              limit: 10,
              offset: 0,
              view_fields: [getFilterData?.view],
              search: debouncedValue,
            },
          })
          .then((res) => {
            setData(res?.data?.response);
          });
    }
  }, [selectedTableOptions, debouncedValue, getFilterData]);

  useEffect(() => {
    constructorRelationService
      .getList({
        table_slug: slug,
        relation_table_slug: slug,
      })
      .then((res) => {
        setRelations(res.relations);
      })
      .catch((a) => console.log("error", a));
  }, []);

  return (
    <div key={summary.key} className={styles.tableActions}>
      <div className={styles.tableType}>
        <h4>Type:</h4>
        <div className={styles.tableType_select}>
          <HFSelect
            fullWidth
            control={control}
            options={typeList}
            name={`attributes.additional_parameters.${index}.type`}
            onChange={onUpdate}
          />
        </div>
      </div>
      {summary?.type !== "TABLE" && summary?.type !== "HARDCODE" && (
        <div className={styles.tableType}>
          <h4>Table:</h4>
          <div className={styles.tableType_select}>
            <HFSelect
              fullWidth
              control={control}
              options={getList}
              name={`attributes.additional_parameters.${index}.table_slug`}
            />
          </div>
        </div>
      )}
      <div className={styles.tableType}>
        <h4>Name:</h4>
        <div className={styles.tableType_select}>
          <HFTextField
            fullWidth
            control={control}
            options={typeList}
            name={`attributes.additional_parameters.${index}.name`}
          />
        </div>
      </div>
      <div className={styles.tableType}>
        <h4>Value:</h4>
        <div className={styles.tableType_select}>
          {summary?.type === "OBJECTID" ? (
            <Autocomplete
              id="attributes"
              multiple
              options={valueList ?? []}
              value={
                Array.isArray(selectedValueOptions) ? selectedValueOptions : []
              }
              freeSolo
              onChange={(e, values) => {
                setValue(
                  `attributes.additional_parameters.${index}.value`,
                  values
                );
              }}
              getOptionLabel={(option) => option.label}
              inputValue={inputValue}
              disablePortal
              blurOnSelect
              openOnFocus
              onInputChange={(_, val) => {
                setInputValue(val);
                inputChangeHandler(val);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  size="small"
                  InputProps={{
                    ...params.InputProps,
                  }}
                />
              )}
            ></Autocomplete>
          ) : summary?.type === "TABLE" ? (
            <HFSelect
              fullWidth
              control={control}
              options={getList}
              name={`attributes.additional_parameters.${index}.value`}
            />
          ) : (
            <HFTextField
              fullWidth
              control={control}
              options={typeList}
              name={`attributes.additional_parameters.${index}.value`}
            />
          )}
        </div>
      </div>

      <div className={styles.deleteBtn}>
        <RectangleIconButton color="error" onClick={() => deleteSummary(index)}>
          <Delete color="error" />
        </RectangleIconButton>
      </div>
    </div>
  );
}

export default TableRow;
