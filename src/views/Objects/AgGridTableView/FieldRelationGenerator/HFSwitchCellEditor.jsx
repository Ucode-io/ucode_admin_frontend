import {Switch} from "@mui/material";
import {useId} from "react";
import {Controller} from "react-hook-form";

const HFSwitchCellEditor = (props) => {
  const id = useId();
  const {field, setValue, value} = props;
  return (
    <div>
      <Switch
        checked={value || false}
        onChange={(e, val) => {
          setValue(val);
        }}
      />
    </div>
  );
};

export default HFSwitchCellEditor;
