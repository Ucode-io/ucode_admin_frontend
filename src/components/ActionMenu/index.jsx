import React, { useState } from "react"
import Menu from "@material-ui/core/Menu"
import ButtonMaterial from "@material-ui/core/Button"
import MoreHorizIcon from "@material-ui/icons/MoreHoriz"
import MenuItem from "@material-ui/core/MenuItem"
import IconButton from "../Button/IconButton"
import { withStyles, makeStyles, createStyles } from "@material-ui/core"

import "./style.scss"

const StyledMenu = withStyles((theme) => ({
  root: {
    "& ul": {
      padding: 0,
    },
  },
}))(Menu)

const useStyles = makeStyles(() =>
  createStyles({
    list: {
      padding: "0",
    },
  })
)

export default function ActionMenu({ actions = [], id }) {
  const [anchorEl, setAnchorEl] = useState(null)
  const classes = useStyles()

  const handleClick = (event, id) => {
    event.stopPropagation()
    setAnchorEl({
      element: event.currentTarget,
      id,
    })
  }

  const handleClose = (e) => {
    e.stopPropagation()
    setAnchorEl(null)
  }

  return (
    <div className="ActionMenu">
      <ButtonMaterial
        className="btn__action"
        color="primary"
        aria-controls="simple-menu"
        onClick={(event) => handleClick(event, id)}
      >
        <MoreHorizIcon />
      </ButtonMaterial>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl?.element}
        open={anchorEl?.id === id}
        onClose={handleClose}
        classes={{ list: classes.list }}
        // style={{ padding: 0 }}
      >
        {actions.map((elm, i) => (
          <MenuItem
            key={i}
            style={{
              borderBottom: "1px solid #E5E9EB",
              padding: "8px 16px 8px 8px",
            }}
            onClick={(e) => {
              e.stopPropagation()
              elm.action(id, e)
              handleClose(e)
            }}
          >
            <IconButton color={elm.color} icon={elm.icon} />
            <span className="ml-2">{elm.title}</span>
          </MenuItem>
        ))}
      </Menu>
    </div>
  )
}
