import React from "react";
import { Box } from "@mui/material";
import { useFieldArray } from "react-hook-form";
import styles from "./styles.module.scss";
import HFTextField from "@/components/FormElements/HFTextField";
import { Delete } from "@mui/icons-material";

export const NavigateGenerator = ({ form, name }) => {
  const {
    fields: values,
    append,
    remove,
  } = useFieldArray({
    control: form.control,
    name,
  });

  const addField = () => {
    append({
      key: "",
      value: "",
    });
  };

  return (
    <Box mt={3}>
      <div>
        <p style={{ marginBottom: "6px" }}>Object URL</p>
        {values?.map((elements, index) => (
          <div key={elements?.key} className={styles.navigateWrap}>
            <HFTextField
              fullWidth
              control={form.control}
              name={`${name}[${index}].key`}
              placeholder={"key"}
            />
            <HFTextField
              fullWidth
              control={form.control}
              name={`${name}[${index}].value`}
              placeholder={"value"}
            />
            <button
              type="button"
              onClick={() => remove(index)}
              className={styles.deleteBtn}
            >
              <Delete color="error" />
            </button>
          </div>
        ))}
      </div>
      <button className={styles.addBtn} onClick={addField}>
        Add
      </button>
    </Box>
  );
};
