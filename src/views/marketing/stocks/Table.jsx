import React, { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { useHistory } from "react-router-dom"
import { useSelector } from "react-redux"
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core"
import EditIcon from "@material-ui/icons/Edit"
import DeleteIcon from "@material-ui/icons/Delete"
import FilterAltIcon from "@material-ui/icons/Filter"
import Pagination from "../../../components/Pagination"
import Modal from "../../../components/Modal"
import { deleteCourier, getCouriers } from "../../../services/courier"
import LoaderComponent from "../../../components/Loader"
import SwitchColumns from "../../../components/Filters/SwitchColumns"
import ActionMenu from "../../../components/ActionMenu"
import Card from "../../../components/Card"
import Filters from "../../../components/Filters"
import { Input } from "alisa-ui"
import SearchIcon from "@material-ui/icons/Search"
import Button from "../../../components/Button"
import PublishIcon from "@material-ui/icons/Publish"
import GetAppIcon from "@material-ui/icons/GetApp"
import { getData } from "./mockData"
import StatusTag from "../../../components/Tag/StatusTag"
import { ExportIcon, FIlterIcon } from "../../../constants/icons"
import { getPromotions } from "../../../services/promotion"

export default function TableStocks() {
  const [loader, setLoader] = useState(true)
  const { t } = useTranslation()
  const history = useHistory()
  const lang = useSelector((state) => state.lang.current)
  const [items, setItems] = useState({})
  const [currentPage, setCurrentPage] = useState(1)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [deleteModal, setDeleteModal] = useState(null)
  const [search, setSearch] = useState("")
  const [columns, setColumns] = useState([])

  useEffect(() => {
    setColumns(initialColumns)
  }, [])

  useEffect(() => {
    getItems(currentPage, search)
  }, [currentPage, search])

  // const handleDeleteItem = () => {
  //   setDeleteLoading(true)
  //   deleteCourier(deleteModal.id)
  //     .then(res => {
  //       getItems(currentPage)
  //       setDeleteLoading(false)
  //       setDeleteModal(null)
  //     })
  //     .finally(() => setDeleteLoading(false))
  // }

  const initialColumns = [
    {
      title: "№",
      key: "order-number",
      render: (_, index) => <div>{(currentPage - 1) * 10 + index + 1}</div>,
    },
    {
      title: t("name"),
      key: "name.ru",
      dataIndex: "name.ru",
      render: (record) => <>{record.name.ru}</>,
    },
    {
      title: t("start.stock"),
      key: "start_date",
      dataIndex: "start_date",
    },
    {
      title: t("finish.stock"),
      key: "end_date",
      dataIndex: "end_date",
    },
    {
      title: t("status"),
      key: "status",
      render: (record) => (
        <div>
          <StatusTag
            status={record.is_active}
            color={!record.is_active ? "#F2271C" : "#0E73F6"}
          />
        </div>
      ),
    },
    {
      title: "",
      key: "actions",
      render: (record) => (
        <ActionMenu
          id={record.id}
          actions={[
            {
              title: t("edit"),
              icon: <EditIcon />,
              color: "blue",
              action: () =>
                history.push(`/home/marketing/stocks/create/${record.id}`),
            },
            {
              title: t("delete"),
              icon: <DeleteIcon />,
              color: "red",
              action: () => {},
            },
          ]}
        />
      ),
    },
  ]

  const getItems = (page, search) => {
    setLoader(true)
    getPromotions({ limit: 10, page, search })
      .then((res) => {
        console.log(res)
        setItems({
          count: res.count,
          data: res.promotions,
        })
      })
      .finally(() => setLoader(false))
  }

  const pagination = (
    <Pagination
      title={t("general.count")}
      count={items?.count}
      onChange={(pageNumber) => setCurrentPage(pageNumber)}
    />
  )

  let debounce = setTimeout(() => {}, 0)

  const onSearch = (e) => {
    clearTimeout(debounce)
    debounce = setTimeout(() => {
      setSearch(e.target.value)
    }, 300)
  }

  const extraFilter = (
    <div className="flex gap-4">
      <Button
        icon={FIlterIcon}
        color="zinc"
        iconClassName="text-blue-600"
        shape="outlined"
        size="medium"
        className="bg-white"
        onClick={() => {
          console.log("clicked")
        }}
      >
        Фильтр
      </Button>

      <Button
        icon={GetAppIcon}
        color="zinc"
        iconClassName="text-blue-600"
        shape="outlined"
        size="medium"
        className="bg-white"
        onClick={() => console.log("clicked")}
      >
        {t("download")}
      </Button>
    </div>
  )

  return (
    <div>
      <Filters extra={extraFilter}>
        <Input
          onChange={onSearch}
          width={280}
          placeholder={t("search")}
          size="middle"
          addonBefore={<SearchIcon style={{ color: "var(--color-primary)" }} />}
        />
      </Filters>
      <Card className="m-4" footer={pagination}>
        <TableContainer className="rounded-lg border border-lightgray-1">
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                {columns.map((elm) => (
                  <TableCell key={elm.key}>{elm.title}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {items.data &&
                items.data.length &&
                items.data.map((item, index) => (
                  <TableRow
                    key={item.id}
                    className={index % 2 === 0 ? "bg-lightgray-5" : ""}
                  >
                    {columns.map((col) => (
                      <TableCell key={col.key}>
                        {col.render
                          ? col.render(item, index)
                          : item[col.dataIndex]}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <LoaderComponent isLoader={loader} />
        {/*<Modal*/}
        {/*  open={deleteModal}*/}
        {/*  onClose={() => setDeleteModal(null)}*/}
        {/*  onConfirm={handleDeleteItem}*/}
        {/*  loading={deleteLoading}*/}
        {/*/>*/}
      </Card>
    </div>
  )
}
