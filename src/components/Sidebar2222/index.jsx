import "./style.scss"
import menuElements from "./elements"
import brandLogo from "../../assets/icons/soliq-logo.svg"
import MenuOpenIcon from "@mui/icons-material/MenuOpen"
import { useState, useEffect,  } from "react"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import { NavLink } from "react-router-dom"
import ChildBlock from "./ChildBlock"
import ExitToAppIcon from "@mui/icons-material/ExitToApp"
import { useDispatch, useSelector } from "react-redux"
// import { authActions } from "../../redux/slices/auth.slice"
// import { globalSettingsActions } from "../../redux/slices/globalSettings.slice"
import PermissionWrapper from "../PermissionWrapper"

const Sidebar = () => {
  // const rightSideVisible = useSelector(state => state.globalSettings.sidebarNavigationVisible)
  const dispatch = useDispatch()
  const [rightSideVisible, setRightSideVisible] = useState(true)

  const [openedBlock, setOpenedBlock] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // const setRightSideVisible = (value) => {
  //   dispatch(globalSettingsActions.setSidebarNavigationVisible(value))
  // }

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
  
  const logoutHandler = () => {
    // setIsModalOpen(true)
    // dispatch(authActions.logout())
  }


  return (
    <div className={`Sidebar ${!rightSideVisible ? "right-side-closed" : ""}`}>
      {/* <LogoutModal
        isOpen={isModalOpen}
        close={() => setIsModalOpen(false)}
        logout={() => dispatch({ type: CLEAR_ON_SIGNOUT })}
      /> */}
      <div className="header">
        <div className="brand">
          <div
            className="brand-logo"
            onClick={switchRightSideVisible}
          >
            <img src={brandLogo} alt="logo" />
          </div>
          <div className="brand-name">SOLIQ SERVIS</div>
        </div>
        <div
          className="cloes-btn"
          onClick={switchRightSideVisible}
        >
          <MenuOpenIcon />
        </div>
      </div>

      <div className="nav-block" style={{height: `calc(100vh - ${72}px)`}} >
        <div className="menu-element">
          {menuElements?.map((element) => (
            // <PermissionWrapper permission={element.permission} >
              <div className="parent-block" key={element.id} >
              <NavLink
                to={element.path}
                exact={0}
                // className="nav-element"
                className={({isActive}) => `nav-element ${isActive && (element.children ? "active-with-child" : "active")}`}
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
            // </PermissionWrapper>
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
          <div className="parent-block">
            <div className="nav-element" onClick={logoutHandler}>
              <div className="icon">
                <ExitToAppIcon />
              </div>
              <div className="label" >Logout</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
