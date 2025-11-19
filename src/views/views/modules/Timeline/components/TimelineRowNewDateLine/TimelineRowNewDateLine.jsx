import ArrowRightAltRoundedIcon from "@mui/icons-material/ArrowRightAltRounded";
import { addDays, format } from 'date-fns';
import cls from './styles.module.scss';

export const TimelineRowNewDateLine = ({left, width, onClick, hoveredDate, label, ...props}) => {
  return <span
  className={cls.timelineRecursiveRowLine}
  style={{ left: left, width: `${width}px` }}
  onClick={onClick}
  {...props}
>
  {hoveredDate && (
    <span className={cls.timelineRecursiveRowHint}>
      {format(new Date(hoveredDate), "LLLL-dd")}
      <ArrowRightAltRoundedIcon />
      {format(addDays(new Date(hoveredDate), 5), "LLLL-dd")}
    </span>
  )}
  {label}
</span>
}
