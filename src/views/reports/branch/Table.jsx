import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Card from "../../../components/Card";
import Pagination from "../../../components/Pagination";
import LoaderComponent from "../../../components/Loader";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import { getBranchReports } from "../../../services/reports";
import numberToPrice from "../../../helpers/numberToPrice";

function convertMinsToHrsMins(minutes) {
  var h = Math.floor(minutes / 60);
  var m = minutes % 60;
  return h + " ч. " + m + " мин.";
}

export default function RestaurantTable({ filters }) {
  const [loader, setLoader] = useState(true);
  const { t } = useTranslation();
  const [items, setItems] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  useEffect(() => {
    getItems(currentPage);
  }, [currentPage, filters, limit]);

  const getItems = (page) => {
    setLoader(true);
    getBranchReports({ limit, page, ...filters })
      .then((res) => {
        setItems({
          count: res.count,
          data: res.branches_report,
        });
      })
      .finally(() => setLoader(false));
  };

  const columns = [
    {
      title: "№",
      key: "order-number",
      render: (_, index) => <>{(currentPage - 1) * 10 + index + 1}</>,
    },
    {
      title: t("name"),
      key: "name",
      dataIndex: "name",
    },
    {
      title: t("Среднее завершенное время"),
      key: "avg_finished_time",
      dataIndex: "avg_finished_time",
      render: (record) => (
        <>
          {record.avg_finished_time && record.avg_finished_time != 0
            ? convertMinsToHrsMins(record.avg_finished_time)
            : "0 мин"}
        </>
      ),
    },
    {
      title: t("Кол-во заказов"),
      key: "order_count",
      dataIndex: "order_count",
    },
    {
      title: t("Доход"),
      key: "income",
      dataIndex: "income",
      render: (record) => (
        <>{record.income ? numberToPrice(record.income, "сум") : "0 сум"}</>
      ),
    },
    {
      title: t("Средняя сумма"),
      key: "avg_income",
      dataIndex: "avg_income",
      render: (record) => (
        <>
          {record.avg_income
            ? numberToPrice(record.avg_income, "сум")
            : "0 сум"}
        </>
      ),
    },
    {
      title: t("Рейтинг"),
      key: "rating",
      dataIndex: "rating",
    },
  ];

  return (
    <Card
      className="m-4"
      footer={
        <Pagination
          title={t("general.count")}
          count={items?.count}
          onChange={(pageNumber) => setCurrentPage(pageNumber)}
          pageCount={limit}
          limit={limit}
          onChangeLimit={(limitNumber) => setLimit(limitNumber)}
        />
      }
    >
      {!loader && (
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
      )}

      <LoaderComponent isLoader={loader} />
    </Card>
  );
}
