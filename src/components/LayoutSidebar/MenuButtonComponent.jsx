import { Button } from "@mui/material";
import "./style.scss";

const MenuButtonComponent = ({
  onClick,
  title,
  icon,
  children,
  sidebarIsOpen,
}) => {
  return (
    <Button className="menu-button active-with-child" onClick={onClick}>
      {children}
      <div className={sidebarIsOpen ? `open-label` : "label"}>
        {icon}
        {sidebarIsOpen && title}
      </div>
    </Button>
  );
};

export default MenuButtonComponent;
