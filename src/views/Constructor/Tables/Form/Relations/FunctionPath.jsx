import React from "react";
import styles from "./style.module.scss";
import FormElementGenerator from "../../../../../components/ElementGenerators/FormElementGenerator";
import HFSelect from "../../../../../components/FormElements/HFSelect";
import { useWatch } from "react-hook-form";
import { Button } from "@mui/material";

function FunctionPath({ control, watch, functions, setValue }) {
  const clear = () => {
    setValue("function_path", "");
  };

  return (
    <>
      {/* <div className={styles.settingsBlockHeader}>
        <h2>Functions</h2>
      </div> */}
      <div className="p-2">
        <div className={styles.input_control}>
          <HFSelect
            control={control}
            name="function_path"
            options={functions}
          />

          <Button onClick={clear}>Clear Function</Button>
        </div>
      </div>
    </>
  );
}

export default FunctionPath;
