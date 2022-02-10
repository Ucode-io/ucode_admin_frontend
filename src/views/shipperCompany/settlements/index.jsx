import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableFooter,
} from "@material-ui/core";

//components
import Pagination from "../../../components/Pagination";
import Card from "../../../components/Card";
import Col from "../../../components/Col";
import LoaderComponent from "../../../components/Loader";
import { getSettlements } from "../../../services/settlements";
import "./style.scss";

//icons
import MonetizationOnOutlinedIcon from "@material-ui/icons/MonetizationOnOutlined";
import StatusBadge from "../../../components/StatusBadge";
import numberToPrice from "../../../helpers/numberToPrice";

export default function Settlements({ name, shipper_id, filters }) {
  const [loader, setLoader] = useState(false);
  const { t } = useTranslation();
  const [items, setItems] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    getItems(currentPage);
  }, [currentPage, filters]);

  const checkAdmission = (value, record) => {
    switch (value) {
      case "Debit":
        return (
          <div className="text-right mr-10">
            {numberToPrice(record.value, t("uzb.sum"))}
          </div>
        );
      default:
        return <></>;
    }
  };

  const checkConsumption = (value, record) => {
    switch (value) {
      case "Credit to Shipper":
      case "Credit to Rasta":
        return (
          <div className="text-right mr-10">
            {numberToPrice(record.value, t("uzb.sum"))}
          </div>
        );
      default:
        return <></>;
    }
  };

  const checkOperation = (value) => {
    switch (value) {
      case "Debit":
        return (
          <StatusBadge className="w-full" color="green">
            Поступление от заказа
          </StatusBadge>
        );
      case "Credit to Shipper":
      case "Credit to Rasta":
        return (
          <StatusBadge className="w-full" color="red">
            Взаиморасчет с филиалом
          </StatusBadge>
        );
      default:
        return <></>;
    }
  };

  const columns = [
    {
      title: "№",
      total: t("balance.branch"),
      key: "order-number",
      render: (record, index) => (
        <div>{(currentPage - 1) * 10 + index + 1}</div>
      ),
    },
    {
      title: t("Ид"),
      key: "order_external_id",
      render: (record) => (
        <div className="truncate w-20 text-primary">
          {record.order_external_id}{" "}
        </div>
      ),
    },
    {
      title: t("expense.type"),
      key: "expense.type",
      render: (record) => <div>{checkOperation(record.expense_type)}</div>,
    },
    {
      title: <div className="text-center">{t("admission")}</div>,
      key: "admission",
      total: (
        <div className="bg-white rounded p-1 text-center border">
          {items.total && numberToPrice(items.total?.total_debit, t("uzb.sum"))}
        </div>
      ),
      render: (record) => (
        <div>{checkAdmission(record.expense_type, record)}</div>
      ),
    },
    {
      title: t("payment.type"),
      key: "payment.type",
      render: (record) => <div>{record.payment_type}</div>,
    },
    {
      title: <div className="text-center">{t("consumption")}</div>,
      key: "consumption",
      total: (
        <div className="bg-white rounded p-1 text-center border">
          {items.total &&
            numberToPrice(items.total?.total_credit, t("uzb.sum"))}
        </div>
      ),
      render: (record) => (
        <div>{checkConsumption(record.expense_type, record)}</div>
      ),
    },
  ];

  const getItems = (page) => {
    setLoader(true);
    getSettlements({
      limit: 10,
      page,
      shipper_id,
      start_date: filters.start_date,
      end_data: filters.end_date,
    })
      .then((res) => {
        setItems({
          count: res.count,
          data: res.settlements,
          total: res.totals,
        });
      })
      .finally(() => setLoader(false));
  };

  const pagination = (
    <Pagination
      title={t("general.count")}
      count={items?.count}
      onChange={(pageNumber) => setCurrentPage(pageNumber)}
    />
  );

  return (
    <div className="p-4 Settlements">
      <Card title={name} footer={pagination} headerClass="px-5 py-5">
        <div className="grid grid-cols-3 gap-4 font-medium">
          <Col>
            <div className="flex items-center">
              <span>
                <MonetizationOnOutlinedIcon style={{ color: "#38D9B9" }} />
              </span>
              <h3 className="ml-4 ">{t("balance")}</h3>
            </div>
            <span>
              {items.total && numberToPrice(items.total?.balance, t("uzb.sum"))}
            </span>
          </Col>

          <Col>
            <div className="flex items-center">
              <span>
                <MonetizationOnOutlinedIcon color="secondary" />
              </span>
              <h3 className="ml-4 ">{t("settlement.company")}</h3>
            </div>
            <span>
              {items.total &&
                numberToPrice(items.total?.shipper_share, t("uzb.sum"))}
            </span>
          </Col>

          <Col>
            <div className="flex items-center">
              <span>
                <MonetizationOnOutlinedIcon color="secondary" />
              </span>
              <h3 className="ml-4 ">
                {t(`sales`) + items.total?.settlement_rate + t("percent.sales")}
              </h3>
            </div>
            <span>
              {items.total &&
                numberToPrice(items.total?.rasta_share, t("uzb.sum"))}
            </span>
          </Col>
        </div>
        <TableContainer
          className="mt-8 rounded-lg border bordercolor"
          style={{ overflowX: "hidden" }}
        >
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                {columns.map((elm, index) => (
                  <TableCell key={elm.key}>{elm.title}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody className="table_body">
              {items.data && items.data.length ? (
                items.data.map((item, index) => (
                  <TableRow key={item.id}>
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
            <TableFooter className="bg-gray-50">
              <TableRow>
                {columns.map((col) => (
                  <TableCell key={col.key} style={{ width: "auto" }}>
                    {col.render ? (
                      <h3 className="font-medium text-sm text-black">
                        {col.total}
                      </h3>
                    ) : (
                      "----"
                    )}
                  </TableCell>
                ))}
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>

        <LoaderComponent isLoader={loader} />
      </Card>
    </div>
  );
}
