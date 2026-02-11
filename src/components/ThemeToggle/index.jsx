import { useDispatch, useSelector } from "react-redux";
import { IconButton, Tooltip } from "@mui/material";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { toggleTheme, selectThemeMode } from "../../store/theme/theme.slice";

const ThemeToggle = () => {
  const dispatch = useDispatch();
  const themeMode = useSelector(selectThemeMode);
  const isDark = themeMode === "dark";

  const handleToggle = () => {
    dispatch(toggleTheme());
  };

  return (
    <Tooltip title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}>
      <IconButton
        onClick={handleToggle}
        sx={{
          color: "inherit",
          "&:hover": {
            backgroundColor: "action.hover",
          },
        }}
      >
        {isDark ? <LightModeIcon /> : <DarkModeIcon />}
      </IconButton>
    </Tooltip>
  );
};

export default ThemeToggle;
