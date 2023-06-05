import { Button } from "@mui/material";
import "./style.scss";

const MenuButton = ({ onClick, title, icon, children, sidebarIsOpen }) => {
  return (
    <Button className="menu-button active-with-child" onClick={onClick}>
      {children}
      <div className="label">
        {icon}
        {sidebarIsOpen && title}
      </div>
    </Button>
  );
};

export default MenuButton;
