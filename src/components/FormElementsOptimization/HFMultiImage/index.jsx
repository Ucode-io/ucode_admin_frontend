import {FormHelperText} from "@mui/material";
import MultiImageUpload from "./MultiImageUpload";
import { useState } from "react";

const HFMultiImage = ({
  name,
  tabIndex,
  disabledHelperText = false,
  disabled = false,
  isTableView = false,
  drawerDetail = false,
  updateObject = () => {},
  newUi,
  handleChange,
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
      <MultiImageUpload
        name={name}
        drawerDetail={drawerDetail}
        value={row?.value}
        tabIndex={tabIndex}
        onChange={onChange}
        updateObject={updateObject}
        disabled={disabled}
        field={row}
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

export default HFMultiImage;
