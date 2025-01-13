import React from "react";
import {useFieldArray} from "react-hook-form";
import HFTextField from "../../../../../components/FormElements/HFTextField";
import {Box, Button} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

function StatusFieldSettings({control}) {
  const toDoFieldArray = useFieldArray({
    control,
    name: "attributes.blocks[0].options",
  });

  const inProgressFieldArray = useFieldArray({
    control,
    name: "attributes.blocks[1].options",
  });

  const completeFieldArray = useFieldArray({
    control,
    name: "attributes.blocks[2].options",
  });

  const renderOptions = (fieldArray, blockName) => (
    <div>
      <Box
        sx={{
          padding: "8px",
          borderBottom: "1px solid #eee",
          display: "flex",
          alignItems: "center",
        }}>
        <Box sx={{fontSize: "14px"}}>{blockName}</Box>
        <button style={{width: "40px"}} variant="outlined">
          <AddIcon />
        </button>
      </Box>
      {fieldArray.fields.map((field, index) => (
        <div
          key={field.id}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            marginBottom: "0.5rem",
          }}>
          <HFTextField
            name={`blocks[${fieldArray.name === "blocks[0].options" ? 0 : fieldArray.name === "blocks[1].options" ? 1 : 2}].options[${index}].label`}
            control={control}
          />
          <button
            type="button"
            onClick={() => fieldArray.remove(index)}
            style={{
              background: "#ff5c5c",
              color: "white",
              border: "none",
              padding: "0.5rem",
              cursor: "pointer",
            }}>
            Delete
          </button>
        </div>
      ))}
      {/* <button
        type="button"
        onClick={() => fieldArray.append({label: "New Option"})}
        style={{
          padding: "0.5rem",
          background: "#5cb85c",
          color: "white",
          border: "none",
          cursor: "pointer",
        }}>
        Add Option
      </button> */}
    </div>
  );

  return (
    <Box>
      <Box>
        <Box>{renderOptions(toDoFieldArray, "To-do")}</Box>

        <Box>{renderOptions(inProgressFieldArray, "In Progress")}</Box>

        <Box> {renderOptions(completeFieldArray, "Complete")}</Box>
      </Box>
    </Box>
  );
}

export default StatusFieldSettings;
