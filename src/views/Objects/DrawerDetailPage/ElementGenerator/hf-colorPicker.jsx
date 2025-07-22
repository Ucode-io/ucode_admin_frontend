import {Controller} from "react-hook-form";
import "./style.scss";
import {Card, CircularProgress, IconButton, Menu, Popover} from "@mui/material";
import {useState} from "react";
import {colorList} from "../../../../components/ColorPicker/colorList";
import {Box} from "@chakra-ui/react";
import {Lock} from "@mui/icons-material";

const HFColorPicker = ({
  control,
  name,
  disabledHelperText = false,
  required = false,
  updateObject = () => {},
  isNewTableView = false,
  rules = {},
  customeClick = false,
  clickItself = () => {},
  disabled = false,
  drawerDetail = false,
  ...props
}) => {
  return (
    <Controller
      control={control}
      name={name}
      defaultValue=""
      rules={{
        required: required ? "This is required field" : false,
        ...rules,
      }}
      render={({field: {onChange, value}, fieldState: {error}}) => (
        <>
          <ColorPicker
            drawerDetail={drawerDetail}
            disabled={disabled}
            error={error}
            value={value}
            onChange={(val) => {
              onChange(val);
              isNewTableView && updateObject();
            }}
            customeClick={customeClick}
            clickItself={clickItself}
            {...props}
          />
        </>
      )}
    />
  );
};

const ColorPicker = ({
  value,
  onChange,
  loading,
  disabled,
  drawerDetail = false,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  if (loading)
    return (
      <IconButton color="primary">
        <CircularProgress size={17} />
      </IconButton>
    );

  return (
    <div
      style={{width: "318px", padding: drawerDetail ? "0 10px" : "0"}}
      className="ColorPicker"
      onClick={(e) => e.stopPropagation()}>
      <div
        id="round"
        className="round"
        style={{
          backgroundColor: value ?? "#fff",
          cursor: disabled ? "not-allowed" : "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        onClick={disabled ? () => {} : handleClick}>
        {disabled && <Lock style={{fontSize: "20px", color: "#adb5bd"}} />}
      </div>
      <Menu
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        // anchorOrigin={{
        //   vertical: "bottom",
        //   horizontal: "left",
        // }}
        // transformOrigin={{
        //   vertical: "top",
        //   horizontal: "left",
        // }}
      >
        <Card elevation={12} className="ColorPickerPopup">
          {colorList.map((color, index) => (
            <div
              className="round"
              key={index}
              style={{backgroundColor: color}}
              onClick={() => {
                onChange(color);
                handleClose();
              }}
            />
          ))}
        </Card>
      </Menu>
    </div>
  );
};

export default HFColorPicker;
