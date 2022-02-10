import React from "react"
import { hundredsDivider } from "../../helpers/hundredsDivider"
import cls from "./Tooltip.module.scss"

export default function PieChartTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    return (
      <div className={cls.customTooltip}>
        {payload.map((item, index) => (
          <div className={cls.content} key={index + item.payload.name}>
            <div className={cls.itemTooltip}>
              {/* <span
                style={{
                  background: `linear-gradient(180deg, ${gradients[index]?.from} 0%, ${gradients[index]?.to} 100%)`,
                }}
              />{" "} */}
              <p>{item.name}</p>
            </div>
            <span className={cls.value}>{hundredsDivider(item.value)}</span>
          </div>
        ))}
      </div>
    )
  }
  return null
}
