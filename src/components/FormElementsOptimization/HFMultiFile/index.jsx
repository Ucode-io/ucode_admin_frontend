import {FormHelperText} from "@mui/material";
import MultiFileUpload from "./MultiFileUpload";
import { useState } from "react";

const HFMultiFile = ({
  name,
  tabIndex,
  disabledHelperText = false,
  disabled = false,
  isTableView = false,
  drawerDetail = false,
  updateObject = () => {},
  newUi,
  handleChange = () => {},
  row,
  ...props
}) => {
  const [error] = useState({});

  const onChange = (value) => {
    handleChange({
      value,
      rowId: row?.guid,
      name: row?.slug,
    });
  };

  return (
    <>
      <MultiFileUpload
        name={name}
        drawerDetail={drawerDetail}
        value={row?.value}
        tabIndex={tabIndex}
        onChange={onChange}
        updateObject={updateObject}
        disabled={disabled}
        isTableView={isTableView}
        newUi={newUi}
        {...props}
      />
      {!disabledHelperText && error?.message && (
        <FormHelperText error>{error?.message}</FormHelperText>
      )}
    </>
  );
};

export default HFMultiFile;
