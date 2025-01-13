import React from "react";
import {useFieldArray} from "react-hook-form";
import HFTextField from "../../../../../components/FormElements/HFTextField";
import {Box, Button} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import styles from "./style.module.scss";
import DeleteIcon from "@mui/icons-material/Delete";

function StatusFieldSettings({control}) {
  const toDoFieldArray = useFieldArray({
    control,
    name: "attributes.todo.options",
  });

  const inProgressFieldArray = useFieldArray({
    control,
    name: "attributes.progress.options",
  });

  const completeFieldArray = useFieldArray({
    control,
    name: "attributes.complete.options",
  });

  const renderOptions = (fieldArray, name, blockName) => (
    <div>
      <Box
        sx={{
          padding: "8px",
          borderTop: "1px solid #eee",
          borderBottom: "1px solid #eee",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
        <Box sx={{fontSize: "12px"}}>{blockName}</Box>
        <button
          type="button"
          onClick={() => fieldArray.append({})}
          className={styles.addOptionBtn}
          variant="outlined">
          <AddIcon style={{color: "#999", fontSize: "24px"}} />
        </button>
      </Box>

      {fieldArray.fields.map((field, index) => (
        <div
          key={field?.id}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            marginBottom: "0.5rem",
            padding: "8px",
          }}>
          <HFTextField
            name={`attributes.${name}.options[${index}].label`}
            control={control}
            placeholder="Label"
            defaultValue={field.key}
          />

          <Button
            variant="outlined"
            color="error"
            type="button"
            onClick={() => fieldArray.remove(index)}>
            <DeleteIcon />
          </Button>
        </div>
      ))}
    </div>
  );

  return (
    <Box sx={{border: "1px solid #eee", borderRadius: "4px"}}>
      <Box>
        <Box>{renderOptions(toDoFieldArray, "todo", "To-do")}</Box>
        <Box>
          {renderOptions(inProgressFieldArray, "progress", "In Progress")}
        </Box>
        <Box>{renderOptions(completeFieldArray, "complete", "Complete")}</Box>
      </Box>
    </Box>
  );
}

export default StatusFieldSettings;
