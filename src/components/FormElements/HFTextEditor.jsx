import React, {lazy, Suspense, useRef} from "react";
import {Controller, useWatch} from "react-hook-form";
import RingLoaderWithWrapper from "../Loaders/RingLoader/RingLoaderWithWrapper";
import "react-quill/dist/quill.snow.css";
import FRowMultiLine from "./FRowMultiLine";
import "./reactQuill.scss";
import {Quill} from "react-quill";

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

  let fonts = Quill.import("attributors/style/font");
  fonts.whitelist = ["initial", "sans-serif", "serif", "monospace"];
  Quill.register(fonts, true);

  const modules = {
    toolbar: {
      container: [
        [{header: "1"}, {header: "2"}],
        [({list: "ordered"}, {list: "bullet"})],
        ["bold", "italic", "underline"],
        [{color: []}],
        ["link", "image", "video"],
        [{font: ["roboto", "lato", "inter", "serif", "monospace"]}],
      ],
    },
  };
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
          <Suspense fallback={<RingLoaderWithWrapper />}>
            <ReactQuill
              theme="snow"
              value={value}
              modules={modules}
              defaultValue={value}
              onChange={(val) => {
                onChange(val);
                isNewTableView && updateObject();
              }}
              tabIndex={tabIndex}
              autoFocus={false}
              style={{
                backgroundColor: isTransparent ? "transparent" : "",
                minWidth: "200px",
                width: "100%",
                border: "1px solid #FFF",
                // fontFamily: "'sans-serif'", // Ensure default font family is set correctly
              }}
            />
          </Suspense>
        )}
      />
    </FRowMultiLine>
  );
};

export default HFTextEditor;
