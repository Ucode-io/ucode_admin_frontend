import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import cls from "./styles.module.scss"
import clsx from 'clsx';

export const BackButton = ({ onClick, className, ...props }) => {

  return <button className={clsx(cls.backButton, className)} {...props} onClick={onClick}>
    <ArrowBackIcon width="32px" height="32px" />
  </button>
}
