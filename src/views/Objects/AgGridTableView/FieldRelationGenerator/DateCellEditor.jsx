import {makeStyles} from "@mui/styles";
import CDatePickerCellEditor from "./DatePickers/CDatePickerCellEditor";

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

  return (
    <div className={"className"}>
      <CDatePickerCellEditor
        classes={classes}
        // placeholder={placeholder}
        mask={"99.99.9999"}
        value={value}
        onChange={(val) => {
          const isoDate = val.toISOString();

          setValue(isoDate);
        }}
        disabled={field?.disabled}
      />
    </div>
  );
};

export default DateCellEditor;
