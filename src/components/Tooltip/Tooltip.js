import React from "react"
import { gradients } from "../../constants/gradients"
import cls from "./Tooltip.module.scss"

export default function TooltipBarChart({ active, payload }) {
  if (active && payload && payload.length) {
    return (
      <div className={cls.customTooltip}>
        <p className={cls.title}>{payload.name}</p>
        {payload.map((item, index) => (
          <div className={cls.content} key={index + item.payload.name}>
            <div className={cls.itemTooltip}>
              <span
                style={{
                  background: `linear-gradient(180deg, ${gradients[index]?.from} 0%, ${gradients[index]?.to} 100%)`,
                }}
              />{" "}
              <p>{item.name}</p>
            </div>
            <span className={cls.value}>{item.payload[item.dataKey]}</span>
          </div>
        ))}
      </div>
    )
  }
  return null
}
