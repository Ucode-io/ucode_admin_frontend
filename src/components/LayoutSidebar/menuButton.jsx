import { Button } from "@mui/material";
import "./style.scss";

const MenuButton = ({ onClick, title, icon }) => {
  return (
    <Button className="menu-button active-with-child" onClick={onClick}>
      <div className="label">
        {icon}
        {title}
      </div>
    </Button>
  );
};

export default MenuButton;
