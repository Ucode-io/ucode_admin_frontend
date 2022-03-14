import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Legend,
  Bar,
  Tooltip,
} from "recharts";
import Card from "components/Card";
import { chartColors } from "config/defaultSettings";

const MonthlyStatistics = ({ data }) => {
  return (
    <Card title="Ежемесячная статистика">
      <ResponsiveContainer width="100%" height={310}>
        <BarChart width={730} height={250} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Доставка" fill={chartColors.blue} />
          <Bar dataKey="Самовызов" fill={chartColors.green} />
          <Bar dataKey="Отмененны" fill={chartColors.red} />
          <Bar dataKey="Повторно оформленные" fill={chartColors.orange} />
          <Bar dataKey="Итого" fill={chartColors.purple} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default MonthlyStatistics;
