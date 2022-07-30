import styles from "./style.module.scss"
import companyLogo from "../../assets/icons/soliq-logo.svg"
import { Collapse, Tooltip, Typography } from "@mui/material"
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft"
import React, { useEffect, useMemo, useState } from "react"
import { NavLink, useLocation } from "react-router-dom"
import { useDispatch } from "react-redux"
import { authActions } from "../../store/auth/auth.slice"
import IconGenerator from "../IconPicker/IconGenerator"
// import { IconPickerItem } from "react-fa-icon-picker"

const Sidebar = ({ elements = [] }) => {
  const location = useLocation()
  const dispatch = useDispatch()

  const [rightBlockVisible, setRightBlockVisible] = useState(true)

  const selectedMenuItem = useMemo(() => {
    const activeElement = elements.find((el) => {
      if (location.pathname.includes(el.path)) return true
      return el.children?.some((child) =>
        location.pathname.includes(child.path)
      )
    })

    return activeElement
  }, [location.pathname])

  const logout = () => {
    dispatch(authActions.logout())
  }

  useEffect(() => {
    if (selectedMenuItem?.children) setRightBlockVisible(true)
  }, [selectedMenuItem])

  return (
    <div className={styles.sidebar}>
      <div className={styles.leftSide}>
        <div
          className={styles.header}
          onClick={() => setRightBlockVisible((prev) => !prev)}
        >
          <img className={styles.logo} src={companyLogo} alt="logo" />
        </div>

        <div className={styles.scrollBlock} >
        <div className={styles.menuItemsBlock}>
          {elements
            .filter((element) => element.icon)
            .map((element) => (
              <Tooltip
                placement="right"
                followCursor
                key={element.id}
                title={element.title}
              >
                <NavLink
                  key={element.id}
                  to={element.path ?? element.children?.[0]?.path}
                  className={`${styles.menuItem} ${
                    selectedMenuItem?.id === element.id ? styles.active : ""
                  }`}
                >
                  {typeof element.icon === "string" ? (
                    <IconGenerator icon={element.icon} size={18} />
                    // <IconPickerItem icon="FaAdobe" size={24} />
                  ) : (
                    <element.icon />
                  )}
                </NavLink>
              </Tooltip>
            ))}
        </div>

        {/* <div className={styles.footer}>
          <div className={styles.menuItem}>
            <NotificationsIcon />
          </div>

          {settingsElements
            .filter((element) => element.icon)
            .map((element) => (
              <Tooltip
                placement="right"
                followCursor
                key={element.id}
                title={element.title}
              >
                <NavLink
                  key={element.id}
                  to={element.path ?? element.children?.[0]?.path}
                  className={`${styles.menuItem} ${
                    selectedMenuItem?.id === element.id ? styles.active : ""
                  }`}
                >
                  {typeof element.icon === "string" ? (
                    <IconGenerator icon={element.icon} size={18} />
                  ) : (
                    <element.icon />
                  )}
                </NavLink>
              </Tooltip>
            ))}

          <UserAvatar disableTooltip />

          <div className={styles.menuItem} onClick={logout}>
            <LogoutIcon />
          </div>
        </div> */}
        </div>

      
      </div>

      <Collapse
        in={rightBlockVisible && selectedMenuItem?.children}
        orientation="horizontal"
        unmountOnExit
      >
        <div className={styles.rightSide}>
          <div className={styles.header}>
            <Typography className={styles.title} variant="h4">
              {selectedMenuItem?.title}
            </Typography>
            <div
              className={styles.closeButton}
              onClick={() => setRightBlockVisible(false)}
            >
              <KeyboardDoubleArrowLeftIcon />
            </div>
          </div>

          <div className={styles.menuItemsBlock}>
            {selectedMenuItem?.children?.map((childMenuItem) => (
              <NavLink
                to={childMenuItem.path}
                key={childMenuItem.key}
                className={({ isActive }) =>
                  `${styles.menuItem} ${isActive ? styles.active : ""}`
                }
              >
                {childMenuItem.title}
              </NavLink>
            ))}
          </div>
        </div>
      </Collapse>
    </div>
  )
}

export default Sidebar
