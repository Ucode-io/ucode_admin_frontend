import "./style.scss"
import PopupState, { bindTrigger, bindPopover } from "material-ui-popup-state"
import { Card, CircularProgress, IconButton, Popover } from "@mui/material"
import { iconsList } from "./iconsList"
import { memo } from "react"
import IconGenerator from "./IconGenerator"

const IconPicker = ({
  value="",
  onChange,
  error,
  loading,
  ...props
}) => {

  if (loading)
    return (
      <IconButton color="primary">
        <CircularProgress size={17} />
      </IconButton>
    )

  return (
    <PopupState variant="popover"  >
      {(popupState) => (
        <div className="IconPicker" onClick={(e) => e.stopPropagation()} {...props}>
          <div
            className={`icon-wrapper ${error ? 'error' : ''}`}
            style={{ backgroundColor: value ?? "#fff" }}
            {...bindTrigger(popupState)}
          >
            <IconGenerator icon={value} />
          </div>
          <Popover
            {...bindPopover(popupState)}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
          >
            <Card elevation={12} className="IconPickerPopup">
              {iconsList.map((icon, index) => (
                <div
                  className="icon-wrapper"
                  key={index}
                  onClick={() => onChange(icon.name)}
                >
                  <icon.component />
                </div>
              ))}
            </Card>
          </Popover>
        </div>
      )}
    </PopupState>
  )
}

export default memo(IconPicker)
