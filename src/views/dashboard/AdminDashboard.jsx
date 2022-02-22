import { Box } from "@material-ui/core";
import MonthlyStatistics from "./charts/MonthlyStatistics";
import YearlyStatistics from "./charts/YearlyStatistics";

export default function AdminDashboard() {
  return (
    <>
      <Box mb={2.5} />
      <MonthlyStatistics />
      <Box mb={2.5} />
      <YearlyStatistics />
    </>
  );
}
