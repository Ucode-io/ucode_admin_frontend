import {makeStyles} from "@mui/styles";
import CTimePickerEditor from "./DatePickers/CTimePickerEditor";

const useStyles = makeStyles((theme) => ({
  input: {
    "&::placeholder": {
      color: "#fff",
    },
  },
}));

const HFTimePickerCellEditor = (props) => {
  const classes = useStyles();
  const {field, setValue, value} = props;

  return (
    <div className={"className"}>
      <CTimePickerEditor
        classes={classes}
        disabled={field?.disabled}
        value={value}
        onChange={(val) => {
          setValue(val);
        }}
      />
    </div>
  );
};

export default HFTimePickerCellEditor;
