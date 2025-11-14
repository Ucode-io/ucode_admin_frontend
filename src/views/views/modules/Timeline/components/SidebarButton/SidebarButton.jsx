import clsx from "clsx";
import cls from "./styles.module.scss";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";

export const SidebarButton = ({ onClick, variant = "closer", className, ...props }) => {

  return <button 
      className={clsx(cls.sidebarBtn, className, { [cls.rotated]: variant === "opener" })} 
      onClick={onClick}
      {...props}
    >
    <span className={cls.sidebarBtnInner}>
      <KeyboardDoubleArrowLeftIcon
        fontSize="medium"
        color="inherit"
      />
    </span>
</button>
}