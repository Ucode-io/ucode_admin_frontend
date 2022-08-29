import "./style.scss"
import menuElements from "./elements"
import brandLogo from "../../assets/icons/soliq-logo.svg"
import MenuOpenIcon from "@mui/icons-material/MenuOpen"
import { useState, useEffect } from "react"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import { NavLink } from "react-router-dom"
import ChildBlock from "./ChildBlock"
import { useSelector } from "react-redux"

const Sidebar2222 = () => {
  const permissions = useSelector((state) => state.auth.permissions)
  const [rightSideVisible, setRightSideVisible] = useState(true)

  const [openedBlock, setOpenedBlock] = useState(null)

  const switchRightSideVisible = () => {
    setRightSideVisible(!rightSideVisible)
  }

  const parentClickHandler = (element) => {
    if (element.children) {
      switchChildBlockHandler(element.id)
      if (!rightSideVisible) setRightSideVisible(true)
    } else setOpenedBlock(null)
  }

  const switchChildBlockHandler = (id) => {
    setOpenedBlock((prev) => (prev === id ? null : id))
  }

  useEffect(() => {
    if (!rightSideVisible) setOpenedBlock(null)
  }, [rightSideVisible])

  return (
    <div className={`Sidebar ${!rightSideVisible ? "right-side-closed" : ""}`}>
      <div className="header">
        <div className="brand">
          <div className="brand-logo" onClick={switchRightSideVisible}>
            <img src={brandLogo} alt="logo" />
          </div>
          <div className="brand-name">MEDION SETTINGS</div>
        </div>
        <div className="cloes-btn" onClick={switchRightSideVisible}>
          <MenuOpenIcon />
        </div>
      </div>

      <div className="nav-block" style={{ height: `calc(100vh - ${72}px)` }}>
        <div className="menu-element">
          {menuElements
            ?.filter((el, idx) =>
              idx === 1 ? (permissions?.[el.slug]?.["read"] !== false) : true
            )
            .map((element) => (
              <div className="parent-block" key={element.id}>
                <NavLink
                  to={element.path}
                  exact={0}
                  className={({ isActive }) =>
                    `nav-element ${
                      isActive &&
                      (element.children ? "active-with-child" : "active")
                    }`
                  }
                  onClick={(e) => {
                    if (element.children) e.preventDefault()
                    parentClickHandler(element)
                  }}
                >
                  <div className="icon">
                    <element.icon />
                  </div>

                  <div className="label">{element.title}</div>
                  {element.children && (
                    <div
                      className={`arrow-icon ${
                        openedBlock === element.id ? "open" : ""
                      }`}
                    >
                      <ExpandMoreIcon />
                    </div>
                  )}
                </NavLink>

                {element.children && (
                  <ChildBlock
                    element={element}
                    isVisible={openedBlock === element.id}
                  />
                )}
              </div>
            ))}
        </div>

        <div className="sidebar-footer">
          {/* <div className="parent-block">
            <NavLink
              className="nav-element"
              to="/home/profile"
              style={{ padding: "10px 0px" }}
            >
              <div className="profile-avatar">{'K'}</div>
              <div className="label">Shaxsiy ma'lumotlar</div>
            </NavLink>
          </div> */}
          {/* <div className="parent-block">
            <div className="nav-element" onClick={logoutHandler}>
              <div className="icon">
                <ExitToAppIcon />
              </div>
              <div className="label" >Logout</div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  )
}

export default Sidebar2222
