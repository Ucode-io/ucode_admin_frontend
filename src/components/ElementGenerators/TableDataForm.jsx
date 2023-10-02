import { Box } from "@mui/material";
import React, { useEffect } from "react";
import { useWatch } from "react-hook-form";
import { useMutation } from "react-query";
import constructorObjectService from "../../services/constructorObjectService";
import NewCellElementGenerator from "./NewCellElementGenerator";

export default function TableDataForm({ tableSlug, fields, field, row, index, control, setFormValue, relationfields, data }) {
  const selectedObject = useWatch({
    control,
  })?.multi?.[index];

  const { mutate: updateObject } = useMutation(() =>
    constructorObjectService.update(tableSlug, {
      data: { ...selectedObject },
    })
  );
  

  return (
    <Box
      style={{
        position: "relative",
        minWidth: "150px",
      }}
    >
      <NewCellElementGenerator
        tableSlug={tableSlug}
        name={`multi.${index}.${field.slug}`}
        updateObject={updateObject}
        fields={fields}
        field={field}
        row={row}
        index={index}
        control={control}
        setFormValue={setFormValue}
        relationfields={relationfields}
        data={data}
      />
    </Box>
  );
}
