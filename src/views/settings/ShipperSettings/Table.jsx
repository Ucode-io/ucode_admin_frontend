import React, { useEffect, useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core"
import { useHistory } from "react-router"
import { useTranslation } from "react-i18next"

//components and functions
import Modal from "../../../components/Modal"
import Pagination from "../../../components/Pagination"
import Card from "../../../components/Card"
import LoaderComponent from "../../../components/Loader"
import Button from "../../../components/Button"
import TextFilter from "../../../components/Filters/TextFilter"
import ActionMenu from "../../../components/ActionMenu"

import axios from "../../../utils/axios"

//icons
import DeleteIcon from "@material-ui/icons/Delete"
import Filters from "../../../components/Filters"
import { Input } from "alisa-ui"
import SearchIcon from "@material-ui/icons/Search"
import PublishIcon from "@material-ui/icons/Publish"
import GetAppIcon from "@material-ui/icons/GetApp"
import EditIcon from "@material-ui/icons/Edit"
import SwitchColumns from "../../../components/Filters/SwitchColumns"
import { DownloadIcon, ExportIcon } from "../../../constants/icons"

const ApplicationTable = () => {
  const { t } = useTranslation()
  const [items, setItems] = useState({})
  const [loader, setLoader] = useState(true)
  const [deleteModal, setDeleteModal] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [search, setSearch] = useState("")
  const history = useHistory()
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
        key: "actions",
        render: (record, index) => (
          <ActionMenu
            id={record.id}
            actions={[
              {
                icon: <EditIcon />,
                color: "blue",
                title: t("change"),
                action: () => {
                  editRow(record.id)
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

  let debounce = setTimeout(() => {}, 0)

  const onSearch = (e) => {
    clearTimeout(debounce)
    debounce = setTimeout(() => {
      setSearch(e.target.value)
    }, 300)
  }

  useEffect(() => {
    getItems(currentPage)
  }, [currentPage, search])

  const clearItems = () => {
    setItems((prev) => ({ count: prev.count }))
  }

  const getItems = (page) => {
    setLoader(true)
    clearItems()
    axios
      .get("/shippers", { params: { limit: 10, page, search } })
      .then((res) => {
        setItems(res)
      })
      .catch((err) => {
        console.log(err)
      })
      .finally(() => setLoader(false))
  }

  const editRow = (id) => {
    history.push(`/home/company/shipper-company/${id}`)
  }

  const handleDelete = () => {
    setDeleteLoading(true)
    axios
      .delete("/shippers/" + deleteModal.id)
      .then((res) => {
        setDeleteModal(false)
        getItems(currentPage)
      })
      .catch((err) => {
        console.log(err)
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
      title: t("name"),
      key: "name",
      render: (record) => <div>{record.name}</div>,
    },
    {
      title: t("description"),
      key: "description",
      render: (record) => (
        <div className="truncate w-96">{record.description}</div>
      ),
    },
    {
      title: (
        <TextFilter
          title={t("company.type")}
          filterOptions={[
            { label: "something", value: 21 },
            { label: "somebody", value: 321 },
          ]}
          onFilter={(val) => console.log(val)}
        />
      ),
      key: "company.type",
      render: (record) => <div>Fast food</div>,
    },
  ]

  const extraFilter = (
    <div className="flex gap-4">
      <Button
        icon={ExportIcon}
        iconClassName="text-blue-600"
        color="zinc"
        shape="outlined"
        size="medium"
        onClick={() => {
          console.log("clicked")
        }}
      >
        {t("import")}
      </Button>

      <Button
        icon={DownloadIcon}
        iconClassName="text-blue-600"
        color="zinc"
        shape="outlined"
        size="medium"
        onClick={() => console.log("clicked")}
      >
        {t("download")}
      </Button>
    </div>
  )

  const pagination = (
    <Pagination
      title={t("general.count")}
      count={items?.count}
      onChange={(pageNumber) => setCurrentPage(pageNumber)}
    />
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
      <div className="p-4">
        <Card footer={pagination}>
          <TableContainer className="rounded-lg border border-lightgray-1">
            <Table aria-label="simple table">
              <TableHead>
                {columns.map((elm) => (
                  <TableCell key={elm.key}>{elm.title}</TableCell>
                ))}
              </TableHead>
              <TableBody>
                {items.shippers && items.shippers.length ? (
                  items.shippers.map((item, index) => (
                    <TableRow
                      onClick={() => editRow(item.id)}
                      className={index % 2 === 0 ? "bg-lightgray-5" : ""}
                      key={item.id}
                    >
                      {columns.map((col) => (
                        <TableCell key={col.key}>
                          {col.render ? col.render(item, index) : "----"}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <></>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <LoaderComponent isLoader={loader} />
          <Modal
            open={deleteModal}
            onClose={() => setDeleteModal(null)}
            onConfirm={handleDelete}
            loading={deleteLoading}
          />
        </Card>
      </div>
    </div>
  )
}

export default ApplicationTable
