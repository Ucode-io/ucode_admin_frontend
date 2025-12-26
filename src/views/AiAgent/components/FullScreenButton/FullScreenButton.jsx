import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';
import cls from "./styles.module.scss"
import clsx from 'clsx';

export const FullScreenButton = ({ onClick, className, opened, ...props }) => {

  return <button className={clsx(cls.fullScreenBtn, className)} {...props} onClick={onClick}>
    {
      opened ? <CloseFullscreenIcon width="32px" height="32px" /> : <OpenInFullIcon width="32px" height="32px" />
    }
  </button>
}
