import { useWatch } from "react-hook-form"
import BarChartAttributes from "./BarChartAttributes"
import PieChartAttributes from "./PieChartAttributes"
import TableAttributes from "./TableAttributes"

const PanelAttributes = ({ form }) => {
  const type = useWatch({
    control: form.control,
    name: "attributes.type",
  })

  switch (type) {
    case "BAR_CHART":
      return <BarChartAttributes control={form.control} />

      case "PIE_CHART":
        return <PieChartAttributes control={form.control} />
  

    case "TABLE":
      return <TableAttributes control={form.control} />

    default:
      return null
  }
}

export default PanelAttributes
