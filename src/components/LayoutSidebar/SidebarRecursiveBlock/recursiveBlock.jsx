import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { AiOutlinePlus } from "react-icons/ai";
import { TbReplace } from "react-icons/tb";
import { NavLink, useNavigate } from "react-router-dom";
import "../style.scss";
import { Box, Collapse } from "@mui/material";
import IconGenerator from "../../IconPicker/IconGenerator";
import { Container, Draggable } from "react-smooth-dnd";
import { useState } from "react";

const RecursiveBlock = ({
  index,
  element,
  parentClickHandler,
  openedBlock,
  openFolderCreateModal,
  //   hasNestedLevel,
  environment,
  // childBlockVisible,
  onDrop,
  setFolderModalType,
  setSelectedTable,
}) => {
  const [childBlockVisible, setChildBlockVisible] = useState(false);
  const navigate = useNavigate();
  const clickHandler = () => {
    !element.isChild && parentClickHandler(element);
    setChildBlockVisible((prev) => !prev);
  };

  return (
    <>
      {/* <Container
        lockAxis="y"
        onDrop={onDrop}
        dropPlaceholder={{ className: "drag-row-drop-preview" }}
        dragHandleSelector=".drag-handle"
      >
        <Draggable key={index}> */}
      <div className="parent-block" key={index}>
        <NavLink
          to={element?.isChild && element?.path}
          key={index}
          className={({ isActive }) =>
            `nav-element ${
              isActive &&
              element.isChild &&
              (!openedBlock === element?.id ? "active-with-child" : "active")
            }`
          }
          style={({ isActive }) => ({
            backgroundColor:
              isActive &&
              element.isChild &&
              (!openedBlock === element?.id
                ? "active-with-child"
                : environment?.data?.active_background),
            color:
              isActive &&
              element.isChild &&
              (!openedBlock === element?.id
                ? "active-with-child"
                : environment?.data?.active_color),
          })}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            element.isChild && navigate(element?.path);
            clickHandler();
          }}
        >
          <div
            className="label"
            style={{
              color:
                !openedBlock === element?.id
                  ? environment?.data?.active_color
                  : environment?.data?.color,
              opacity: element?.isChild && 0.6,
            }}
          >
            <IconGenerator icon={element?.icon} size={18} />

            {element?.title}
          </div>
          {!element?.isChild && (
            <Box className="icon_group">
              <AiOutlinePlus
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  openFolderCreateModal("parent", element);
                }}
                size={13}
                style={{
                  color: environment?.data?.color,
                }}
              />
              <div
                className={`arrow-icon ${
                  openedBlock === element?.id ? "open" : ""
                }`}
                style={{
                  color: environment?.data?.color,
                }}
              >
                <ExpandMoreIcon />
              </div>
            </Box>
          )}
          {element?.isChild && (
            <TbReplace
              size={14}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                // setVisible(true);
                setFolderModalType("folder");
                setSelectedTable(element);
              }}
              style={{
                color: environment?.data?.color,
              }}
            />
          )}
        </NavLink>
      </div>
      <Collapse in={childBlockVisible} unmountOnExit>
        {element?.children?.map((childElement, index) => (
          <RecursiveBlock
            key={index}
            element={childElement}
            parentClickHandler={parentClickHandler}
            openedBlock={openedBlock}
            openFolderCreateModal={openFolderCreateModal}
            // hasNestedLevel={hasNestedLevel}
            environment={environment}
            onDrop={onDrop}
            setFolderModalType={setFolderModalType}
            setSelectedTable={setSelectedTable}
          />
        ))}
      </Collapse>
      {/* </Draggable>
      </Container> */}
    </>
  );
};

export default RecursiveBlock;
