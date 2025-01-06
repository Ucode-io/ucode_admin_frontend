import {makeStyles} from "@mui/styles";
import {Controller} from "react-hook-form";
import CDateTimePicker from "./DatePickers/CDateTimePicker";

const useStyles = makeStyles((theme) => ({
  input: {
    "&::placeholder": {
      color: "#fff",
    },
  },
}));

const DateTimeCellEditor = (props) => {
  const classes = useStyles();
  const {field, value, setValue} = props;

  return (
    <div className={"className"}>
      <CDateTimePicker
        classes={classes}
        // placeholder={placeholder}
        mask={"99.99.9999"}
        value={value}
        onChange={(val) => {
          const isoDate = val?.toISOString();
          setValue(isoDate);
        }}
        disabled={field?.disabled}
      />
    </div>
  );
};

export default DateTimeCellEditor;
