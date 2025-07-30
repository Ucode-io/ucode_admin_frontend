import cls from './styles.module.scss'
import { Box } from "@mui/material"

export const FieldMenuItem = ({
  title,
  value,
  icon,
  onClick,
  content,
  isOpen = false,
}) => {
  return (
    <Box className={cls.item} onClick={onClick}>
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
      {content && isOpen && <Box className={cls.content}>{content}</Box>}
    </Box>
  );
};
