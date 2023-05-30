import { Button } from "@mui/material";
import "./style.scss";

const MenuButton = ({ onClick, title, icon, children }) => {
  return (
    <Button className="menu-button active-with-child" onClick={onClick}>
      {children}
      <div className="label">
        {icon}
        {title}
      </div>
    </Button>
  );
};

export default MenuButton;
