import {Box, Card, Popover} from "@mui/material";
import {useState} from "react";
import {colorList} from "../../../../components/ColorPicker/colorList";
import RowClickButton from "../RowClickButton";

const ColorPicker = (props) => {
  const {setValue, value, field, colDef, data} = props;
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const onNavigateToDetail = () => {
    colDef?.onRowClick(data);
  };

  const open = Boolean(anchorEl);

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        background: "#0000",

        "&:hover .rowClickButton": {
          display: "block",
        },
      }}>
      {" "}
      <div
        style={{
          padding: "0 0 0 12px",
          display: "flex",
          alignItems: "center",
          height: "31px",
        }}
        className="ColorPicker"
        onClick={(e) => e.stopPropagation()}>
        {field?.attributes?.disabled ? (
          <img src="/table-icons/lock.svg" alt="lock" />
        ) : (
          <div
            id="round"
            className="round"
            style={{
              backgroundColor: value ?? "#fff",
              width: "24px",
              height: "24px",
            }}
            onClick={(e) =>
              !field?.attributes?.disabled && handleClick(e)
            }></div>
        )}

        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}>
          <Card elevation={12} className="ColorPickerPopup">
            {colorList.map((color, index) => (
              <div
                className="round"
                key={index}
                style={{backgroundColor: color}}
                onClick={() => {
                  setValue(color);
                  handleClose();
                }}
              />
            ))}
          </Card>
        </Popover>
      </div>
      {/* {props?.colDef?.colIndex === 0 && ( */}
      <RowClickButton onRowClick={onNavigateToDetail} />
      {/* )} */}
    </Box>
  );
};

export default ColorPicker;
