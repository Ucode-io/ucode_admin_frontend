import clsx from 'clsx'
import { useSelector } from 'react-redux'
import { selectThemeMode } from '../../../../store/theme/theme.slice'
import cls from './styles.module.scss'

const darkColors = {
  bgInput: "#252525",
  textPrimary: "#ffffffcf",
  textSecondary: "#ffffff71",
  border: "#ffffff29",
};

export const Field = ({
  placeholder = "",
  register = () => {},
  name = "name",
  rules = {},
  className = "",
  label = "",
  isDark: isDarkProp,
  ...props
}) => {
  const themeMode = useSelector(selectThemeMode);
  const isDark = isDarkProp !== undefined ? isDarkProp : themeMode === "dark";
  
  const fieldStyle = isDark ? {
    backgroundColor: darkColors.bgInput,
    borderColor: darkColors.border,
    color: darkColors.textPrimary,
  } : {};
  
  const labelStyle = isDark ? {
    color: darkColors.textSecondary,
  } : {};

  return <label className={cls.wrapper}>
    {label && <span className={cls.label} style={labelStyle}>{label}</span>}
    <input
      className={clsx(cls.field, className)}
      {...register(name, {...rules})}
      placeholder={placeholder}
      style={fieldStyle}
      {...props}
    />
  </label>
}
