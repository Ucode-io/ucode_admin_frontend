import {makeStyles} from "@mui/styles";
import CDatePickerCellEditor from "./DatePickers/CDatePickerCellEditor";
import {useEffect} from "react";
import {format} from "date-fns";

const useStyles = makeStyles((theme) => ({
  input: {
    "&::placeholder": {
      color: "#fff",
    },
  },
}));

const DateCellEditor = (props) => {
  const classes = useStyles();
  const {field, value, setValue} = props;
  console.log("setValuesetValue", setValue);
  return (
    <div className={"className"}>
      <CDatePickerCellEditor
        classes={classes}
        // placeholder={placeholder}
        mask={"99.99.9999"}
        value={value}
        onChange={(val) => {
          console.log("valllll========>", format(val, "dd-mm-yyyy"));
          setValue(format(val, "dd-mm-yyyy"));
          props.api.stopEditing();
        }}
        disabled={field?.disabled}
      />
    </div>
  );
};

export default DateCellEditor;
