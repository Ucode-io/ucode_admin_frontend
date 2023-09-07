import { Autocomplete, MenuItem, Select, TextField } from "@mui/material";
import React, { useState } from "react";

export default function SortMenuRow({ computedColumns, index, form, typeSorts }) {
  return (
    <>
      {/* <Autocomplete
        sx={{ width: 200 }}
        options={computedColumns ?? []}
        value={form.watch(`sort[${index}].field`) ?? null}
        onChange={(e, value) => form.setValue(`sort[${index}].field`, value)}
        getOptionLabel={(option) => {
          return option.label;
        }}
        onSelect={(e, val) => console.log("VAL==>>", e.target.value)}
        isOptionEqualToValue={(option, value) => option.value === value.value}
        renderInput={(params) => <TextField {...params} size="small" />}
      /> */}

      <Select sx={{ width: 200 }} value={form.watch(`sort[${index}].field`)} size="small" fullWidth onChange={(e) => form.setValue(`sort[${index}].field`, e.target.value)}>
        {computedColumns?.map((option) => (
          <MenuItem key={option.id} value={option.id}>
            {option.label}
          </MenuItem>
        ))}
      </Select>

      <Select sx={{ width: 200 }} value={form.watch(`sort[${index}].order`)} size="small" fullWidth onChange={(e) => form.setValue(`sort[${index}].order`, e.target.value)}>
        {typeSorts?.map((option) => (
          <MenuItem key={option.id} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>

      {/* <Autocomplete
        sx={{ width: 200 }}
        options={typeSorts}
        value={form.watch(`sort[${index}].order`) ?? null}
        onChange={(e, value) => form.setValue(`sort[${index}].order`, value)}
        getOptionLabel={(option) => option.label}
        onSelect={(e, val) => console.log("sssssssss", e.target.value)}
        isOptionEqualToValue={(option, value) => option.value === value.value}
        renderInput={(params) => <TextField {...params} size="small" />}
      /> */}
    </>
  );
}
