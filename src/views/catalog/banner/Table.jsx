import React, { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { useHistory } from "react-router-dom"
import { useSelector } from "react-redux"
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@material-ui/core"

import Pagination from "../../../components/Pagination"
import { deleteBanner, getBanners } from "../../../services/banner"
import Modal from "../../../components/Modal"
import LoaderComponent from "../../../components/Loader"
import ActionMenu from "../../../components/ActionMenu"
import Card from "../../../components/Card"

//icons
import EditIcon from "@material-ui/icons/Edit"
import DeleteIcon from "@material-ui/icons/Delete"
import TableChartIcon from "@material-ui/icons/TableChart"

export default function TableBanner() {
  const [loader, setLoader] = useState(true)
  const { t } = useTranslation()
  const history = useHistory()
  const lang = useSelector(state => state.lang.current)
  const [items, setItems] = useState({})
  const [currentPage, setCurrentPage] = useState(1)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [deleteModal, setDeleteModal] = useState(null)

  const handleDeleteItem = () => {
    setDeleteLoading(true)
    deleteBanner(deleteModal.id)
      .then(res => {
        getItems(currentPage)
        setDeleteLoading(false)
        setDeleteModal(null)
      })
      .finally(() => setDeleteLoading(false))
  }

  useEffect(() => {
    getItems(currentPage)
  }, [currentPage])

  const columns = [
    {
      title: "№",
      key: "order-number",
      render: (record, index) => <div className="text-info">{(currentPage - 1) * 10 + index + 1}</div>
    },
    {
      title: t("title"),
      key: "title",
      render: (record) => (
        <div>
          {record.title[lang]}
        </div>
      )
    },
    {
      title: t("img"),
      key: "image",
      render: (record) => (
        <div>
          <img className="w-10" src={record?.image ? record.image : ""} alt={record?.image} />
        </div>
      )
    },
    {
      title: <TableChartIcon className="text-primary"/>,
      key: "actions",
      render: (record, _) => (
        <ActionMenu
          id={record.id}
          actions={[
            {
              icon: <EditIcon />,
              color: "blue",
              title: t("change"),
              action: () => {
                history.push(`/home/catalog/banner/${record.id}`)
              }
            },
            {
              icon: <DeleteIcon />,
              color: "red",
              title: t("delete"),
              action: () => {
                setDeleteModal({ id: record.id })
              }
            }
          ]}
        />
      )
    }
  ]

  const getItems = (page) => {
    setLoader(true)
    getBanners({ limit: 10, page })
      .then(res => {
        setItems({
          count: res.count,
          data: res.banners
        })
      })
      .finally(() => setLoader(false))
  }

  const pagination = (
    <Pagination
      title={t("general.count")}
      count={items?.count}
      onChange={pageNumber => setCurrentPage(pageNumber)}
    />
  )
  return (
    <Card className="m-4" footer={pagination}>
      <TableContainer className="mt-4 rounded-lg border border-lightgray-1">
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              {columns.map((elm => (
                <TableCell key={elm.key}>{elm.title}</TableCell>
              )))}
            </TableRow>
          </TableHead>
          <TableBody>
            {items.data && items.data.length &&
            items.data.map((item, index) => (
              <TableRow key={item.id} className={index % 2 === 0 ? "bg-lightgray-5" : ""}>
                {columns.map(col => (
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
  )
}
