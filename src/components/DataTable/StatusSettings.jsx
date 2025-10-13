import React from "react";
import { useFieldArray } from "react-hook-form";
import { Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import HFColorPicker from "@/components/FormElements/HFColorPicker";
import TextField from "../NewFormElements/TextField/TextField";
import FormElementButton from "../NewFormElements/FormElementButton";
import { DragIndicator, KeyboardArrowRight } from "@mui/icons-material";
import style from "./field.module.scss";
import { useTranslation } from "react-i18next";
import { generateGUID } from "@/utils/generateID";

function StatusSettings({
  control,
  watch,
  handleOpenEdit,
  toDoFieldArray,
  inProgressFieldArray,
  completeFieldArray,
  colorList,
}) {
  const { i18n } = useTranslation();

  const renderOptions = (fieldArray, name, blockName, isLast) => (
    <Box borderBottom={!isLast ? "1px solid #eee" : "none"}>
      <Box
        sx={{
          padding: "8px",
          // borderTop: "1px solid #eee",
          // borderBottom: "1px solid #eee",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ fontSize: "14px", color: "rgb(115, 114, 110)" }}>
          {blockName}
        </Box>
        <button
          type="button"
          onClick={() =>
            fieldArray.append({
              [`label_${i18n.language}`]: "",
              color: colorList[Math.floor(Math.random() * colorList.length)],
              value: generateGUID(),
            })
          }
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
          variant="outlined"
        >
          <AddIcon style={{ color: "#999", fontSize: "24px" }} />
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
            // padding: "8px",
          }}
        >
          {/* <HFColorPicker
            name={`attributes.${name}.options[${index}].color`}
            control={control}
          /> */}
          <Box
            className={style.fieldItemWrapper}
            onClick={(e) => handleOpenEdit({ ...field, name }, e, index)}
          >
            {/* <DragIndicator
              htmlColor="rgba(71, 70, 68, 0.6)"
              style={{ cursor: "grab" }}
            /> */}
            <span
              className={style.fieldItem}
              style={{
                backgroundColor:
                  watch(`attributes.${name}.options[${index}].color`) + 33,
                color: watch(`attributes.${name}.options[${index}].color`),
              }}
            >
              {watch(
                `attributes.${name}.options[${index}].label${i18n.language ? `_${i18n.language}` : ""}`
              )}
            </span>
            <KeyboardArrowRight
              htmlColor="rgba(71, 70, 68, 0.6)"
              width={16}
              height={16}
              style={{ marginLeft: "auto" }}
            />
          </Box>
          {/* 
          <TextField
            name={`attributes.${name}.options[${index}].label`}
            control={control}
            placeholder="Label"
            defaultValue={field.key}
          /> */}

          {/* <FormElementButton
            type="button"
            onClick={() => fieldArray.remove(index)}
          >
            <Box display="flex" alignItems="center">
              <DeleteIcon htmlColor="#212b36" />
            </Box>
          </FormElementButton> */}
        </div>
      ))}
    </Box>
  );

  return (
    <Box>
      <Box>
        <Box>{renderOptions(toDoFieldArray, "todo", "To-do")}</Box>
        <Box>
          {renderOptions(inProgressFieldArray, "progress", "In Progress")}
        </Box>
        <Box>
          {renderOptions(completeFieldArray, "complete", "Complete", true)}
        </Box>
      </Box>
    </Box>
  );
}

export default StatusSettings;
