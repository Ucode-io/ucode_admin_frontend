import AddIcon from "@mui/icons-material/Add";
import { Box, Button, Tooltip } from "@mui/material";
import { BsThreeDots } from "react-icons/bs";
import { useNavigate, useParams } from "react-router-dom";
import "./style.scss";

const MenuButton = ({ openFolderCreateModal }) => {
  const { tableSlug } = useParams();
  const navigate = useNavigate();

  return (
    <Button
      className="menu-button active-with-child"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        openFolderCreateModal("create");
      }}
    >
      <div className="label">
        <AddIcon />
        Create folder
      </div>
      <Box className="icon_group">
        {/* <Tooltip title="Folder settings" placement="top">
          <Box className="extra_icon">
            <BsThreeDots
              size={13}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              style={{
                color: environment?.data?.color,
              }}
            />
          </Box>
        </Tooltip>
        <Tooltip title="Create folder" placement="top">
          <Box className="extra_icon">
            <AddIcon
              size={13}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                openFolderCreateModal("parent", element);
              }}
              style={{
                color: environment?.data?.color,
              }}
            />
          </Box>
        </Tooltip> */}
      </Box>
    </Button>
  );
};

export default MenuButton;
