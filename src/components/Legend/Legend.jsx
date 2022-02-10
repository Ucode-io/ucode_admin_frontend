import React from "react"
import { gradients } from "../../constants/gradients"
import cls from "./Legend.module.scss"

export default function BarChartLegend(props) {
  const { payload } = props

  return (
    <div className={cls.customLegend}>
      <div className={cls.legendItem}>
        <div className={cls.legends}>
          {payload.map((entry, index) => (
            <span key={`item-${index}`} className={cls.item}>
              <span
                className={cls.circle}
                style={{
                  background: `linear-gradient(180deg, ${gradients[index]?.from} 0%, ${gradients[index]?.to} 100%)`,
                }}
              />
              {entry.value}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
