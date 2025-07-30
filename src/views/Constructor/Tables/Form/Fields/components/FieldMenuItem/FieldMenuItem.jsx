import cls from './styles.module.scss'
import { useEffect } from "react";
import { Box } from "@mui/material";

export const FieldMenuItem = ({
  title,
  value,
  icon,
  content,
  id,
  isOpen,
  setActiveId = () => {},
  onClick = () => {},
}) => {
  const handleClick = (e) => {
    onClick();
    if (content) {
      setActiveId(isOpen ? null : id);
    }
  };

  const onWindowClick = (e) => {
    if (e.target.closest(`.${cls.content}`)) return;
    if (isOpen) setActiveId(null);
  };

  useEffect(() => {
    window.addEventListener("click", onWindowClick);
    return () => window.removeEventListener("click", onWindowClick);
  }, []);

  return (
    <Box>
      <Box className={cls.item} onClick={handleClick}>
        <Box display="flex" alignItems="center" columnGap="9px">
          {icon}
          <p className={cls.title}>{title}</p>
        </Box>
        <Box display="flex" alignItems="center" columnGap="4px">
          {value && <p className={cls.value}>{value}</p>}
          <span className={cls.arrow} type="button">
            <svg
              width="10"
              height="6"
              viewBox="0 0 10 6"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 1L5 5L9 1"
                stroke="#D0D5DD"
                stroke-width="1.3"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </span>
        </Box>
      </Box>
      {content && isOpen && <Box className={cls.content}>{content}</Box>}
    </Box>
  );
};
