import { Popover } from "@mui/material"
import { CrossPerson, TwoUserIcon } from "../../assets/icons/icon"

const PermissionYesOrNoPopup = ({ anchorEl, handleClose }) => {
  const open = Boolean(anchorEl)
  const id = open ? "simple-popover" : undefined

  return (
    <Popover
      id={id}
      open={open}
      anchorEl={anchorEl}
      onClose={handleClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
    >
      <div style={{ display: "flex", gap: "8px", padding: 8 }}>
        <div>
          <TwoUserIcon />
        </div>
        <div>
          <CrossPerson />
        </div>
      </div>
    </Popover>
  )
}

export default PermissionYesOrNoPopup
