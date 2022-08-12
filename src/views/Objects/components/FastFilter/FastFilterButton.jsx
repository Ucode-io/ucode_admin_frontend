import { Close, FilterAlt } from "@mui/icons-material"
import { Typography } from "@mui/material"
import { useMemo } from "react"
import { useParams } from "react-router-dom"
import RectangleIconButton from "../../../../components/Buttons/RectangleIconButton"
import TableOrderingButton from "../../../../components/TableOrderingButton"
import useFilters from "../../../../hooks/useFilters"

const FastFilterButton = ({ view }) => {
  const { tableSlug } = useParams()

  const { filters, clearFilters, clearOrders } = useFilters(tableSlug, view.id)

  const selectedFiltersNumber = useMemo(() => {
    let count = 0
    Object.entries(filters).forEach(([key, value]) => {
      if (key !== "order" && value) count++
    })
    return count
  }, [filters])

  const selectedOrdersNumber = useMemo(() => {
    const orders = filters.order ?? {}
    return Object.values(orders)?.filter((el) => el)?.length
  }, [filters])

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <RectangleIconButton
        color="white"
        size={!!selectedFiltersNumber ? "long" : ""}
      >
        <FilterAlt color={!!selectedFiltersNumber ? "primary" : ""} />

        {!!selectedFiltersNumber && (
          <>
            <strong>
              <Typography variant="inherit" color="primary">
                {selectedFiltersNumber}
              </Typography>
            </strong>

            <Close onClick={clearFilters} />
          </>
        )}
      </RectangleIconButton>

      {!!selectedOrdersNumber && <RectangleIconButton color="white" size="long">
        <TableOrderingButton />
        <strong>
          <Typography variant="inherit" color="primary">
            {selectedOrdersNumber}
          </Typography>
        </strong>
        <Close onClick={clearOrders} />
      </RectangleIconButton>}
    </div>
  )
}

export default FastFilterButton
