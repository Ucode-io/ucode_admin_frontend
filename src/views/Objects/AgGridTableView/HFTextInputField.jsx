import {Button, TextField} from "@mui/material";
import styles from "./style.module.scss";
import RowClickButton from "./RowClickButton";

const HFTextInputField = (props) => {
  const {value, setValue, colDef, data} = props;

  const onNavigateToDetail = () => {
    colDef?.onRowClick(data);
  };
  return (
    <>
      <TextField
        size="small"
        value={value}
        fullWidth
        onChange={(e) => setValue(e.target.value)}
        className="custom_textfield_new"
      />
      {colDef?.colIndex === 0 && (
        <RowClickButton onRowClick={onNavigateToDetail} />
      )}
    </>
  );
};

export default HFTextInputField;
