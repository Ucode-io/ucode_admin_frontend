import { ArrowBackIcon } from '@chakra-ui/icons'
import { useSelector } from 'react-redux'
import { selectThemeMode } from '../../../../store/theme/theme.slice'
import cls from './styles.module.scss'

const darkColors = {
  textPrimary: "#ffffffcf",
  textSecondary: "#ffffff71",
  border: "#ffffff14",
  iconColor: "#9b9b9b",
};

export const ContentTitle = ({
  children,
  subtitle,
  withBackBtn,
  onBackClick,
  style,
  ...props
}) => {
  const themeMode = useSelector(selectThemeMode);
  const isDark = themeMode === "dark";
  
  const titleStyle = {
    color: isDark ? darkColors.textPrimary : "rgb(55, 53, 47)",
    ...style,
  };
  
  const subtitleStyle = {
    color: isDark ? darkColors.textSecondary : "rgb(120, 119, 116)",
  };
  
  const wrapperStyle = {
    borderBottomColor: isDark ? darkColors.border : "rgba(55, 53, 47, 0.09)",
    ...style,
  };
  
  const iconStyle = {
    color: isDark ? darkColors.iconColor : "inherit",
  };

  if (subtitle) {
    return (
      <div className={cls.wrapper} style={wrapperStyle} {...props}>
        {(withBackBtn || onBackClick) && (
          <button className={cls.btn} type="button" onClick={onBackClick}>
            <ArrowBackIcon style={iconStyle} />
          </button>
        )}
        <h3 className={cls.title} style={titleStyle}>
          {children}
          <p className={cls.subtitle} style={subtitleStyle}>{subtitle}</p>
        </h3>
      </div>
    );
  }

  return (
    <div className={cls.wrapper} style={wrapperStyle} {...props}>
      {(withBackBtn || onBackClick) && (
        <button className={cls.btn} type="button" onClick={onBackClick}>
          <ArrowBackIcon style={iconStyle} />
        </button>
      )}
      <h3 className={cls.title} style={titleStyle}>{children}</h3>
    </div>
  );
};
