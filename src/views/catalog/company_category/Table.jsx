import React, { useEffect, useState } from "react"
import { useHistory } from "react-router-dom"
import { useSelector } from "react-redux"
import { useTranslation } from "react-i18next"
import {
  getCompanyCategories,
  deleteCompanyCategory,
} from "../../../services/company_category"
import {
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TableContainer,
} from "@material-ui/core"

//components
import IconButton from "../../../components/Button/IconButton"
import Pagination from "../../../components/Pagination"
import Modal from "../../../components/Modal"
import Card from "../../../components/Card"
import TableLoader from "../../../components/TableLoader"

//icons
import EditIcon from "@material-ui/icons/Edit"
import DeleteIcon from "@material-ui/icons/Delete"
import LoaderComponent from "../../../components/Loader"
import TableChartIcon from "@material-ui/icons/TableChart"
import ActionMenu from "../../../components/ActionMenu"

export default function TableCompanyCategory() {
  const [loader, setLoader] = useState(true)
  const { t } = useTranslation()
  const history = useHistory()
  const lang = useSelector((state) => state.lang.current)
  const [items, setItems] = useState({})
  const [currentPage, setCurrentPage] = useState(1)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [deleteModal, setDeleteModal] = useState(null)

  const handleDeleteItem = () => {
    setDeleteLoading(true)
    deleteCompanyCategory(deleteModal.id)
      .then((res) => {
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
      render: (record, index) => (
        <div>{(currentPage - 1) * 10 + index + 1}</div>
      ),
    },
    {
      title: t("category.name"),
      key: "name",
      render: (record) => <div>{record.name[lang]}</div>,
    },
    {
      title: t("img"),
      key: "image",
      render: (record) => (
        <div>
          <img
            className="w-10"
            src={record?.image ? record.image : ""}
            alt={record?.image ?? "alt-image-prop"}
          />
        </div>
      ),
    },
    {
      title: (
        <div>
          <TableChartIcon className="text-primary" />
        </div>
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
                history.push(`/home/marketing/company_category/${record.id}`)
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
        // <div className="flex gap-2">
        //   <IconButton
        //     icon={<EditIcon />}
        //     onClick={() =>
        //       history.push(`/home/catalog/company_category/${record.id}`)
        //     }
        //   />
        //   <IconButton
        //     color="red"
        //     icon={<DeleteIcon />}
        //     onClick={() => setDeleteModal({ id: record.id })}
        //   />
        // </div>
      ),
    },
  ]

  const getItems = (page) => {
    setLoader(true)
    getCompanyCategories({ limit: 10, page })
      .then((res) => {
        setItems({
          count: res.count,
          data: res.company_categories,
        })
      })
      .catch((err) => console.log("err", err))
      .finally(() => setLoader(false))
  }

  const pagination = (
    <Pagination
      title={t("general.count")}
      count={items?.count}
      onChange={(pageNumber) => setCurrentPage(pageNumber)}
    />
  )
  return (
    <Card className="m-4" footer={pagination}>
      <TableContainer className="mt-4 rounded-lg border border-lightgray-1">
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
  )
}
