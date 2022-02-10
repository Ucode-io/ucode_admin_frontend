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
import axios from "../../../utils/axios"
import StatusTag from "../../../components/Tag/StatusTag"
import moment from "moment"
import TableMessage from "../../../components/TableMessage"
import Card from "../../../components/Card"
import ContentCopy from "../../../assets/icons/ContentCopy.svg"
import ArrowForward from "../../../assets/icons/ArrowForward.svg"
import { Link } from "react-router-dom"
import Input from "../../../components/Input"
import AutoComplate from "../../../components/Select/AutoComplate"
import RangePicker from "../../../components/DatePicker/RangePicker"
import Button from "../../../components/Button"
import DownloadIcon from "@material-ui/icons/GetApp"
import "../index.scss"
import { useHistory } from "react-router"

const NewFoundedTable = () => {
  const { t } = useTranslation()
  const [items, setItems] = useState({})
  const [loader, setLoader] = useState(false)
  // eslint-disable-next-line no-unused-vars
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedCityId, setSelectedCityId] = useState(null)
  const [selectedRegionId, setSelectedRegionId] = useState(null)
  const [selectedDates, setSelectedDates] = useState([null, null])
  const [searchText, setSearchText] = useState(null)
  const history = useHistory()

  useEffect(() => {
    getItems(currentPage, true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, selectedCityId, selectedRegionId, selectedDates, searchText])

  const clearItems = () => {
    setItems((prev) => ({ count: prev.count }))
  }

  const getItems = (page, loader) => {
    if (loader) {
      setLoader(true)
      clearItems()
    }

    axios
      .get("/dashboard-new-entities", {
        params: {
          limit: 10,
          page,
          city_id: selectedCityId,
          region_id: selectedRegionId,
          status_id: "6103bb05dd7aa74db9a779a6",
          entity_number: searchText,
          from_date: selectedDates[0],
          to_date: selectedDates[1],
        },
      })
      .then((res) => setItems(res))
      .finally(() => setLoader(false))
  }

  const calculateAddedTime = (datetime) => {
    const currentDate = moment()
    const one_day = 1000 * 60 * 60 * 24
    const addedTime = currentDate - datetime
    return Math.round(addedTime / one_day)
  }

  return (
    <Card
      className=""
      title="Yangi topilgan yerlar"
      extra={
        <Link
          to="/home/application/1"
          className="flex items-center"
          style={{ color: "#84919A" }}
        >
          Hammasi
          <div className="ml-2">
            <ArrowForward />
          </div>
        </Link>
      }
    >
      <div className="flex w-full justify-between">
        <div className="flex space-x-2">
          <AutoComplate
            placeholder={t("region.area")}
            style={{ minWidth: "200px" }}
            isClearable
            onChange={(val) => setSelectedCityId(val?.value?.id)}
          />
          <AutoComplate
            placeholder={t("region")}
            style={{ minWidth: "200px" }}
            url="/regions"
            onFetched={(res) => res.regions}
            isClearable
            params={selectedCityId}
            onChange={(val) => setSelectedRegionId(val?.value?.id)}
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
        <div className="flex space-x-2">
          <Input
            placeholder={t("search") + "..."}
            style={{ width: 200 }}
            onChange={(e) => setSearchText(e.target.value)}
            value={searchText}
          />
          <Button color="green" icon={DownloadIcon}>
            Excel
          </Button>
        </div>
      </div>
      <TableContainer className="mt-4 ">
        <Table aria-label="simple table">
          <TableHead>
            <TableRow className="bg-gray-50">
              <TableCell>#</TableCell>
              <TableCell>Yer uchastkasi raqami</TableCell>
              <TableCell>Qo’shilgan vaqt</TableCell>
              <TableCell>Holati</TableCell>
              <TableCell>{t("region.area")}</TableCell>
              <TableCell>{t("district")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.entities && items.entities.length ? (
              items.entities.map(
                (
                  { id, status, created_at, entity_number, city, region },
                  index
                ) => (
                  <TableRow
                    key={id}
                    onClick={(e) => {
                      if (e.target.tagName === "DIV") {
                        history.push(`/home/application/edit/${id}/1`)
                      }
                    }}
                  >
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {entity_number}
                        <button
                          onClick={(e) => {
                            if (e.target.tagName === "svg") {
                              navigator.clipboard.writeText(entity_number)
                            }
                          }}
                          className="integration_checklist__copy_button"
                        >
                          <ContentCopy />
                        </button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <p>
                          {moment(created_at).format("DD.MM.YYYY")},{" "}
                          {moment(created_at).format("HH:mm")}
                        </p>
                        <div className="text-blue-600 bg-blue-200 px-4 text-base rounded-md ml-3">
                          {calculateAddedTime(moment(created_at))} kun
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <StatusTag
                        color="#0D9676"
                        status={status.status}
                        innerText="Yangi"
                        style={{ minWidth: 148 }}
                      />
                    </TableCell>
                    <TableCell>{city.name}</TableCell>
                    <TableCell>{region.name}</TableCell>
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

      <TableMessage
        isVisible={!loader && !(items?.entities?.length > 0)}
        text="Yangi topilgan yerlar mavjud emas"
      />
    </Card>
  )
}

export default NewFoundedTable
