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
  Tooltip,
} from "@material-ui/core"
import EditIcon from "@material-ui/icons/Edit"
import DeleteIcon from "@material-ui/icons/Delete"

import Pagination from "../../../../../components/Pagination"
import Modal from "../../../../../components/Modal"
import { deleteCourier, getCouriers } from "../../../../../services/courier"
import LoaderComponent from "../../../../../components/Loader"
import SwitchColumns from "../../../../../components/Filters/SwitchColumns"
import ActionMenu from "../../../../../components/ActionMenu"
import Card from "../../../../../components/Card"
import Filters from "../../../../../components/Filters"
import Tag from "../../../../../components/Tag"
import { statusCheck } from "../../../../orders/statuses"
import moment from "moment"
import TextFilter from "../../../../../components/Filters/TextFilter"
import { getOrders } from "../../../../../services"
import { StyledTab, StyledTabs } from "../../../../../components/StyledTabs"
import {
  currentStatuses,
  historyStatuses,
} from "../../../../../constants/statuses"

export default function OrderCourier({ courier_id }) {
  const [loader, setLoader] = useState(true)
  const { t } = useTranslation()
  const history = useHistory()
  const lang = useSelector((state) => state.lang.current)
  const [items, setItems] = useState({})
  const [currentPage, setCurrentPage] = useState(1)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [deleteModal, setDeleteModal] = useState(null)
  const [columns, setColumns] = useState([])
  const [selectedTab, setSelectedTab] = useState("current")

  useEffect(() => {
    getItems(currentPage)
  }, [currentPage, selectedTab])

  const checkColumn = (tab) => {
    switch (tab) {
      case "current":
        return [
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
                      // history.push(`/home/courier/${record.id}`)
                      console.log("clicked")
                    },
                  },
                  {
                    icon: <DeleteIcon />,
                    color: "red",
                    title: t("delete"),
                    action: () => {
                      console.log("clicked")
                      // setDeleteModal({ id: record.id })
                    },
                  },
                ]}
              />
            ),
          },
        ]
      default:
        return []
    }
  }

  useEffect(() => {
    const _columns = [...initialColumns, ...checkColumn(selectedTab)]
    setColumns(_columns)
  }, [selectedTab])

  const checkStatus = () => {
    switch (selectedTab) {
      case "current":
        return currentStatuses?.ids
      case "history":
        return historyStatuses?.ids
      default:
        break
    }
  }

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

  const calcTimer = (created_at) => {
    const now = moment()
    const create = moment(new Date(created_at + " GMT"))
    const range = Math.round((now - create) / 1000)

    let hour = (range - (range % 3600)) / 3600
    hour = hour.toString().length === 1 ? "0" + hour : hour

    let min = ((range % 3600) - ((range % 3600) % 60)) / 60
    min = min.toString().length === 1 ? "0" + min : min

    let sec = (range % 3600) % 60
    sec = sec.toString().length === 1 ? "0" + sec : sec

    return `${hour}:${min}:${sec}`
  }

  const initialColumns = [
    {
      title: "№",
      key: "order-number",
      render: (record, index) => <div>{currentPage - 1 + index + 1}</div>,
    },
    {
      title: t("client.name"),
      key: "name",
      render: (record) => (
        <div className="cursor-pointer">
          {record.client_name}
          <div className="text-info cursor-pointer">
            {record.client_phone_number}
          </div>
        </div>
      ),
    },
    {
      title: t("order_id"),
      key: "order_id",
      sorter: true,
      render: (record) => <div>{record.external_order_id}</div>,
    },
    {
      title: t("timer"),
      key: "timer",
      sorter: true,
      render: (record) => (
        <div className="w-36">
          <Tag color="green" size="large" shape="subtle">
            <span className="text-green-600">
              {calcTimer(record.created_at)}
            </span>
          </Tag>
          <div className="text-center text-xs mt-2">
            {statusCheck(record.status_id, t)}
          </div>
        </div>
      ),
    },
    {
      title: t("courier"),
      key: "courier",
      filterOptions: [
        { label: t("delivery"), value: "delivery" },
        { label: t("self-pickup"), value: "self-pickup" },
      ],
      onFilter: (val) => {
        console.log(val)
      },
      render: (record) => (
        <div>
          {record.courier.first_name
            ? `${record.courier.first_name} ${record.courier.last_name}`
            : "----"}
        </div>
      ),
    },
    {
      title: t("restaurant"),
      key: "restaurant",
      filterOptions: [
        { label: t("delivery"), value: "delivery" },
        { label: t("self-pickup"), value: "self-pickup" },
      ],
      onFilter: (val) => {
        console.log(val)
      },
      render: (record) => <div>{record.name ? record.name : "----"}</div>,
    },
    {
      title: t("branch"),
      key: "branch",
      render: (record) => (
        <div>
          {record.steps[0].branch_name}
          <div className="text-info cursor-pointer">
            {record.steps[0].phone_number}
          </div>
        </div>
      ),
    },
    {
      title: t("type.delivery"),
      key: "type.delivery",
      filterOptions: [
        { label: t("delivery"), value: "delivery" },
        { label: t("self-pickup"), value: "self-pickup" },
      ],
      onFilter: (val) => {
        console.log(val)
      },
      render: (record) => (
        <Tag color="yellow" size="large" shape="subtle">
          {record.delivery_type}
        </Tag>
      ),
    },
    {
      title: t("price"),
      key: "price",
      sorter: true,
      render: (record) => (
        <div className="font-medium">
          {record.order_amount
            ? new Intl.NumberFormat().format(record.order_amount)
            : "----"}
        </div>
      ),
    },
    {
      title: t("client.address"),
      key: "client.address",
      render: (record) => (
        <div className="truncate w-44">
          <Tooltip title={record.to_address} placement="top">
            <span>{record.to_address}</span>
          </Tooltip>
        </div>
      ),
    },
  ]

  const getItems = (page) => {
    setLoader(true)
    getOrders({ limit: 10, page, status_ids: checkStatus(), courier_id })
      .then((res) => {
        setItems({
          count: res.count,
          data: res.orders,
        })
      })
      .finally(() => setLoader(false))
  }

  const pagination = (
    <Pagination
      title={t("general.count")}
      count={items?.count}
      onChange={(pageNumber) => {
        setCurrentPage(pageNumber)
      }}
    />
  )

  return (
    <div>
      <Card className="m-4" footer={pagination}>
        <Filters style={{ backgroundColor: "transparent", borderTop: "none" }}>
          <StyledTabs
            value={selectedTab}
            onChange={(_, value) => {
              setSelectedTab(value)
            }}
            indicatorColor="primary"
            textColor="primary"
            centered={false}
            aria-label="full width tabs example"
            TabIndicatorProps={{ children: <span className="w-2" /> }}
          >
            <StyledTab label={t("current.orders")} value="current" />
            <StyledTab label={t("history.orders")} value="history" />
          </StyledTabs>
        </Filters>
        <TableContainer className="mt-4 rounded-lg border border-lightgray-1">
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                {columns.map((elm) => (
                  <TableCell key={elm.key}>
                    <TextFilter {...elm} />
                  </TableCell>
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
