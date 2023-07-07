import { Button } from "@mui/material";
import "./style.scss";

const MenuButtonComponent = ({
  onClick,
  title,
  icon,
  children,
  sidebarIsOpen,
  style,
}) => {
  return (
    <Button
      className="menu-button active-with-child"
      onClick={onClick}
      style={style}
    >
      {children}
      <div
        className={sidebarIsOpen ? `open-label` : "label"}
        style={{
          color: "#000",
        }}
      >
        {icon}
        {sidebarIsOpen && title}
      </div>
    </Button>
  );
};

export default MenuButtonComponent;
