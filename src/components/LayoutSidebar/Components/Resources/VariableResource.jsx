import {Box} from "@mui/material";
import {useFieldArray} from "react-hook-form";
import styles from "./styles.module.scss";
import VariableRow from "./VariableRow";
import {generateLangaugeText} from "../../../../utils/generateLanguageText";
import {useTranslation} from "react-i18next";

const headerStyle = {
  width: "100",
  height: "50px",
  display: "flex",
  padding: "15px",
  marginTop: "10px",
};

const VariableResources = ({control, settingLan}) => {
  const {fields, append, remove, update} = useFieldArray({
    control: control,
    name: "variables",
  });
  const {i18n} = useTranslation();

  const appendVariable = () => {
    append({
      key: "",
      value: "",
    });
  };

  return (
    <>
      <Box sx={headerStyle}>
        <h2 variant="h6">
          {generateLangaugeText(
            settingLan,
            i18n?.language,
            "Variable Resource"
          ) || "Variable Resource"}{" "}
        </h2>
      </Box>
      <Box style={{height: "calc(100vh - 400px)", overflow: "scroll"}}>
        <div className="">
          <div className={styles.actionSettingBlock}>
            {fields?.map((summary, index) => (
              <VariableRow
                summary={summary}
                control={control}
                index={index}
                update={update}
                remove={remove}
                variables={fields}
              />
            ))}
          </div>
        </div>

        <div className={styles.summaryButton} onClick={appendVariable}>
          <button type="button">
            +{" "}
            {generateLangaugeText(settingLan, i18n?.language, "Create new") ||
              "Create new"}
          </button>
        </div>
      </Box>
    </>
  );
};

export default VariableResources;
