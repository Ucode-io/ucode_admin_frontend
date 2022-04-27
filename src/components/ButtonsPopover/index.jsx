import "./style.scss"
import PopupState, { bindTrigger, bindPopover } from "material-ui-popup-state"
import { Card, CircularProgress, IconButton, Popover } from "@mui/material"
import MoreVertIcon from "@mui/icons-material/MoreVert"
import MoreHorizIcon from "@mui/icons-material/MoreHoriz"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye"

const ButtonsPopover = ({
  onEditClick,
  onDeleteClick = () => {},
  id,
  activeEyeButton,
  buttonProps,
  loading,
  openModal = () => {},
  orientation = "vertical",
}) => {

  if(loading) return <IconButton color="primary" ><CircularProgress size={17} {...buttonProps} /></IconButton>

  return (
    <PopupState variant="popover" >
      {(popupState) => (
        <div className="ButtonsPopover" onClick={(e) => e.stopPropagation()}>
          <IconButton color="primary"  {...bindTrigger(popupState)} {...buttonProps} >
            {
              orientation === 'vertical' ? <MoreVertIcon /> : <MoreHorizIcon />
            }
          </IconButton>
          <Popover
            {...bindPopover(popupState)}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "center",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
          >
            <Card elevation={12} className="ButtonsPopover">
              {activeEyeButton && (
                <IconButton color="primary" onClick={(e) => openModal(e, id)}>
                  <RemoveRedEyeIcon />
                </IconButton>
              )}
              {onEditClick && <IconButton color="success" onClick={(e) => onEditClick(e, id)}>
                <EditIcon />
              </IconButton>}
              <IconButton color="error" onClick={(e) => onDeleteClick(e, id)}>
                <DeleteIcon />
              </IconButton>
            </Card>
          </Popover>
        </div>
      )}
    </PopupState>
  )
}

export default ButtonsPopover
