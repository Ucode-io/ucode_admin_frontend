import { Box } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { useWatch } from "react-hook-form";
import { useMutation } from "react-query";
import constructorObjectService from "../../services/constructorObjectService";
import NewCellElementGenerator from "./NewCellElementGenerator";

export default function TableDataForm({ tableSlug, watch, fields, mainForm, onRowClick, field, row, index, control, isWrap = {}, setFormValue, relationfields, data, getValues }) {
  const { mutate: updateObject } = useMutation(() =>
    constructorObjectService.update(tableSlug, {
      data: { ...getValues(`multi.${index}`) },
    })
  );

  const isWrapField = useMemo(() => {
    return Object.keys(isWrap)
      .map((key) => {
        return {
          id: key,
          status: isWrap[key],
        };
      })
      .find((x) => x.id === field.id)?.status;
  }, [isWrap, field.id]);

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
      />
    </Box>
  );
}
