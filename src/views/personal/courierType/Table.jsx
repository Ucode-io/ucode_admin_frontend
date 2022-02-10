import React, { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { useHistory } from "react-router-dom"
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

import IconButton from "../../../components/Button/IconButton"
import Pagination from "../../../components/Pagination"
import Modal from "../../../components/Modal"
import {
  deleteCourierType,
  getCourierTypes,
} from "../../../services/courierType"
import EmptyData from "../../../components/EmptyData"
import LoaderComponent from "../../../components/Loader"
import SwitchColumns from "../../../components/Filters/SwitchColumns"
import FiveStar from "../../../components/FiveStar"
import Card from "../../../components/Card"
import ActionMenu from "../../../components/ActionMenu"

export default function TableOperator() {
  const [loader, setLoader] = useState(true)
  const { t } = useTranslation()
  const history = useHistory()
  const [items, setItems] = useState({})
  const [currentPage, setCurrentPage] = useState(1)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [deleteModal, setDeleteModal] = useState(null)
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
        render: (record, _) => (
          <ActionMenu
            id={record.id}
            actions={[
              {
                icon: <EditIcon />,
                color: "blue",
                title: t("change"),
                action: () => {
                  history.push(`/home/courier/courier-type/${record.id}`)
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
    deleteCourierType(deleteModal.id)
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
        <div className="text-info">{(currentPage - 1) * 10 + index + 1}</div>
      ),
    },
    {
      title: t("first.name"),
      key: "fullName",
      dataIndex: "name",
    },
    {
      title: t("distance.from"),
      key: "distance_from",
      dataIndex: "distance_from",
    },
    {
      title: t("distance.to"),
      key: "distance_to",
      dataIndex: "distance_to",
    },
  ]

  const getItems = (page) => {
    setLoader(true)
    getCourierTypes({ limit: 10, page })
      .then((res) => {
        setItems({
          count: res.count,
          data: res.courier_type,
        })
      })
      .finally(() => setLoader(false))
  }

  return (
    <Card
      className="m-4"
      footer={
        <Pagination
          title={t("general.count")}
          count={items?.count}
          onChange={(pageNumber) => setCurrentPage(pageNumber)}
        />
      }
    >
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
            {items.data && items.data.length ? (
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
              ))
            ) : (
              <></>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <LoaderComponent isLoader={loader} />
      {/* <Pagination title={t("general.count")} count={items?.count} onChange={pageNumber => setCurrentPage(pageNumber)} /> */}
      <Modal
        open={deleteModal}
        onClose={() => setDeleteModal(null)}
        onConfirm={handleDeleteItem}
        loading={deleteLoading}
      />
    </Card>
  )
}
