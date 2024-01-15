import { Box, Button, Tooltip } from "@mui/material";
import IconGenerator from "../../../IconPicker/IconGenerator";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useNavigate, useParams } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import { updateLevel } from "../../../../utils/level";
import { BsThreeDots } from "react-icons/bs";

const RecursiveBlock = ({
  element,
  level,
  clickHandler,
  childBlockVisible,
  deleteResource,
  setSubMenuIsOpen,
  deleteResourceV2,
  handleOpenNotify,
}) => {
  const { tableSlug } = useParams();
  const navigate = useNavigate();

  const activeStyle = {
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
              navigate(`/main/resources/${element?.id}/${element.type}`, {
                state: {
                  type: element?.type,
                },
              });
            }}
          >
            <div className="label">
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
              sx={{ cursor: "pointer" }}
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
              onClick={() =>
                navigate(`/main/resources/${element?.id}/${element.type}`)
              }
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
              sx={{ cursor: "pointer" }}
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
