import hundredsDivider from "../../helpers/hundredsDivider";
import cls from "./Tooltip.module.scss";

export default function PieChartTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    return (
      <div className={cls.customTooltip}>
        {payload.map((item, index) => (
          <div className={cls.content} key={index + item.payload.name}>
            <div className={cls.itemTooltip}>
              <p>{item.name}</p>
            </div>
            <span className={cls.value}>{hundredsDivider(item.value)}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
}
