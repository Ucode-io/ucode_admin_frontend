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

//components
import Pagination from "../../../components/Pagination"
import Card from "../../../components/Card"
import Modal from "../../../components/Modal"
import LoaderComponent from "../../../components/Loader"

//icons

import "./style.scss"
import { branchUsers, deleteBranchUser } from "../../../services/branchUsers"
import EditIcon from "@material-ui/icons/Edit"
import DeleteIcon from "@material-ui/icons/Delete"
import ActionMenu from "../../../components/ActionMenu"
import SwitchColumns from "../../../components/Filters/SwitchColumns"

export default function BranchUsers({ shipper_id }) {
  const [loader, setLoader] = useState(false)
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
        render: (record, index) => (
          <ActionMenu
            id={record.id}
            actions={[
              {
                icon: <EditIcon />,
                color: "blue",
                title: t("change"),
                action: () => {
                  history.push(`/home/company/users/${shipper_id}/${record.id}`)
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

  const getItems = (page) => {
    setLoader(true)
    branchUsers({ limit: 10, page, shipper_id })
      .then((res) => {
        setItems({
          count: res.count,
          data: res.branch_users,
        })
      })
      .finally(() => setLoader(false))
  }

  const handleDeleteItem = () => {
    setDeleteLoading(true)
    deleteBranchUser(deleteModal.id)
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
      title: t("first.name"),
      key: "name",
      render: (record) => <div>{record.name}</div>,
    },
    {
      title: t("phone.number"),
      key: "phone",
      render: (record) => <div>{record.phone}</div>,
    },
  ]

  const pagination = (
    <Pagination
      title={t("general.count")}
      count={items?.count}
      onChange={(pageNumber) => setCurrentPage(pageNumber)}
    />
  )

  return (
    <div className="p-4">
      <Card footer={pagination}>
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
          onConfirm={handleDeleteItem}
          loading={deleteLoading}
        />
      </Card>
    </div>
  )
}
