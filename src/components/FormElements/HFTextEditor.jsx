import {lazy, Suspense} from "react";
import {Controller, useWatch} from "react-hook-form";

import RingLoaderWithWrapper from "../Loaders/RingLoader/RingLoaderWithWrapper";
import "react-quill/dist/quill.snow.css";
import FRowMultiLine from "./FRowMultiLine";

const ReactQuill = lazy(() => import("react-quill"));

const HFTextEditor = ({
  control,
  name = "",
  disabledHelperText = false,
  updateObject,
  isNewTableView = false,
  required = false,
  isTransparent = false,
  fullWidth = false,
  withTrim = false,
  tabIndex,
  rules = {},
  field,
  label,
  ...props
}) => {
  const value = useWatch({
    control,
    name,
  });

  return (
    <FRowMultiLine label={label} required={field?.required}>
      <Controller
        control={control}
        name={name}
        defaultValue=""
        rules={{
          required: required ? "This is required field" : false,
          ...rules,
        }}
        render={({field: {onChange, ref}, fieldState: {error}}) => (
          <Suspense fallback={<RingLoaderWithWrapper />}>
            <ReactQuill
              theme="snow"
              value={value}
              defaultValue={value}
              onChange={(val) => {
                onChange(val);
                isNewTableView && updateObject();
              }}
              tabIndex={tabIndex}
              autoFocus={false}
              style={{
                backgroundColor: `${isTransparent ? "transparent" : ""}`,
                minWidth: "200px",
                width: "100%",
              }}
            />
          </Suspense>
          // <TextField
          //   size="small"
          //   value={value}
          //   onChange={(e) =>
          //     onChange(withTrim ? e.target.value?.trim() : e.target.value)
          //   }
          //   name={name}
          //   error={error}
          //   fullWidth={fullWidth}
          //   helperText={!disabledHelperText && error?.message}
          //   {...props}
          // />
        )}
      ></Controller>
    </FRowMultiLine>
  );
};

export default HFTextEditor;
