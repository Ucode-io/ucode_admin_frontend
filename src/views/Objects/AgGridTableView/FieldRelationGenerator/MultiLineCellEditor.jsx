import {Box, Popover} from "@mui/material";
import React, {useState} from "react";
import ReactQuill from "react-quill";
import RowClickButton from "../RowClickButton";

function MultiLineCellEditor(props) {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const stripHtmlTags = (input) => {
    return input.replace(/<[^>]*>/g, "");
  };

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
    <>
      <Box
        style={{
          display: "flex",
        }}>
        <p
          onClick={handleClick}
          style={
            true
              ? {
                  height: "32px",
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                  marginRight: "8px",
                  cursor: "text",
                  minHeight: "16px",
                  paddingLeft: "10px",
                }
              : {
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                  marginRight: "8px",
                  cursor: "text",
                  minHeight: "16px",
                }
          }>
          {stripHtmlTags(
            props?.value
              ? `${props?.value?.slice(0, 200)}${props?.value?.length > 200 ? "..." : ""}`
              : ""
          )}
        </p>
      </Box>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}>
        <ReactQuill
          theme="snow"
          value={props?.value}
          modules={modules}
          defaultValue={props?.value ?? ""}
          // onChange={(val) => {
          //   onChange(val);
          //   isNewTableView && updateObject();
          // }}
          tabIndex={1}
          autoFocus={false}
          style={{
            backgroundColor: false ? "transparent" : "",
            minWidth: "200px",
            width: "100%",
            border: "1px solid #FFF",
            fontFamily: "sans-serif",
          }}
        />
      </Popover>

      {props?.colDef?.colIndex === 0 && <RowClickButton right="5px" />}
    </>
  );
}

export default MultiLineCellEditor;
