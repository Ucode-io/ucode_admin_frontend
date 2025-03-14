import React, {lazy, Suspense, useEffect} from "react";
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
  drawerDetail = false,
  ...props
}) => {
  useEffect(() => {
    const Font = Quill.import("formats/font");
    Font.whitelist = [
      "sans-serif",
      "lato",
      "roboto",
      "san-francisco",
      "serif",
      "monospace",
    ];
    Quill.register(Font, true);
  }, []);

  const modules = {
    toolbar: {
      container: [
        [{header: "1"}, {header: "2"}],
        [{list: "ordered"}, {list: "bullet"}],
        ["bold", "italic", "underline"],
        [{color: []}],
        ["link", "image", "video"],
        [
          {
            font: [
              "sans-serif",
              "lato",
              "roboto",
              "san-francisco",
              "serif",
              "monospace",
            ],
          },
        ],
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
        rules={{
          required: required ? "This is a required field" : false,
          ...rules,
        }}
        render={({field: {onChange, value}, fieldState: {error}}) => (
          <Suspense fallback={<RingLoaderWithWrapper />}>
            <ReactQuill
              id={drawerDetail ? "drawerMultiLine" : "multilineField"}
              theme="snow"
              defaultValue={value}
              // value={value || ""}
              modules={modules}
              onChange={(val) => {
                if (val !== "<p><br></p>") {
                  onChange(val);
                  isNewTableView && updateObject();
                }
              }}
              tabIndex={tabIndex}
              autoFocus={false}
              style={{
                backgroundColor: isTransparent ? "transparent" : "",
                minWidth: "200px",
                width: "100%",
                overflow: "hidden",
                fontFamily: "sans-serif",
                borderRadius: "12px",
              }}
            />
          </Suspense>
        )}
      />
    </FRowMultiLine>
  );
};

export default HFTextEditor;
