import { useWatch } from "react-hook-form"
import BarChartAttributes from "./BarChartAttributes"
import CardAttributes from "./CardAttributes"
import FunnelChartAttributes from "./FunnelChartAttributes"
import LineChartAttributes from "./LineChartAttributes"
import PieChartAttributes from "./PieChartAttributes"
import TableAttributes from "./TableAttributes"

const PanelAttributes = ({ form, columns }) => {
  const type = useWatch({
    control: form.control,
    name: "attributes.type",
  })

  switch (type) {
    case "BAR_CHART":
      return <BarChartAttributes control={form.control} columns={columns} />

    case "PIE_CHART":
      return <PieChartAttributes control={form.control} columns={columns} />

    case "FUNNEL_CHART":
      return <FunnelChartAttributes control={form.control} columns={columns} />

    case "LINE_CHART":
      return <LineChartAttributes control={form.control} columns={columns} />

    case "CARD":
      return <CardAttributes control={form.control} columns={columns} />

    case "TABLE":
      return <TableAttributes control={form.control} />

    default:
      return null
  }
}

export default PanelAttributes
