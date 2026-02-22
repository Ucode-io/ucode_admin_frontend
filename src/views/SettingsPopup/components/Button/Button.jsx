import clsx from 'clsx'
import { useSelector } from 'react-redux'
import { selectThemeMode } from '../../../../store/theme/theme.slice'
import cls from './styles.module.scss'

const darkColors = {
  bgSecondary: "#202020",
  bgHover: "#363636",
  textPrimary: "#ffffffcf",
  border: "#ffffff29",
  primary: "#2383e2",
};

export const Button = ({ children, className, primary, loading, ...props }) => {
  const themeMode = useSelector(selectThemeMode);
  const isDark = themeMode === "dark";
  
  const darkStyle = isDark && !primary ? {
    backgroundColor: darkColors.bgSecondary,
    borderColor: darkColors.border,
    color: darkColors.textPrimary,
  } : {};

  return (
    <button 
      className={clsx(cls.button, className, { [cls.primary]: primary, [cls.loading]: loading, [cls.dark]: isDark && !primary })} 
      style={darkStyle}
      {...props}
    >
      {children}
    </button>
  );
}
