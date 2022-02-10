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
import { DownloadIcon, ExportIcon } from "../../../constants/icons"
import StatusTag from "../../../components/Tag/StatusTag"

export default function TableCourier() {
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
    const _columns = [
      ...initialColumns,
      {
        title: (
          <SwitchColumns
            columns={initialColumns}
            onChange={(val) =>
              setColumns((prev) => [...val, prev[prev.length - 1]])
            }
          />
        ),
        key: t("actions"),
        render: (record, _) => (
          <ActionMenu
            id={record.id}
            actions={[
              {
                icon: <EditIcon />,
                color: "blue",
                title: t("change"),
                action: () => {
                  history.push(`/home/courier/list/${record.id}`)
                },
              },
              {
                icon: <DeleteIcon />,
                color: "red",
                title: t("delete"),
                action: () => {
                  setDeleteModal({ id: record.id })
                },
              },
            ]}
          />
        ),
      },
    ]
    setColumns(_columns)
  }, [])

  useEffect(() => {
    getItems(currentPage)
  }, [currentPage])

  const handleDeleteItem = () => {
    setDeleteLoading(true)
    deleteCourier(deleteModal.id)
      .then((res) => {
        getItems(currentPage)
        setDeleteLoading(false)
        setDeleteModal(null)
      })
      .finally(() => setDeleteLoading(false))
  }

  const initialColumns = [
    {
      title: "№",
      key: "order-number",
      render: (record, index) => (
        <div>{(currentPage - 1) * 10 + index + 1}</div>
      ),
    },
    {
      title: t("fullName"),
      key: "fullName",
      render: (record) => (
        <div>{`${record.first_name} ${record.last_name}`}</div>
      ),
    },
    {
      title: t("phone.number"),
      key: "phone",
      render: (record) => <div>{record.phone}</div>,
    },
    {
      title: t("status"),
      key: "status",
      render: (record) => (
        <div>
          <StatusTag
            status={record.is_active}
            color={!record.is_active ? "#F2271C" : "#0452C8"}
          />
        </div>
      ),
    },
  ]

  const getItems = (page) => {
    setLoader(true)
    getCouriers({ limit: 10, page })
      .then((res) => {
        setItems({
          count: res.count,
          data: res.couriers,
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
        icon={ExportIcon}
        color="zinc"
        iconClassName="text-blue-600"
        shape="outlined"
        className="bg-white"
        onClick={() => {
          console.log("clicked")
        }}
      >
        {t("import")}
      </Button>

      <Button
        icon={DownloadIcon}
        color="zinc"
        iconClassName="text-blue-600"
        shape="outlined"
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
                        {col.render ? col.render(item, index) : "----"}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <LoaderComponent isLoader={loader} />
        <Modal
          open={deleteModal}
          onClose={() => setDeleteModal(null)}
          onConfirm={handleDeleteItem}
          loading={deleteLoading}
        />
      </Card>
    </div>
  )
}
