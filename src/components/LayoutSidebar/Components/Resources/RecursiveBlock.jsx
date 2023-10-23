import {Box, Button} from "@mui/material";
import IconGenerator from "../../../IconPicker/IconGenerator";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import {useNavigate, useParams} from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import {updateLevel} from "../../../../utils/level";
import {useQueryClient} from "react-query";

const RecursiveBlock = ({
  element,
  selected,
  menuStyle,
  level,
  clickHandler,
  childBlockVisible,
  deleteResource,
  setSubMenuIsOpen,
  deleteResourceV2,
  resourceType,
}) => {
  const {tableSlug} = useParams();
  const navigate = useNavigate();

  const activeStyle = {
    backgroundColor:
      selected?.id === element?.id
        ? menuStyle?.active_background || "#007AFF"
        : menuStyle?.background,
    color:
      selected?.id === element?.id
        ? menuStyle?.active_text || "#fff"
        : menuStyle?.text,
    paddingLeft: updateLevel(level),
    display:
      element.id === "0" ||
      (element.id === "c57eedc3-a954-4262-a0af-376c65b5a284" && "none"),
  };

  return (
    <Box>
      <div className="parent-block column-drag-handle" key={element.id}>
        {element?.type === "REST" ? (
          <Button
            key={element.id}
            style={activeStyle}
            className={`nav-element ${
              element.isChild &&
              (tableSlug !== element.slug ? "active-with-child" : "active")
            }`}
            onClick={(e) => {
              e.stopPropagation();
              setSubMenuIsOpen(false);
              navigate(`/main/resources/${element?.id}`, {
                state: {
                  type: element?.type,
                },
              });
            }}
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
              {element?.title ?? element?.name}
            </div>
            <Box
              onClick={(e) => {
                e.stopPropagation();
                deleteResourceV2({
                  id: element?.id,
                });
              }}
              sx={{cursor: "pointer"}}
            >
              <DeleteIcon />
            </Box>
          </Button>
        ) : (
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
              onClick={() => navigate(`/main/resources/${element?.id}`)}
            >
              <IconGenerator icon={element?.icon} size={18} />
              {element?.title ?? element?.name}
            </div>
            <Box
              onClick={(e) => {
                e.stopPropagation();
                deleteResource({
                  id: element?.id,
                });
              }}
              sx={{cursor: "pointer"}}
            >
              <DeleteIcon />
            </Box>
            {element.type === "FOLDER" && (
              <Box className="icon_group">
                <Tooltip title="Resource settings" placement="top">
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
            {element.type === "DAG" && (
              <Box className="icon_group">
                <Tooltip title="Resource settings" placement="top">
                  <Box className="extra_icon">
                    <BsThreeDots
                      size={13}
                      onClick={(e) => {
                        e?.stopPropagation();
                        handleOpenNotify(e, "DAG");
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
            {element.type === "FOLDER" &&
              (childBlockVisible ? (
                <KeyboardArrowDownIcon />
              ) : (
                <KeyboardArrowRightIcon />
              ))}
          </Button>
        )}
      </div>
    </Box>
  );
};

export default RecursiveBlock;
