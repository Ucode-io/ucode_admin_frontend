/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core"
import { useTranslation } from "react-i18next"
import axios from "../../utils/axios"
import { useHistory } from "react-router"
import { Input } from "alisa-ui"

//components
import Pagination from "../../components/Pagination"
import LoaderComponent from "../../components/Loader"
import Card from "../../components/Card"
import ActionMenu from "../../components/ActionMenu"
import ClientCard from "../../components/ClientCard"
import Button from "../../components/Button"
import Filters from "../../components/Filters"

//icons
import EditIcon from "@material-ui/icons/Edit"
import DeleteIcon from "@material-ui/icons/Delete"
import GroupIcon from "@material-ui/icons/Group"
import SearchIcon from "@material-ui/icons/Search"
import NotificationsIcon from "@material-ui/icons/Notifications"
import DirectionsCarIcon from "@material-ui/icons/DirectionsCar"
import Modal from "../../components/Modal"
import { deleteCustomer } from "../../services"
import StatusTag from "../../components/Tag/StatusTag"
import TextFilter from "../../components/Filters/TextFilter"
import TableChartIcon from "@material-ui/icons/TableChart"
import { DownloadIcon, ExportIcon } from "../../constants/icons"

const ApplicationTable = () => {
  const { t } = useTranslation()
  const [items, setItems] = useState({})
  const [loader, setLoader] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const history = useHistory()
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [deleteModal, setDeleteModal] = useState(null)
  const [search, setSearch] = useState("")

  let debounce = setTimeout(() => {}, 0)

  const handleDeleteItem = () => {
    setDeleteLoading(true)
    deleteCustomer(deleteModal.id)
      .then((res) => {
        getItems(currentPage)
        setDeleteLoading(false)
        setDeleteModal(null)
      })
      .finally(() => setDeleteLoading(false))
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
      .get("/customers", { params: { limit: 10, page, search } })
      .then((res) => {
        setItems(res)
      })
      .catch((err) => {
        console.log(err)
      })
      .finally(() => setLoader(false))
  }

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

      <ClientCard
        classNameCard="justify-center"
        classNameIcon="mr-8"
        cards={[
          {
            icon: <GroupIcon fontSize="large" />,
            count: items.count,
            title: t("clients"),
          },
        ]}
        inversely={true}
        columnNumber={1}
      />

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
                <TableCell>№</TableCell>
                <TableCell>
                  <TextFilter
                    title={t("name.client")}
                    filterOptions={[
                      { label: "something", value: 21 },
                      { label: "somebody", value: 321 },
                    ]}
                    onFilter={(val) => console.log(val)}
                  />
                </TableCell>
                <TableCell>
                  <TextFilter sorter title={t("phone.number")} />
                </TableCell>
                <TableCell>
                  <TextFilter
                    title={t("status")}
                    filterOptions={[
                      { label: "something", value: 21 },
                      { label: "somebody", value: 321 },
                    ]}
                    onFilter={(val) => console.log(val)}
                  />
                </TableCell>
                <TableCell align="right">
                  <TableChartIcon className="text-primary" />
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.customers && items.customers.length ? (
                items.customers.map(
                  ({ id, name, phone, is_blocked }, index) => (
                    <TableRow
                      className={index % 2 === 0 ? "bg-lightgray-5" : ""}
                      key={id}
                      onClick={() =>
                        history.push(`/home/personal/clients/${id}`)
                      }
                    >
                      <TableCell>
                        <p>{(currentPage - 1) * 10 + index + 1}</p>
                      </TableCell>
                      <TableCell>{name}</TableCell>
                      <TableCell>
                        <div>{phone}</div>
                      </TableCell>
                      <TableCell className="px-5">
                        {/*<CheckStatus*/}
                        {/*  status={!is_blocked}*/}
                        {/*/>*/}
                        <div className="w-10/12">
                          <StatusTag
                            status={!is_blocked}
                            color={is_blocked ? "#F2271C" : "#0E73F6"}
                          />
                        </div>
                      </TableCell>
                      <TableCell align="right">
                        <ActionMenu
                          id={id}
                          actions={[
                            {
                              icon: <EditIcon />,
                              color: "blue",
                              title: t("change"),
                              action: () => {
                                history.push(`/home/personal/clients/${id}`)
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
                      </TableCell>
                    </TableRow>
                  )
                )
              ) : (
                <></>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <LoaderComponent isLoader={loader} />
        {/* <Pagination title={t("general.count")} count={items?.count}
                    onChange={pageNumber => setCurrentPage(pageNumber)} /> */}
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
