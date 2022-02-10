import moment from "moment"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts"
import Card from "../../../components/Card"
import RangePicker from "../../../components/DatePicker/RangePicker"
import BarChartLegend from "../../../components/Legend/Legend"
import MultiSelect from "../../../components/Select/MultiSelect"
import { gradients } from "../../../constants/gradients"
import TooltipBarChart from "../../../components/Tooltip/Tooltip"

const data = [
  {
    name: "Toshkent",
    active: 1398,
    rejected: 2210,
    auction: 4000,
  },
  {
    name: "Toshkent sh",
    active: 1232,
    rejected: 2210,
    auction: 4000,
  },
  {
    name: "Buxoro",
    active: 2344,
    rejected: 2210,
    auction: 4000,
  },
  {
    name: "Navoiy",
    active: 8243,
    rejected: 2210,
    auction: 4000,
  },
  {
    name: "Samarqand",
    active: 7234,
    rejected: 2210,
    auction: 4000,
  },
  {
    name: "Jizzax",
    active: 9234,
    rejected: 2210,
    auction: 4000,
  },
  {
    name: "Sirdaryo",
    active: 3123,
    rejected: 2210,
    auction: 4000,
  },
  {
    name: "Xorazm",
    active: 1233,
    rejected: 2210,
    auction: 4000,
  },
  {
    name: "Namangan",
    active: 1234,
    rejected: 2210,
    auction: 4000,
  },
  {
    name: "Farg`ona",
    active: 4234,
    rejected: 2210,
    auction: 4000,
  },
  {
    name: "Andijon",
    active: 4232,
    rejected: 2210,
    auction: 4000,
  },
  {
    name: "Qashqadaryo",
    active: 4123,
    rejected: 2210,
    auction: 4000,
  },
]

const keys = [
  {
    datakey: "active",
    name: "Barcha faol yer uchastkalari",
  },
  {
    datakey: "rejected",
    name: "Rad qilingan",
  },
  {
    datakey: "auction",
    name: "Auksionda",
  },
]

const StatisticsBarChart = () => {
  const { t } = useTranslation()
  const [loader, setLoader] = useState(false)
  const [selectedCities, setSelectedCities] = useState([])
  const [selectedDates, setSelectedDates] = useState([null, null])

  return (
    <Card
      className=""
      title="Hududlar bo'yicha statistika"
      extra={
        <div className="flex space-x-2 w-full">
          <MultiSelect
            placeholder={t("region.area")}
            style={{ minWidth: "200px" }}
            onChange={(value) => setSelectedCities(value)}
            value={selectedCities}
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
      <ResponsiveContainer width="100%" height={410}>
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 0,
            left: -15,
            bottom: 5,
          }}
        >
          <defs>
            {gradients.map((el) => (
              <linearGradient id={el.name} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={el.from} />
                <stop offset="100%" stopColor={el.to} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid
            stroke="rgba(0, 0, 0, 0.4)"
            vertical={false}
            horizontal={false}
          />
          <XAxis
            dataKey="name"
            style={{ fontWeight: "600", fontSize: "14px", lineHeight: "24px" }}
            dy={5}
          />
          <YAxis
            tickCount={15}
            textAnchor="end"
            style={{ fontWeight: "600", fontSize: "12px", lineHeight: "24px" }}
          />
          <Tooltip content={<TooltipBarChart keys={keys} />} />
          <Legend content={<BarChartLegend keys={keys} />} />
          {keys.map((data, index) => (
            <Bar
              barSize={15}
              dataKey={data.datakey}
              fill={`url(#${gradients[index]?.name})`}
              barCategoryGap="20%"
              name={data.name}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
      <TooltipBarChart />
    </Card>
  )
}

export default StatisticsBarChart
