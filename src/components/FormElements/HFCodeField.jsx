import {useState, useEffect, useMemo} from "react";
import {Controller, useWatch} from "react-hook-form";
import RingLoaderWithWrapper from "../Loaders/RingLoader/RingLoaderWithWrapper";
import FRowMultiLine from "./FRowMultiLine";
import JSONInput from "react-json-editor-ajrm";
import {isJSONParsable} from "../../utils/isJsonValid";

const HFCodeField = ({
  control,
  name = "",
  disabledHelperText = false,
  updateObject = () => {},
  isNewTableView = false,
  required = false,
  isTransparent = false,
  withTrim = false,
  tabIndex,
  rules = {},
  field,
  label,
  newColumn,
}) => {
  const values = useWatch({
    control,
    name,
  });

  const parsedValue = useMemo(() => {
    if (isJSONParsable(values)) {
      return JSON.parse(values);
    } else {
      return {};
    }
  }, [values]);

  return (
    <FRowMultiLine
      label={label}
      required={field?.required}
      extraClassName={isNewTableView ? "tableView" : ""}>
      <Controller
        control={control}
        name={name}
        defaultValue=""
        rules={{
          required: required ? "This is required field" : false,
          ...rules,
        }}
        render={({field: {onChange}, fieldState: {error}}) => (
          <div>
            <JSONInput
              id="a_unique_id"
              placeholder={parsedValue}
              width="400px"
              height="300px"
              onChange={(e) => {
                if (isJSONParsable(e.json)) {
                  onChange(e.json);
                  Boolean(!newColumn && isNewTableView) && updateObject();
                }
              }}
            />
            {error && <span>{error.message}</span>}
          </div>
        )}
      />
    </FRowMultiLine>
  );
};

export default HFCodeField;
