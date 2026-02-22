import "../FormElements-backup/style.scss";
import { useSelector } from "react-redux";
import { selectThemeMode } from "../../store/theme/theme.slice";

const darkColors = {
  textPrimary: "#ffffffcf",
  textSecondary: "#ffffff71",
};

const FRow = ({
  label = "",
  children,
  position = "vertical",
  componentClassName = "",
  required = false,
  extra,
  classname,
  ...props
}) => {
  const themeMode = useSelector(selectThemeMode);
  const isDark = themeMode === "dark";
  
  const labelStyle = isDark ? { color: darkColors.textPrimary } : {};

  return (
    <div className={`FRow ${position}`} {...props}>
      <div className="desc">
        <div className={`label ${classname}`} style={labelStyle}>
          {required && <span className="requiredStart">*</span>}{" "}
          {label && label + ":"}
        </div>
        <div className="extra">{extra}</div>
      </div>
      <div className={`component ${componentClassName}`}>{children}</div>
    </div>
  );
};

export default FRow;
