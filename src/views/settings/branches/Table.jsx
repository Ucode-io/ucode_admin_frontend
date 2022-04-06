import React, { useEffect, useState } from "react"
import { useHistory, useParams } from "react-router-dom"
import { useTranslation } from "react-i18next"

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core"

//components
import Card from "../../../components/Card"
import Pagination from "../../../components/Pagination"
import Modal from "../../../components/Modal"
import LoaderComponent from "../../../components/Loader"
import Service, { deleteBranch } from "../../../services/branch"

//icons
import ActionMenu from "../../../components/ActionMenu"
import EditIcon from "@material-ui/icons/Edit"
import DeleteIcon from "@material-ui/icons/Delete"
import TableChartIcon from "@material-ui/icons/TableChart"

const ApplicationTable = () => {
  const { t } = useTranslation()
  const [items, setItems] = useState({})
  const [loader, setLoader] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const history = useHistory()
  const params = useParams()
  const [deleteModal, setDeleteModal] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const handleDeleteItem = () => {
    setDeleteLoading(true)
    deleteBranch(deleteModal.id, params.id)
      .then((res) => {
        getItems(currentPage, params.id)
        setDeleteLoading(false)
        setDeleteModal(null)
      })
      .finally(() => setDeleteLoading(false))
  }

  useEffect(() => {
    getItems(currentPage, params.id)
  }, [currentPage, params.id])

  const clearItems = () => {
    setItems((prev) => ({ count: prev.count }))
  }

  const getItems = async (page, id) => {
    setLoader(true)
    clearItems()
    try {
      setItems({ ...(await Service.getBranch({ page, limit: 10 }, id)) })
      console.log(id, { ...(await Service.getBranch({ page, limit: 10 }, id)) })
    } catch (error) {
      console.log(error)
    } finally {
      setLoader(false)
    }
  }

  const navigationRoute = (id) =>
    history.push(`/home/company/shipper-company/${params.id}/branches/${id}`)

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
                <TableCell></TableCell>
                <TableCell>{t("branches")}</TableCell>
                <TableCell>
                  <div className="float-right mr-10">{t("phone.number")}</div>
                </TableCell>
                <TableCell>
                  <div className="float-right">
                    <TableChartIcon className="text-primary" />
                  </div>
                </TableCell>
              </TableRow>
            </TableHead>
            {items.branches && items.branches.length ? (
              <TableBody>
                {items.branches.map(
                  ({ id, name, description, phone }, index) => (
                    <TableRow
                      onClick={() => navigationRoute(id)}
                      className={index % 2 === 0 ? "bg-lightgray-5" : ""}
                      key={id}
                    >
                      <TableCell>
                        <p>{(currentPage - 1) * 10 + index + 1}</p>
                      </TableCell>
                      <TableCell>{name}</TableCell>
                      <TableCell>
                        <div className="float-right mr-10">{phone}</div>
                      </TableCell>
                      <TableCell>
                        <div className="float-right">
                          <ActionMenu
                            id={id}
                            actions={[
                              {
                                icon: <EditIcon />,
                                color: "blue",
                                title: t("change"),
                                action: () => {
                                  navigationRoute(id)
                                },
                              },
                              {
                                icon: <DeleteIcon />,
                                color: "red",
                                title: t("delete"),
                                action: () => {
                                  setDeleteModal({ id: id })
                                },
                              },
                            ]}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            ) : (
              <></>
            )}
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

export default ApplicationTable
