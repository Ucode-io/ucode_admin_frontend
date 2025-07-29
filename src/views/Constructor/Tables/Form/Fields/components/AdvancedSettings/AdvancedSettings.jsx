import { CloseButton } from '../CloseButton'
import cls from './styles.module.scss'
import { Box } from "@mui/material"

export const AdvancedSettings = ({title, onClose, onBackClick = () => {}, children }) => {
  return <Box>
    <Box display="flex" justifyContent="space-between" alignItems="center" paddingBottom="8px">
      <Box display="flex" alignItems="center" columnGap="4px">
        <button className={cls.backBtn} onClick={onBackClick} type="button">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14.25 9H3.75M3.75 9L9 14.25M3.75 9L9 3.75" stroke="#C7C5C1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <p className={cls.title}>{title}</p>
      </Box>
      <CloseButton onClick={onClose} />
    </Box>
    <Box>
      {children}
    </Box>
  </Box>
}
