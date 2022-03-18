import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from "@material-ui/core";
import Tag from "components/Tag/index";
import axios from "utils/axios";
import Modal from "components/Modal";
import EditIcon from "@material-ui/icons/Edit";
import DirectionsCarIcon from "@material-ui/icons/DirectionsCar";
import CheckIcon from "@material-ui/icons/Check";
import AccessTimeIcon from "@material-ui/icons/AccessTime";
import Pagination from "components/Pagination";
import TableLoader from "components/TableLoader";
import { useHistory } from "react-router-dom";
import Textarea from "components/Textarea/index";
import { useTranslation } from "react-i18next";
import TextFilter from "components/Filters/TextFilter";
import Card from "components/Card";
import {
  getOrders,
  getShippers,
  getCouriers,
  getBranchesCount,
  getCustomersCount,
} from "services";
import { statusCheck } from "./statuses";
import RefreshIcon from "@material-ui/icons/Refresh";
import ClearIcon from "@material-ui/icons/Clear";
import ActionMenu from "components/ActionMenu";
import SwitchColumns from "components/Filters/SwitchColumns";
import orderTimer from "helpers/orderTimer";
import numberToPrice from "helpers/numberToPrice";
import parseQuery from "helpers/parseQuery";

const OrderTable = ({
  filters: { start_date, end_date, external_order_id },
  tabValue,
  children,
}) => {
  const { t } = useTranslation();
  const history = useHistory();
  const [items, setItems] = useState({});
  const [loader, setLoader] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [msg, setMsg] = useState("");
  const [filters, setFilters] = useState({
    customer_id: undefined,
    branch_ids: undefined,
    courier_id: undefined,
    payment_type: undefined,
  });
  const { tab } = parseQuery();

  async function fetchData() {
    try {
      let { customers } = await getCustomersCount({ limit: 1000, page: 1 });
      customers = customers?.map((elm) => ({
        label: elm.name,
        value: elm.id,
      }));
      let { branches } = await getBranchesCount({ limit: 1000, page: 1 });
      branches = branches?.map((elm) => ({ label: elm.name, value: elm.id }));

      let { couriers } = await getCouriers({ limit: 1000, page: 1 });
      couriers = couriers?.map((elm) => ({
        label: elm.first_name + elm.last_name,
        value: elm.id,
      }));

      let _columns = makeColumns({ couriers, customers, branches });
      console.log("_columns", _columns);
      _columns = [
        ..._columns,
        {
          title: (
            <SwitchColumns
              columns={_columns}
              onChange={(val) => {
                setColumns((prev) => [...val, prev[prev.length - 1]]);
              }}
            />
          ),
          key: "actions",
          render: (record) => (
            <div>
              <ActionMenu
                id={record.id}
                actions={[
                  {
                    title: t("Повторить выставить счет"),
                    icon: <RefreshIcon />,
                    color: "yellow",
                    action: () => history.push(`/home/orders/${record.id}`),
                  },
                  {
                    title: t("courier.declined"),
                    icon: <DirectionsCarIcon />,
                    color: "indigo",
                    action: () => history.push(`/home/orders/${record.id}`),
                  },
                  {
                    title: t("edit"),
                    icon: <EditIcon />,
                    color: "blue",
                    action: () => history.push(`/home/orders/${record.id}`),
                  },
                  {
                    title: t("delete"),
                    icon: <ClearIcon />,
                    color: "red",
                    action: () =>
                      setDeleteModal({
                        id: record.id,
                        shipper_id: record.shipper_id,
                      }),
                  },
                  {
                    title: t("end.process"),
                    icon: <CheckIcon />,
                    color: "green",
                    action: () => history.push(`/home/orders/${record.id}`),
                  },
                ]}
              />
            </div>
          ),
        },
      ];
      setColumns(_columns);
    } catch (e) {
      console.log(e);
    }
  }
  useEffect(() => {
    fetchData();
  }, [currentPage, limit]);

  useEffect(() => {
    setLoader(true);
    getItems(currentPage, tabValue, limit);
    const interval = setInterval(() => {
      getItems(currentPage, tabValue, limit);
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [currentPage, filters, tabValue, limit, start_date, end_date]);

  useEffect(() => {
    setCurrentPage(1);
  }, [tabValue]);

  const getItems = (page, el, limit) => {
    const isLast = el.length > 400;
    const form = {
      page,
      limit,
      status_ids: tabValue,
      start_date,
      end_date,
      external_order_id,
    };
    if (isLast) {
      delete form.start_date;
      delete form.end_date;
    }
    getOrders({
      ...form,
      ...filters,
    })
      .then((res) => {
        setItems({
          count: res.count,
          data: res.orders,
        });
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setLoader(false));
  };

  const handleMsg = (e) => {
    setMsg(e.target.value);
  };

  useEffect(() => {
    if (deleteModal === null) {
      setMsg("");
    }
  }, [deleteModal]);

  const changeStatus = () => {
    axios
      .patch(
        `/order/${deleteModal.id}/change-status?shipper_id=${deleteModal.shipper_id}`,
        {
          description: msg,
          status_id: "b5d1aa93-bccd-40bb-ae29-ea5a85a2b1d1",
        },
      )
      .then((res) => {
        setDeleteModal(null);
        getItems(currentPage);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const makeColumns = ({ couriers, customers, branches }) => [
    {
      title: "№",
      key: "order-number",
      render: (_, index) => {
        return (currentPage - 1) * limit + index + 1;
      },
    },
    {
      title: t("client.name"),
      key: "name",
      filterOptions: customers,
      onFilter: (ids) => {
        setFilters((old) => ({
          ...old,
          customer_id: ids.length ? ids.join(",") : undefined,
        }));
      },
      render: (record) => (
        <div className="cursor-pointer">
          {record.client_name}
          <a
            href={`tel:${record.client_phone_number}`}
            className="text-info cursor-pointer block"
          >
            {record.client_phone_number}
          </a>
        </div>
      ),
    },
    {
      title: t("order_id"),
      key: "order_id",
      render: (record) => <div>{record.external_order_id}</div>,
    },
    {
      title: t("timer"),
      key: "timer",
      render: (record) => {
        return (
          <div className="flex justify-center">
            <div className="w-36">
              <Tag color="green" size="large" shape="subtle">
                <span className="text-green-600 flex items-center">
                  <AccessTimeIcon fontSize="small" className="mr-2" />
                  {orderTimer(record.created_at, record.finished_at)}
                </span>
              </Tag>

              <div className="text-center text-xs mt-2">
                {statusCheck(record.status_id, t)}
              </div>
            </div>
          </div>
        );
      },
    },

    {
      title: t("courier"),
      key: "courier",
      filterOptions: couriers,
      onFilter: (ids) => {
        setFilters((old) => ({
          ...old,
          courier_id: ids.length ? ids.join(",") : undefined,
        }));
      },
      render: (record) => (
        <div>
          {record.courier.first_name
            ? `${record.courier.first_name} ${record.courier.last_name}`
            : "----"}
          <a
            href={`tel:${record.courier.phone}`}
            className="text-info cursor-pointer block"
          >
            {record.courier.phone}
          </a>
        </div>
      ),
    },
    {
      title: t("branch"),
      key: "branch",
      filterOptions: branches,
      onFilter: (ids) => {
        setFilters((old) => ({
          ...old,
          branch_ids: ids.length ? ids.join(",") : undefined,
        }));
      },
      render: (record) => (
        <div>
          {record.steps[0].branch_name}
          <a
            href={`tel:${record.steps[0].phone_number}`}
            className="text-info cursor-pointer block"
          >
            {record.steps[0].phone_number}
          </a>
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
      onFilter: (ids) => {
        setFilters((old) => ({
          ...old,
          delivery_type: ids.length ? ids.join(",") : undefined,
        }));
      },
      render: (record) => (
        <Tag color="yellow" size="large" shape="subtle">
          {t(
            record.delivery_type === "delivery"
              ? "type-delivery"
              : "type-self-pickup",
          )}
        </Tag>
      ),
    },
    {
      title: t("order.price"),
      key: "price",
      sorter: true,
      render: (record) => (
        <div className="font-medium">
          {record.order_amount
            ? numberToPrice(record.order_amount, "сум")
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
  ];

  const [columns, setColumns] = useState([]);

  return (
    <div className="p-4">
      <Card
        title={children}
        headerStyle={{ padding: 0 }}
        footer={
          <Pagination
            title={t("general.count")}
            count={items?.count}
            pageCount={limit}
            onChange={(pageNumber) => setCurrentPage(pageNumber)}
            onChangeLimit={(limitNumber) => setLimit(limitNumber)}
            limit={limit}
          />
        }
      >
        <TableContainer className="rounded-md border border-bordercolor">
          <Table aria-label="simple table" className="orders-table">
            <TableHead>
              <TableRow>
                {columns.map((elm) => (
                  <>
                    <TableCell key={elm.key}>
                      <TextFilter {...elm} />
                    </TableCell>
                  </>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {items.data &&
                items.data.length &&
                items.data.map((elm, index) => (
                  <TableRow
                    className={index % 2 === 0 ? "bg-lightgray-5" : ""}
                    onClick={() => history.push(`/home/orders/${elm.id}`)}
                    key={elm.id}
                  >
                    {columns.map((col, index2) => (
                      <TableCell
                        key={col.key}
                        style={{
                          backgroundColor:
                            index % 2 === 0 && index2 === columns.length - 1
                              ? "#F4F6FA"
                              : "",
                        }}
                      >
                        {col.render
                          ? col.render(elm, index)
                          : elm[col.dataIndex]}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TableLoader isVisible={loader} />
      </Card>

      <Modal
        disable={msg.length >= 1 ? false : true}
        open={deleteModal}
        onClose={() => setDeleteModal(null)}
        onConfirm={changeStatus}
        loading={deleteLoading}
      >
        <Textarea
          aria-label="minimum height"
          minRows={3}
          className="mb-6"
          placeholder="Причина"
          error={msg.length >= 1 ? false : true}
          onChange={(e) => handleMsg(e)}
          value={msg}
        />
      </Modal>
    </div>
  );
};

export default OrderTable;
