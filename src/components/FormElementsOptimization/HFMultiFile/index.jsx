import {FormHelperText} from "@mui/material";
import MultiFileUpload from "./MultiFileUpload";
import { useState } from "react";

const HFMultiFile = ({
  name,
  tabIndex,
  disabledHelperText = false,
  disabled = false,
  field,
  isTableView = false,
  drawerDetail = false,
  updateObject = () => {},
  newUi,
  handleChange = () => {},
  row,
  ...props
}) => {

  const [error] = useState({})

  const onChange = (value) => {
    console.log({value})
    handleChange({
      value,
      rowId: row?.guid,
      name: field?.slug
    })
  }

  return (
    <>
    <MultiFileUpload
      name={name}
      drawerDetail={drawerDetail}
      value={row?.[field?.slug]}
      tabIndex={tabIndex}
      onChange={onChange}
      updateObject={updateObject}
      disabled={disabled}
      field={field}
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
