import React, {lazy, Suspense, useEffect, useRef} from "react";
import {Controller, useWatch} from "react-hook-form";
import RingLoaderWithWrapper from "../Loaders/RingLoader/RingLoaderWithWrapper";
import "react-quill/dist/quill.snow.css";
import FRowMultiLine from "./FRowMultiLine";
import "./reactQuill.scss";
import {Quill} from "react-quill";
import {useDispatch} from "react-redux";
import {showAlert} from "../../store/alert/alert.thunk";
import DOMPurify from "dompurify";

const ReactQuill = lazy(() => import("react-quill"));

const HFTextEditor = ({
  control,
  name = "",
  disabledHelperText = false,
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
  disabled = false,
  placeholder = "",
  radius = "12px",
  updateObject = () => {},
  ...props
}) => {
  const quillRef = useRef(null);
  const dispatch = useDispatch();

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

  useEffect(() => {
    if (quillRef.current) {
      const quillEditor = quillRef.current.getEditor();

      const toolbar = quillEditor.getModule("toolbar");
      const button = document.createElement("button");
      const img = document.createElement("img");
      const span = document.createElement("span");

      span.className = "ql-formats";

      img.src = "/img/copy-01.svg";
      img.style.width = "18px";
      img.style.height = "18px";

      button.title = "Скопировать";

      span.appendChild(button);
      button.appendChild(img);

      button.onclick = () => {
        const htmlContent = quillEditor.root.textContent;
        navigator.clipboard.writeText(htmlContent).then(() => {
          dispatch(showAlert("Скопировано в буфер обмена", "success"));
        });
      };

      const toolbarContainer = document.querySelector(".ql-toolbar");
      if (toolbarContainer) {
        toolbarContainer.appendChild(span);
      }
    }
  }, []);

  const modules = {
    toolbar: {
      container: [
        [{ header: "1" }, { header: "2" }],
        [{ list: "ordered" }, { list: "bullet" }],
        ["bold", "italic", "underline"],
        [{ color: [] }],
        ["link", "image"],
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
        ["clean"],
      ],
    },
  };

  return (
    <FRowMultiLine
      label={label}
      required={field?.required}
      extraClassName={isNewTableView ? "tableView" : ""}
    >
      <Controller
        control={control}
        name={name}
        rules={{
          required: required ? "This is a required field" : false,
          ...rules,
        }}
        render={({ field: { onChange, value }, fieldState: { error } }) => {
          const computedVal = DOMPurify.sanitize(value, {
            ALLOWED_TAGS: [
              "p",
              "strong",
              "em",
              "u",
              "a",
              "ul",
              "ol",
              "li",
              "span",
              "br",
              "img",
            ],
            ALLOWED_ATTR: [
              "href",
              "style",
              "target",
              "src",
              "width",
              "height",
              "alt",
            ],
          });
          return (
            <Suspense fallback={<RingLoaderWithWrapper />}>
              <ReactQuill
                placeholder={placeholder}
                value={computedVal}
                ref={quillRef}
                readOnly={disabled}
                id={drawerDetail ? "drawerMultiLine" : "multilineField"}
                theme="snow"
                defaultValue={computedVal}
                modules={modules}
                onChange={(val) => {
                  if (val !== "<p><br></p>") {
                    onChange(val);
                    isNewTableView && updateObject();
                  } else {
                    onChange("");
                  }
                }}
                tabIndex={tabIndex}
                autoFocus={false}
                style={{
                  backgroundColor: isTransparent ? "transparent" : "",
                  minWidth: "200px",
                  maxWidth: "500px",
                  overflow: "hidden",
                  fontFamily: "sans-serif",
                  borderRadius: radius,
                }}
              />
            </Suspense>
          );
        }}
      />
    </FRowMultiLine>
  );
};

export default HFTextEditor;
