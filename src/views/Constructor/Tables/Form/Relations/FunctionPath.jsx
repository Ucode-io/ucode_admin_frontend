import React from "react";
import styles from "./style.module.scss";
import FormElementGenerator from "../../../../../components/ElementGenerators/FormElementGenerator";
import HFSelect from "../../../../../components/FormElements/HFSelect";
import axios from "axios";

function FunctionPath({ control, watch, functions }) {
  // request needed

  return (
    <>
      <>
        <div className={styles.settingsBlockHeader}>
          <h2>Functions</h2>
        </div>
        <div className="p-2">
          <div className={styles.input_control}>
            <HFSelect
              control={control}
              name={"function_path"}
              options={functions}
            />
          </div>
        </div>
      </>
    </>
  );
}

export default FunctionPath;
