import {TextField} from "@mui/material";

const HFTextInputField = (props) => {
  const {value, setValue} = props;

  return (
    <TextField
      size="small"
      value={value}
      fullWidth
      onChange={(e) => setValue(e.target.value)}
      className="custom_textfield_new"
    />
  );
};

export default HFTextInputField;
