import { Collapse } from "@mui/material";
import { NavLink } from "react-router-dom";
import IconGenerator from "../IconPicker/IconGenerator";
import { AiOutlinePlus } from "react-icons/ai";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const ChildBlock = ({
  element,
  isVisible,
  openedBlock,
  openFolderCreateModal,
  parentClickHandler,
}) => {
  return (
    <>
      <Collapse
        in={isVisible}
        timeout={{
          enter: 300,
          exit: 200,
        }}
      >
        <div className="child-block">
          {element.children.map((childElement) =>
            childElement?.isChild ? (
              <NavLink
                key={childElement.id}
                to={childElement.path}
                className="nav-element"
              >
                <div className="child-element-dot">
                  <IconGenerator icon={childElement.icon} size={18} />
                </div>

                <div className="label"> {childElement.title}</div>
              </NavLink>
            ) : (
              <div className="parent-block" key={childElement?.id}>
                <NavLink
                  // to={element?.path}
                  exact={0}
                  className={({ isActive }) =>
                    `nav-element ${
                      isActive &&
                      // (element?.children ? "active-with-child" : "active")
                      "active-with-child"
                    }`
                  }
                  onClick={(e) => {
                    e.preventDefault();
                    parentClickHandler(childElement);
                  }}
                >
                  {/* <div className="icon">
                          <element.icon />
                        </div> */}

                  <div className="label">{childElement?.title}</div>
                  {/* {element?.children && ( */}
                  <AiOutlinePlus
                    onClick={(e) => {
                      e.preventDefault();
                      openFolderCreateModal("parent", childElement);
                    }}
                  />
                  <div
                    className={`arrow-icon ${
                      openedBlock === childElement.id ? "open" : ""
                    }`}
                  >
                    <ExpandMoreIcon />
                  </div>
                  {/* )} */}
                </NavLink>
              </div>
            )
          )}
        </div>
      </Collapse>
    </>
  );
};

export default ChildBlock;
