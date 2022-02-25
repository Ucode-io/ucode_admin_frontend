import {
  ResponsiveContainer,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Area,
  Tooltip,
} from "recharts";
import Card from "components/Card";
import { chartColors } from "config/defaultSettings";

const YearlyStatistics = ({ data }) => {
  return (
    <Card title="Статистика за год">
      <ResponsiveContainer width="100%" height={310}>
        <AreaChart
          width={730}
          height={250}
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorДоставка" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor={chartColors.stopColor}
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor={chartColors.stopColor}
                stopOpacity={0}
              />
            </linearGradient>
            <linearGradient id="colorСамовызов" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor={chartColors.stopColor}
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor={chartColors.stopColor}
                stopOpacity={0}
              />
            </linearGradient>
            <linearGradient id="colorОтмененны" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor={chartColors.stopColor}
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor={chartColors.stopColor}
                stopOpacity={0}
              />
            </linearGradient>
            <linearGradient
              id="colorПовторноОформленные"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="5%"
                stopColor={chartColors.stopColor}
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor={chartColors.stopColor}
                stopOpacity={0}
              />
            </linearGradient>
            <linearGradient id="colorИтого" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor={chartColors.stopColor}
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor={chartColors.stopColor}
                stopOpacity={0}
              />
            </linearGradient>
          </defs>
          <XAxis dataKey="name" />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="Доставка"
            stroke={chartColors.blue}
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorДоставка)"
          />
          <Area
            type="monotone"
            dataKey="Самовызов"
            stroke={chartColors.green}
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorСамовызов)"
          />
          <Area
            type="monotone"
            dataKey="Отмененны"
            stroke={chartColors.red}
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorОтмененны)"
          />
          <Area
            type="monotone"
            dataKey="Повторно оформленные"
            stroke={chartColors.aquamarine}
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorПовторноОформленные)"
          />
          <Area
            type="monotone"
            dataKey="Итого"
            stroke={chartColors.yellow}
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorИтого)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default YearlyStatistics;
