import React, { useEffect, useState } from "react"
import Form from "../../components/Form/Index"
import axios from "../../utils/axios"
import Modal from "../../components/Modal"
import Button from "../../components/Button"
import AddIcon from "@material-ui/icons/Add"
import * as yup from "yup"
import EditIcon from "@material-ui/icons/Edit"
import { Input } from "alisa-ui"
import DeleteIcon from "@material-ui/icons/Delete"
import Pagination from "../../components/Pagination"
import { useFormik } from "formik"
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
import ActionMenu from "../../components/ActionMenu"
import { useSelector } from "react-redux"
import LoaderComponent from "../../components/Loader"
import Card from "../../components/Card"
import SwitchColumns from "../../components/Filters/SwitchColumns"

const Catalog = ({ shipper_id, createModal, setCreateModal }) => {
  const { t } = useTranslation()
  const history = useHistory()
  const { id } = useParams()
  const [items, setItems] = useState({})
  const [loader, setLoader] = useState(true)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [deleteModal, setDeleteModal] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const lang = useSelector((state) => state.lang.current)
  const [columns, setColumns] = useState([])
  const [saveLoading, setSaveLoading] = useState(null)

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
                  handleEdit(record)
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

  const clearItems = () => {
    setItems((prev) => ({ count: prev.count }))
  }

  const getItems = (page) => {
    setLoader(true)
    clearItems()
    axios
      .get("/menu", { params: { limit: 10, page, shipper_id: id } })
      .then((res) => {
        setItems({
          count: res.count,
          data: res.menus,
        })
      })
      .catch((err) => {
        console.log(err)
      })
      .finally(() => setLoader(false))
  }

  const handleDeleteItem = () => {
    setDeleteLoading(true)
    axios
      .delete(`/menu/${deleteModal.id}`)
      .then((res) => {
        getItems(currentPage)
        setDeleteLoading(false)
        setDeleteModal(null)
      })
      .finally(() => setDeleteLoading(false))
  }

  const onSubmit = (data) => {
    setSaveLoading(true)

    const createParams = {
      url: "/menu",
      method: "POST",
    }

    const editParams = {
      url: "/menu/" + createModal.id,
      method: "PUT",
    }

    const selectedParams = createModal.id ? editParams : createParams

    axios({
      ...selectedParams,
      data: { ...data, shipper_id: id },
    })
      .then((res) => {
        getItems(currentPage)
      })
      .finally(() => {
        setSaveLoading(false)
        closeModal()
      })
  }

  const formik = useFormik({
    initialValues: {
      name: { ru: "", uz: "", en: "" },
      shipper_id: id,
    },
    validationSchema: yup.object().shape({
      name: yup.object({
        uz: yup.mixed().required(t("required.field.error")),
        ru: yup.mixed().required(t("required.field.error")),
        en: yup.mixed().required(t("required.field.error")),
      }),
    }),
    onSubmit,
  })

  const closeModal = () => {
    setCreateModal(null)
    formik.resetForm()
  }

  const handleEdit = ({ id, name }) => {
    setCreateModal({ id, name })
    formik.setValues({ name })
  }

  const initialColumns = [
    {
      title: "№",
      key: "order-number",
      render: (record, index) => (currentPage - 1) * 10 + index + 1,
    },
    {
      title: t("category.name"),
      key: "name",
      render: (record) => (
        <div
          onClick={() =>
            history.push(
              `/home/company/shipper-company/menu/${id}/${record.id}`
            )
          }
        >
          {record.name[lang]}
        </div>
      ),
    },
  ]

  const { values, handleChange } = formik

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
                items.data.map((elm, index) => (
                  <TableRow
                    key={elm.id}
                    className={index % 2 === 0 ? "bg-lightgray-5" : ""}
                  >
                    {columns.map((col) => (
                      <TableCell key={col.key}>
                        {col.render
                          ? col.render(elm, index)
                          : elm[col.dataIndex]}
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
      </Card>

      <Modal
        open={deleteModal}
        onClose={() => setDeleteModal(null)}
        onConfirm={handleDeleteItem}
        loading={deleteLoading}
      />

      <Modal
        open={createModal}
        title={t(createModal?.name ? createModal?.name[lang] : "create.menu")}
        footer={null}
        isWarning={false}
        onClose={closeModal}
      >
        <form onSubmit={formik.handleSubmit}>
          <div>
            <Form.Item formik={formik} name="name.uz" label={t("name.in.uz")}>
              <Input
                id="name.uz"
                value={values.name?.uz}
                onChange={handleChange}
              />
            </Form.Item>
          </div>
          <div>
            <Form.Item formik={formik} name="name.ru" label={t("name.in.ru")}>
              <Input
                id="name.ru"
                value={values.name?.ru}
                onChange={handleChange}
              />
            </Form.Item>
          </div>
          <div>
            <Form.Item formik={formik} name="name.en" label={t("name.in.en")}>
              <Input
                id="name.en"
                value={values.name?.en}
                onChange={handleChange}
              />
            </Form.Item>
          </div>
          <div className="flex justify-end">
            <Button
              type="submit"
              size="medium"
              loading={saveLoading}
              icon={createModal?.name ? EditIcon : AddIcon}
            >
              {t(createModal?.name ? "update" : "add")}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default Catalog
