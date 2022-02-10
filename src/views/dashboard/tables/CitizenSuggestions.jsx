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
import AutoComplate from "../../../components/Select/AutoComplate"
import Input from "../../../components/Input"
import Button from "../../../components/Button"
import DownloadIcon from "@material-ui/icons/GetApp"
import "../index.scss"

let timeout

const CitizenSuggestions = () => {
  const { t } = useTranslation()
  const [items, setItems] = useState({})
  const [loader, setLoader] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedCityId, setSelectedCityId] = useState(null)
  const [selectedRegionId, setSelectedRegionId] = useState(null)
  const [selectedStatusId, setSelectedStatusId] = useState(null)
  const [searchText, setSearchText] = useState(null)

  useEffect(() => {
    getItems(currentPage, true)
  }, [
    currentPage,
    selectedRegionId,
    selectedStatusId,
    selectedCityId,
    searchText,
  ])

  useEffect(() => {
    return () => {
      clearTimeout(timeout)
    }
  }, [])

  const clearItems = () => {
    setItems((prev) => ({ count: prev.count }))
  }

  const getItems = (page, loader) => {
    clearTimeout(timeout)
    if (loader) {
      setLoader(true)
      clearItems()
    }

    axios
      .get("/entity-draft", {
        params: {
          limit: 10,
          page,
          city_id: selectedCityId,
          region_id: selectedRegionId,
          status_id: selectedStatusId,
          entity_draft_number: searchText,
        },
      })
      .then((res) => {
        console.log("res =>", res)
        timeout = setTimeout(() => {
          getItems(currentPage, false)
        }, 5000000)
        setItems(res)
      })
      .finally(() => setLoader(false))
  }
  console.log("items", items)

  return (
    <Card
      style={{ marginTop: "20px" }}
      className=""
      title="Fuqarolarning takliflari"
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
          <AutoComplate
            placeholder={t("status")}
            style={{ minWidth: "200px" }}
            url="/status"
            isClearable
            queryParams={{ type_code: 4 }}
            onFetched={(res) => res.statuses}
            onChange={(val) => setSelectedStatusId(val?.value?.id)}
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
              <TableCell>{t("new.offers.number")}</TableCell>
              <TableCell>Maydoni</TableCell>
              <TableCell>Ariza beruvchi</TableCell>
              <TableCell>Kelib tushgan vaqt</TableCell>
              <TableCell>Holati</TableCell>
              <TableCell>{t("region.area")}</TableCell>
              <TableCell>{t("district")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.entity_drafts && items.entity_drafts.length ? (
              items.entity_drafts.map(
                (
                  {
                    id,
                    applicant,
                    status,
                    created_at,
                    entity_draft_number,
                    city,
                    region,
                  },
                  index
                ) => (
                  <TableRow key={id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {entity_draft_number}
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(entity_draft_number)
                            console.log("click")
                          }}
                          className="integration_checklist__copy_button"
                        >
                          <ContentCopy />
                        </button>
                      </div>
                    </TableCell>
                    <TableCell>124</TableCell>
                    <TableCell>{applicant.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <p>{moment(created_at).format("DD.MM.YYYY")}</p>
                        <div className="text-green-600 bg-green-200 px-4 text-base rounded-md ml-3">
                          {moment(created_at).format("HH:mm")}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <StatusTag
                        color={status.color}
                        status={status.status}
                        innerText={status.name}
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
        isVisible={!loader && !(items?.entity_drafts?.length > 0)}
        text="Takliflar mavjud emas"
      />
    </Card>
  )
}

export default CitizenSuggestions
