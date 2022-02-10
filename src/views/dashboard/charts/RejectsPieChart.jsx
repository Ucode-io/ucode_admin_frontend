/* eslint-disable no-unused-vars */
import moment from "moment"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Label,
  Tooltip,
} from "recharts"
import Card from "../../../components/Card"
import RangePicker from "../../../components/DatePicker/RangePicker"
import AutoComplate from "../../../components/Select/AutoComplate"
import { gradients } from "../../../constants/gradients"
import PieChartLabel from "./PieChartLabel"
import { hundredsDivider } from "../../../helpers/hundredsDivider"
import PieChartTooltip from "../../../components/Tooltip/PieChartTooltip"

const data = [
  {
    value: 832,
    percent: 72,
    name: "Respublika kadastr",
  },
  {
    value: 342,
    percent: 28,
    name: "Hokimiyat",
  },
  {
    value: 642,
    percent: 28,
    name: "Kengash",
  },
  {
    value: 522,
    percent: 28,
    name: "Ekologiya qo'mitasi",
  },
  {
    value: 732,
    percent: 28,
    name: "Boshqalar",
  },
]

const RejectsPieChart = () => {
  const { t } = useTranslation()
  const [loader, setLoader] = useState(false)
  const [selectedCityId, setSelectedCityId] = useState(null)
  const [selectedRegionId, setSelectedRegionId] = useState(null)
  const [selectedDates, setSelectedDates] = useState([null, null])

  const totalSum = data.reduce((total, item) => (total += item.value), 0)

  return (
    <Card
      title="Rad qilingan yer uchastkalari"
      filters={
        <div className="flex flex-wrap space-x-2 w-full">
          <AutoComplate
            placeholder={t("region.area")}
            style={{ minWidth: "160px" }}
            isClearable
            onChange={(val) => setSelectedCityId(val?.value?.id)}
          />
          <AutoComplate
            placeholder={t("region")}
            style={{ minWidth: "160px" }}
            url="/regions"
            onFetched={(res) => res.regions}
            isClearable
            params={selectedCityId}
            onChange={(val) => setSelectedRegionId(val?.value?.id)}
          />
          <RangePicker
            hideTimePicker
            placeholder="Sanani tanlang"
            onChange={(val) => {
              setSelectedDates(
                val.map((e) => (e ? moment(e).format("YYYY-MM-DD") : e))
              )
            }}
          />
        </div>
      }
    >
      <div className="flex justify-center">
        <ResponsiveContainer width="50%" height={310}>
          <PieChart>
            <defs>
              {gradients.map((el) => (
                <linearGradient id={el.name} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={el.from} />
                  <stop offset="100%" stopColor={el.to} />
                </linearGradient>
              ))}
            </defs>
            <Pie
              data={data}
              cx={130}
              cy={130}
              innerRadius={90}
              outerRadius={130}
              fill="#8884d8"
              paddingAngle={0}
              dataKey="value"
              startAngle={360}
              endAngle={0}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={`url(#${gradients[index]?.name})`}
                />
              ))}
              <Label
                width={30}
                position="center"
                content={
                  <PieChartLabel
                    value1={hundredsDivider(totalSum)}
                    value2="Rad qilinganlar"
                    fontSizeTop="24px"
                    fontSizeBottom="18px"
                    labelTopPosition={15}
                  />
                }
              ></Label>
            </Pie>
            <Tooltip
              content={<PieChartTooltip />}
              formatter={(label) => hundredsDivider(label)}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="w-full grid grid-cols-12 gap-4 box-border font-body px-8">
        {data.map((item, index) => (
          <div key={index} className="col-span-6 flex">
            <div
              className="w-3 h-3 mr-2 mt-1 rounded-full"
              style={{
                background: `linear-gradient(180deg, ${gradients[index]?.from} 0%, ${gradients[index]?.to} 100%)`,
              }}
            />
            <div className="font-semibold">
              <div className="text-base">{item.name}</div>
              <div
                className="text-sm"
                style={{ color: "#6E7C87" }}
              >{`${hundredsDivider(item.value)} (${item.percent}%)`}</div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

export default RejectsPieChart
