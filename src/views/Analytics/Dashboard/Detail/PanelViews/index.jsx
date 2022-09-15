import { useWatch } from "react-hook-form"
import DataTable from "../../../../../components/DataTable"
import BarChart from "./BarChart"
import PieChart from "./PieChart"

const PanelViews = ({ control, isLoading, data, columns }) => {
  const type = useWatch({
    control,
    name: "attributes.type",
  })
  
  switch (type) {
    case "BAR_CHART":
      return <BarChart />

    case "PIE_CHART":
      return <PieChart />

    default:
      return (
        <DataTable
          loader={isLoading}
          data={data?.rows}
          columns={columns}
          disablePagination
          removableHeight={420}
          disableFilters
          wrapperStyle={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            padding: 10,
            // minHeight: "100px",
          }}
          // tableStyle={{ flex: 1 }}
        />
      )
  }
}

export default PanelViews
