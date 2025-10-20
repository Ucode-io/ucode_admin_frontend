import React, { useEffect, useState } from "react";
import HFTextEditor from "@/components/FormElements/HFTextEditorOptimization";
import { Box, Popover } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { useDispatch } from "react-redux";
import { showAlert } from "@/store/alert/alert.thunk";
import cls from "./style.module.scss";
import { parseHTMLToText } from "@/utils/parseHTMLToText";

export default function MultiLineCellFormElement({
  isWrapField,
  isNewTableView = false,
  field,
  isDisabled,
  row,
  handleChange,
  ...props
}) {
  const [innerValue, setInnerValue] = useState(row?.[field?.slug]);

  const defaultValue = row?.[field?.slug];

  const stripHtmlTags = (input) => {
    return input.replace(/<[^>]*>/g, "");
  };

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    console.log("CLOSE");
    handleChange({
      value: innerValue,
      name: field?.slug,
      rowId: row?.guid,
    });
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const dispatch = useDispatch();

  const handleCopy = (value) => {
    const cleanedText = parseHTMLToText(value);

    navigator.clipboard.writeText(cleanedText);
    dispatch(showAlert("Copied to clipboard", "success"));
  };

  useEffect(() => {
    if (row?.[field?.slug] !== innerValue) {
      setInnerValue(row?.[field?.slug]);
    }
  }, [row]);

  return (
    <>
      <Box
        className={cls.multiLineCellFormElement}
        style={{
          display: "flex",
        }}
      >
        <button
          className={cls.multiLineCellFormElementBtn}
          onClick={() => handleCopy(defaultValue)}
        >
          <span>
            <ContentCopyIcon style={{ width: "17px", height: "17px" }} />
          </span>
        </button>
        <p
          id="textAreaInput"
          onClick={(e) => handleClick(e)}
          style={
            isWrapField
              ? {
                  height: "16px",
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                  marginRight: "8px",
                  cursor: "text",
                  minHeight: "16px",
                }
              : {
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                  marginRight: "8px",
                  cursor: "text",
                  minHeight: "16px",
                }
          }
        >
          {stripHtmlTags(
            defaultValue
              ? `${defaultValue?.slice(0, 36)}${defaultValue?.length > 200 ? "..." : ""}`
              : "",
          )}
        </p>

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
          }}
        >
          <HFTextEditor
            field={field}
            row={row}
            isNewTableView={isNewTableView}
            tabIndex={field?.tabIndex}
            disabled={isDisabled}
            isTransparent={true}
            setInnerValue={setInnerValue}
            innerValue={innerValue}
            {...props}
          />
        </Popover>
      </Box>
    </>
  );
}
