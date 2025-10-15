import { Box } from "@mui/material";
import React, { useMemo } from "react";
import { useMutation } from "react-query";
import CellElementGeneratorForTableView from "./CellElementGeneratorForTableView";
import CellElementGeneratorForRelation from "./CellElementGeneratorForRelation";

export default function NewTableDataForm({
  tableView,
  tableSlug,
  fields,
  field,
  row,
  index,
  control,
  setFormValue,
  relationfields,
  data,
  isWrap,
  watch,
  newUi = false,
  isTableView = false,
  relationView,
  fieldsMap,
}) {
  const { mutate: updateObject } = useMutation(() => console.log(""));

  const isWrapField = useMemo(() => {
    if (!isWrap || !field || !field.id) {
      return null;
    }

    return Object.keys(isWrap)
      .map((key) => {
        return {
          id: key,
          status: isWrap?.[key],
        };
      })
      .find((x) => x?.id === field?.id)?.status;
  }, [isWrap, field?.id]);

  return (
    <Box
      style={{
        position: "relative",
        minWidth: "150px",
      }}
    >
      {field?.type === "LOOKUP" || field?.type === "LOOKUPS" ? (
        <CellElementGeneratorForRelation
          key={field?.id}
          isTableView={isTableView}
          isNewRow={true}
          tableView={tableView}
          tableSlug={tableSlug}
          name={`multi.${index}.${field.slug}`}
          isWrapField={isWrapField}
          updateObject={updateObject}
          fields={fields}
          field={field}
          row={row}
          newColumn={true}
          index={index}
          control={control}
          setFormValue={setFormValue}
          relationfields={relationfields}
          data={data}
          newUi={newUi}
          relationView={relationView}
          fieldsMap={fieldsMap}
        />
      ) : (
        <CellElementGeneratorForTableView
          tableView={tableView}
          newColumn={true}
          tableSlug={tableSlug}
          isNewRow={true}
          watch={watch}
          isWrapField={isWrapField}
          updateObject={updateObject}
          fields={fields}
          field={field}
          row={row}
          index={index}
          control={control}
          setFormValue={setFormValue}
          relationfields={relationfields}
          data={data}
          newUi={newUi}
        />
      )}
    </Box>
  );
}
