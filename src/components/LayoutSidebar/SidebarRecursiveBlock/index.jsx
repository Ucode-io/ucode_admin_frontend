import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { AiOutlinePlus } from "react-icons/ai";
import { NavLink } from "react-router-dom";
import "../style.scss";
import { Collapse } from "@mui/material";
import IconGenerator from "../../IconPicker/IconGenerator";
import ChildBlock from "../ChildBlock";

const SidebarRecursiveBlock = ({
  element,
  parentClickHandler,
  openedBlock,
  openFolderCreateModal,
  hasNestedLevel,
}) => {
  return (
    <>
      {!element.isChild && (
        <div className="parent-block" key={element?.id}>
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
              parentClickHandler(element);
            }}
          >
            <div className="label">{element?.title}</div>
            {/* {element?.children && ( */}
            <AiOutlinePlus
              onClick={(e) => {
                e.preventDefault();
                openFolderCreateModal("parent", element);
              }}
            />
            <div
              className={`arrow-icon ${
                openedBlock === element?.id ? "open" : ""
              }`}
            >
              <ExpandMoreIcon />
            </div>
            {/* )} */}
          </NavLink>

          {element?.children && (
            <ChildBlock
              element={element}
              isVisible={openedBlock === element.id}
              openFolderCreateModal={openFolderCreateModal}
              openedBlock={openedBlock}
              parentClickHandler={parentClickHandler}
            />
          )}
        </div>
      )}
    </>
  );
};

export default SidebarRecursiveBlock;
