import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { AiOutlinePlus } from "react-icons/ai";
import { TbReplace } from "react-icons/tb";
import { NavLink, useNavigate } from "react-router-dom";
import "../style.scss";
import { Box, Collapse } from "@mui/material";
import IconGenerator from "../../IconPicker/IconGenerator";
import { Container, Draggable } from "react-smooth-dnd";

const RecursiveBlock = ({
  index,
  element,
  parentClickHandler,
  openedBlock,
  openFolderCreateModal,
  //   hasNestedLevel,
  environment,
  childBlockVisible,
  onDrop,
  setFolderModalType,
  setSelectedTable,
}) => {
  const navigate = useNavigate();
  return (
    <>
      <Container
        lockAxis="y"
        onDrop={onDrop}
        dropPlaceholder={{ className: "drag-row-drop-preview" }}
        dragHandleSelector=".drag-handle"
      >
        <Draggable key={index}>
          <div className="parent-block" key={index}>
            <NavLink
              to={element?.isChild && element?.path}
              key={index}
              className={({ isActive }) =>
                `nav-element ${
                  isActive &&
                  element.isChild &&
                  (!openedBlock === element?.id
                    ? "active-with-child"
                    : "active")
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
                !element.isChild && parentClickHandler(element);
                element.isChild && navigate(element?.path);
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
                />
              )}
            </NavLink>
          </div>
          <Collapse in={openedBlock === element?.id} unmountOnExit>
            {element?.children?.map((childElement, index) => (
              <RecursiveBlock
                key={index}
                element={childElement}
                parentClickHandler={parentClickHandler}
                openedBlock={openedBlock}
                openFolderCreateModal={openFolderCreateModal}
                // hasNestedLevel={hasNestedLevel}
                environment={environment}
                childBlockVisible={childBlockVisible}
                onDrop={onDrop}
                setFolderModalType={setFolderModalType}
                setSelectedTable={setSelectedTable}
              />
            ))}
          </Collapse>
        </Draggable>
      </Container>
    </>
  );
};

export default RecursiveBlock;
