import { Box } from "@mui/material";
import "../style.scss";

const MenuBox = ({ onClick, title, icon, children, sidebarIsOpen, style }) => {
  return (
    <Box
      className="menu-button active-with-child"
      onClick={onClick}
      style={style}
    >
      {children}
      <div className={sidebarIsOpen ? `open-label` : "label"} style={style}>
        {icon}
        {sidebarIsOpen && title}
      </div>
    </Box>
  );
};

export default MenuBox;
