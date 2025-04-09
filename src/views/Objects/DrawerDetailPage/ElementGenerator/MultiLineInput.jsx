import {Box, Popover} from "@mui/material";
import {useState} from "react";
import {useWatch} from "react-hook-form";
import HFTextEditor from "../../../../components/FormElements/HFTextEditor";

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
          "&:hover": {
            backgroundColor: "#F7F7F7",
          },
        }}>
        <Box
          sx={{width: "100%", fontSize: "14px"}}
          id="textAreaInput"
          onClick={(e) => {
            !isDisabled && handleClick(e);
          }}>
          {stripHtmlTags(
            value
              ? `${value?.slice(0, 100)}${value?.length > 100 ? "..." : ""}`
              : "Empty"
          )}
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
