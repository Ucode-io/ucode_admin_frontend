import { Box, Tooltip } from "@mui/material";
import { BsThreeDots } from "react-icons/bs";
import "./style.scss";

const MenuIcon = ({ onClick, title }) => {
  return (
    <Tooltip title={title} placement="top">
      <Box className="icon_group">
        <Box className="extra_icon">
          <BsThreeDots size={13} onClick={onClick} />
        </Box>
      </Box>
    </Tooltip>
  );
};

export default MenuIcon;
