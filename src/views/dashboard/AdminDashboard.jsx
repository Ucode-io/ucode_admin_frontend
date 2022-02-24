import { useMemo } from "react";
import { Box } from "@material-ui/core";
import MonthlyStatistics from "./charts/MonthlyStatistics";
import YearlyStatistics from "./charts/YearlyStatistics";

export default function AdminDashboard({ statistics }) {
  const [monthlyStatistics, yearlyStatistics] = useMemo(() => {
    var monthly = statistics.monthly_orders_reports?.map(
      ({
        day,
        delivery_orders_count,
        self_pickup_orders_count,
        canceled_orders_count,
        reissued_orders_count,
        finished_orders_count,
      }) => {
        return {
          name: day,
          Доставка: delivery_orders_count,
          Самовызов: self_pickup_orders_count,
          Отмененны: canceled_orders_count,
          "Повторно оформленные": reissued_orders_count,
          Итого: finished_orders_count,
        };
      },
    );
    var yearly = statistics.yearly_orders_reports?.map(
      ({
        day,
        delivery_orders_count,
        self_pickup_orders_count,
        canceled_orders_count,
        reissued_orders_count,
        finished_orders_count,
      }) => {
        return {
          name: day,
          Доставка: delivery_orders_count,
          Самовызов: self_pickup_orders_count,
          Отмененны: canceled_orders_count,
          "Повторно оформленные": reissued_orders_count,
          Итого: finished_orders_count,
        };
      },
    );
    return [monthly, yearly];
  }, [statistics]);

  return (
    <>
      <Box mb={2.5} />
      <MonthlyStatistics data={monthlyStatistics} />
      <Box mb={2.5} />
      <YearlyStatistics data={yearlyStatistics} />
    </>
  );
}
