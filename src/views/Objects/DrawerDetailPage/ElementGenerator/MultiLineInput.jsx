import {Box, Popover} from "@mui/material";
import {useState} from "react";
import {useWatch} from "react-hook-form";
import HFTextEditor from "../../../../components/FormElements/HFTextEditor";
import { Lock } from "@mui/icons-material";

const MultiLineInput = ({
  control,
  name,
  isDisabled = false,
  field,
  isWrapField = false,
  watch,
  props,
  placeholder = "",
}) => {
  const value = watch(name);
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

  return (
    <>
      <Box
        sx={{
          display: "flex",
          width: "325px",
          color: "#787774",
          padding: "5px 9.6px",
          borderRadius: "4px",
          position: "relative",
          "&:hover": {
            backgroundColor: "#F7F7F7",
          },
        }}
      >
        <Box
          sx={{
            width: "100%",
            fontSize: "14px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            cursor: isDisabled ? "not-allowed" : "pointer",
          }}
          id="textAreaInput"
          onClick={(e) => {
            handleClick(e);
          }}
        >
          {value ? (
            stripHtmlTags(
              `${value?.slice(0, 100)}${value?.length > 100 ? "..." : ""}`
            )
          ) : (
            <span style={{ color: "#adb5bd" }}>Empty</span>
          )}
        </Box>
        {isDisabled && (
          <Box
            sx={{
              width: "20px",
              height: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "absolute",
              right: "1px",
              top: "50%",
              transform: "translateY(-50%)",
            }}
          >
            <Lock style={{ fontSize: "20px", color: "#adb5bd" }} />
          </Box>
        )}

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
            drawerDetail={true}
            id="multi_line"
            control={control}
            name={name}
            tabIndex={field?.tabIndex}
            fullWidth
            multiline
            rows={4}
            defaultValue={field.defaultValue}
            disabled={isDisabled}
            key={name}
            isTransparent={true}
            {...props}
          />
        </Popover>
      </Box>
    </>
  );
};

export default MultiLineInput;
