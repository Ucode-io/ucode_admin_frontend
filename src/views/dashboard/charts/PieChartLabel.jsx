import React from "react"

export default function PieChartLabel({
  viewBox,
  value1,
  value2,
  fontSizeTop = "27",
  fontSizeBottom = "20",
  labelTopPosition = 10,
  labelBottomPosition,
}) {
  const { cx, cy } = viewBox
  return (
    <>
      <text
        x={cx}
        y={cy - labelTopPosition}
        fill="#000000"
        className="recharts-label"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={fontSizeTop}
        fontWeight="700"
      >
        {value1}
      </text>
      <text
        x={cx}
        y={cy + (labelBottomPosition || labelTopPosition)}
        fill="#000000"
        className="recharts-label"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={fontSizeBottom}
        fontWeight="500"
      >
        {value2}
      </text>
    </>
  )
}
