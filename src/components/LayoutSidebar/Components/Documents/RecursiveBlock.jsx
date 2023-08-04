import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { Box, Button, Collapse, Tooltip } from "@mui/material";
import { useState } from "react";
import { useParams } from "react-router-dom";
import IconGenerator from "../../../IconPicker/IconGenerator";
import "../../style.scss";
import { menuActions } from "../../../../store/menuItem/menuItem.slice";
import { useDispatch } from "react-redux";
import { BsThreeDots } from "react-icons/bs";

const DocumentsRecursive = ({
  element,
  level = 1,
  menuStyle,
  onSelect = () => {},
  onRowClick = () => {},
  selected,
  handleOpenNotify,
}) => {
  const dispatch = useDispatch();
  const { tableSlug } = useParams();
  const [childBlockVisible, setChildBlockVisible] = useState(false);

  const activeStyle = {
    backgroundColor:
      selected?.id === element?.id
        ? menuStyle?.active_background || "#007AFF"
        : menuStyle?.background,
    color:
      selected?.id === element?.id
        ? menuStyle?.active_text || "#fff"
        : menuStyle?.text,
    paddingLeft: level * 2 * 5,
    display:
      element.id === "0" ||
      (element.id === "c57eedc3-a954-4262-a0af-376c65b5a284" && "none"),
  };

  const clickHandler = () => {
    onRowClick(element.id, element);
    dispatch(menuActions.setMenuItem(element));
    setChildBlockVisible((prev) => !prev);
    if (!element.children) onSelect(element.id, element);
  };
  console.log("element.what_is", element.what_is);
  return (
    <Box>
      <div className="parent-block column-drag-handle" key={element.id}>
        <Button
          key={element.id}
          style={activeStyle}
          className={`nav-element ${
            element.isChild &&
            (tableSlug !== element.slug ? "active-with-child" : "active")
          }`}
          onClick={clickHandler}
        >
          <div
            className="label"
            style={{
              color:
                selected?.id === element?.id
                  ? menuStyle?.active_text
                  : menuStyle?.text,
              opacity: element?.isChild && 0.6,
            }}
          >
            <IconGenerator icon={element?.icon} size={18} />
            {element?.name}
          </div>
          {element.what_is === "note" && (
            <Box className="icon_group">
              <Tooltip title="Scenario settings" placement="top">
                <Box className="extra_icon">
                  <BsThreeDots
                    size={13}
                    onClick={(e) => {
                      e?.stopPropagation();
                      handleOpenNotify(e, "FOLDER");
                    }}
                    style={{
                      color:
                        selected?.id === element?.id
                          ? menuStyle?.active_text
                          : menuStyle?.text || "",
                    }}
                  />
                </Box>
              </Tooltip>
            </Box>
          )}
          {element.buttons && (
            <Box className="icon_group">
              <Tooltip title={element?.button_text} placement="top">
                <Box className="extra_icon">{element.buttons}</Box>
              </Tooltip>
            </Box>
          )}
          {element.type === "FOLDER" &&
            (childBlockVisible ? (
              <KeyboardArrowDownIcon />
            ) : (
              <KeyboardArrowRightIcon />
            ))}
        </Button>
      </div>

      <Collapse in={childBlockVisible} unmountOnExit>
        {element?.children?.map((childElement) => (
          <DocumentsRecursive
            key={childElement.id}
            level={level + 1}
            element={childElement}
            menuStyle={menuStyle}
            onSelect={onSelect}
            onRowClick={onRowClick}
            selected={selected}
            handleOpenNotify={handleOpenNotify}
          />
        ))}
      </Collapse>
    </Box>
  );
};

export default DocumentsRecursive;
