import React, { useState } from "react";
import NewCellElementGenerator from "./NewCellElementGenerator";
import { Box, Button } from "@mui/material";
import { useWatch } from "react-hook-form";
import constructorObjectService from "../../services/constructorObjectService";
import { useQueryClient } from "react-query";
import { useDispatch } from "react-redux";
import { showAlert } from "../../store/alert/alert.thunk";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";

export default function TableDataForm({ tableSlug, watch, fields, mainForm, onRowClick, field, row, index, control, setFormValue, relationfields, data }) {
  const [focused, setFocused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const selectedObject = useWatch({
    control,
  })?.multi?.[index];

  const updateObject = () => {
    constructorObjectService
      .update(tableSlug, { data: { ...selectedObject } })
      .then(() => {
        queryClient.invalidateQueries(["GET_OBJECTS_LIST", tableSlug]);
        dispatch(showAlert("Успешно обновлено", "success"));
      })
      .catch((e) => console.log("ERROR: ", e));
  };

  return (
    <Box style={{ border: focused ? "1px solid #007AFF" : "1px solid transparent", position: 'relative', minWidth: '150px'}} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <NewCellElementGenerator
        tableSlug={tableSlug}
        onFocus={() => {
          setFocused(true);
        }}
        onBlur={() => {
          updateObject();
          setFocused(false);
        }}
        name={`multi.${index}.${field.slug}`}
        watch={watch}
        fields={fields}
        field={field}
        row={row}
        index={index}
        control={control}
        setFormValue={setFormValue}
        relationfields={relationfields}
        data={data}
      />
      {/* {hovered && (
        <Button
          onClick={() => {
            onRowClick(row, index);
          }}
          style={{
            minWidth: "max-content",
            position: "absolute",
            right: "0",
            top: "0",
            height: "100%",
            borderRadius: "0",
            backgroundColor: "#f5fbff",
          }}
        >
          <OpenInFullIcon />
        </Button>
      )} */}
    </Box>
  );
}
