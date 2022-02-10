import {
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Table,
} from "@material-ui/core"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import TableLoader from "../../../components/TableLoader"
// import TableMessage from "../../../components/TableMessage"
import Card from "../../../components/Card"
import IncomeIcon from "../../../assets/icons/Income.svg"
import axios from "../../../utils/axios"

// const data = [
//   {
//     city: "Toshkent",
//     sold: "12454",
//     total_income: "12 000 000",
//     rejected: "1 120 000",
//     active_entities: "426",
//     auction: "185",
//   },
//   {
//     city: "Toshkent sh",
//     sold: "3532",
//     total_income: "12 000 000",
//     rejected: "2 420 000",
//     active_entities: "426",
//     auction: "185",
//   },
//   {
//     city: "Buxoro",
//     sold: "1414",
//     total_income: "12 000 000",
//     rejected: "3 420 000",
//     active_entities: "426",
//     auction: "185",
//   },
//   {
//     city: "Navoiy",
//     sold: "1354",
//     total_income: "12 000 000",
//     rejected: "1 120 000",
//     active_entities: "426",
//     auction: "185",
//   },
//   {
//     city: "Samarqand",
//     sold: "4225",
//     total_income: "12 000 000",
//     rejected: "2 420 000",
//     active_entities: "426",
//     auction: "185",
//   },
//   {
//     city: "Jizzax",
//     sold: "13583",
//     total_income: "12 000 000",
//     rejected: "1 120 000",
//     active_entities: "426",
//     auction: "185",
//   },
//   {
//     city: "Sirdaryo",
//     sold: "4522",
//     total_income: "12 000 000",
//     rejected: "2 420 000",
//     active_entities: "426",
//     auction: "185",
//   },
//   {
//     city: "Xorazm",
//     sold: "13583",
//     total_income: "12 000 000",
//     rejected: "1 120 000",
//     active_entities: "426",
//     auction: "185",
//   },
//   {
//     city: "Namangan",
//     sold: "13583",
//     total_income: "12 000 000",
//     rejected: "1 120 000",
//     active_entities: "426",
//     auction: "185",
//   },
//   {
//     city: "Andijon",
//     sold: "13583",
//     total_income: "12 000 000",
//     rejected: "2 420 000",
//     active_entities: "426",
//     auction: "185",
//   },
// ]

const IncomesTable = () => {
  // eslint-disable-next-line no-unused-vars
  const [currentPage, setCurrentPage] = useState(1)
  const { t } = useTranslation()
  const [items, setItems] = useState({})
  const [loader, setLoader] = useState(false)

  const clearItems = () => {
    setItems((prev) => ({ count: prev.count }))
  }
  useEffect(() => {
    getItems(currentPage, true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage])

  const getItems = (page, loader) => {
    if (loader) {
      setLoader(true)
      clearItems()
    }

    axios
      .get("/dashboard-count-by-cities", {
        params: {
          limit: 10,
          page,
          // city_id: selectedCityId,
          // region_id: selectedRegionId,
          // status_id: '6103bb05dd7aa74db9a779a6',
          // entity_number: searchText,
          // from_date: selectedDates[0],
          // to_date: selectedDates[1],
        },
      })
      .then((res) => setItems(res))
      .finally(() => setLoader(false))
  }

  console.log("items 1234", items)

  return (
    <Card title="Hududlar bo`yicha tushumlar" boldTitle>
      <TableContainer className="mt-2">
        <Table aria-label="simple table">
          <TableHead>
            <TableRow className="bg-gray-50">
              <TableCell>{t("region.area")}</TableCell>
              <TableCell>Sotilgan yerlar</TableCell>
              <TableCell>
                <div className="flex items-center">
                  Jami tushum
                  <div className="ml-1">
                    <IncomeIcon />
                  </div>
                </div>
              </TableCell>
              <TableCell>Rad qilingan</TableCell>
              <TableCell>Barcha faol yer uchastkalari</TableCell>
              <TableCell>Auksionda</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.entity_count_by_cities ? (
              items.entity_count_by_cities.map(
                (
                  {
                    city_name,
                    auction_sold,
                    rejected,
                    in_auction,
                    in_discussion,
                  },
                  index
                ) => (
                  <TableRow key={index}>
                    <TableCell>{city_name}</TableCell>
                    <TableCell>{auction_sold}</TableCell>
                    <TableCell>1234</TableCell>
                    <TableCell>{rejected}</TableCell>
                    <TableCell>{in_discussion}</TableCell>
                    <TableCell>{in_auction}</TableCell>
                  </TableRow>
                )
              )
            ) : (
              <></>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TableLoader isVisible={loader} />

      {/* <TableMessage
        isVisible={!loader && !(items?.entity_drafts?.length > 0)}
        text="Takliflar mavjud emas"
      /> */}
    </Card>
  )
}

export default IncomesTable
