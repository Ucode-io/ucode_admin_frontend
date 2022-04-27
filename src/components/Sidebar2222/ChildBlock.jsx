import { Collapse } from "@mui/material"
// import { Collapse } from "react-collapse"
import { NavLink } from "react-router-dom"
import PermissionWrapper from "../PermissionWrapper"

const ChildBlock = ({ element, isVisible }) => {
  // const transitions = useTransition(isVisible, {
  //   from: { opacity: 0 },
  //   enter: { opacity: 1 },
  //   leave: { opacity: 0 },
  //   reverse: isVisible,
  //   config: {
  //     duration: 200,
  //   },
  // })

  // return transitions(
  //   (styles, item) =>
  //     item && (
  //       <animated.div className="child-block" style={styles} >
  //         {element.children.map((childElement) => (
  //           <NavLink to={childElement.path} className="nav-element">
  //             <div className="label">{t(childElement.title)}</div>
  //           </NavLink>
  //         ))}
  //       </animated.div>
  //     )
  // )

  return (
    <Collapse
      in={isVisible}
      timeout={{
        enter: 300,
        exit: 200,
      }}
    >
      <div className="child-block">
        {element.children.map((childElement) => (
          // <PermissionWrapper permission={childElement.permission}>
            <NavLink
              key={childElement.id}
              to={childElement.path}
              className="nav-element"
            >
              {childElement.icon && <childElement.icon className="icon" />}
              <div className="label"> {childElement.title}</div>
            </NavLink>
          // </PermissionWrapper>
        ))}
      </div>
    </Collapse>
  )
}

export default ChildBlock
