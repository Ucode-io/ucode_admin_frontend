import {makeStyles} from "@mui/styles";
import {Controller} from "react-hook-form";
import CDateTimePickerWithoutCell from "./DatePickers/CDateTimePickerWithoutCell";

const useStyles = makeStyles((theme) => ({
  input: {
    "&::placeholder": {
      color: "#fff",
    },
  },
}));

const HFDateTimePickerWithoutCell = (props) => {
  const classes = useStyles();
  const {field, value, setValue} = props;
  return (
    <CDateTimePickerWithoutCell
      classes={classes}
      mask={"99.99.9999"}
      value={value}
      onChange={(val) => {
        setValue(val);
      }}
      disabled={field?.disabled}
    />
  );
};

export default HFDateTimePickerWithoutCell;
