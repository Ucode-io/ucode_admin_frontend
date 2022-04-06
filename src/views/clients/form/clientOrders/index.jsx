import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import { useTranslation } from "react-i18next";
//components
import Pagination from "../../../../components/Pagination";
import LoaderComponent from "../../../../components/Loader";
import Card from "../../../../components/Card";
import { getOrders } from "../../../../services";
import Tag from "../../../../components/Tag";
import { StyledTab, StyledTabs } from "../../../../components/StyledTabs";
import Filters from "../../../../components/Filters";
import {
  historyStatuses,
  currentStatuses,
} from "../../../../constants/statuses";

export default function OrderClient({ customer_id }) {
  const { t } = useTranslation();
  const [items, setItems] = useState({});
  const [loader, setLoader] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTab, setSelectedTab] = useState("current");
  const [counts, setCounts] = useState({
    current: 0,
    history: 0,
  });

  const history = useHistory();

  const fetData = async (page) => {
    try {
      const current = await getOrders({
        limit: 10,
        page,
        status_ids: currentStatuses.ids,
      });
      // setCounts({ cur: current.count })
      const history = await getOrders({
        limit: 10,
        page,
        status_ids: historyStatuses.ids,
      });
      setCounts({ current: current.count, history: history.count });
    } catch (e) {
      console.log(e);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    fetData(currentPage);
    getItems(currentPage);
  }, [currentPage, selectedTab]);

  const checkStatus = () => {
    switch (selectedTab) {
      case "current":
        return currentStatuses?.ids;
      case "history":
        return historyStatuses?.ids;
      default:
        break;
    }
  };

  const getItems = (page) => {
    setLoader(true);
    getOrders({ limit: 10, page, status_ids: checkStatus() })
      .then((res) => {
        setCounts((prev) => ({ ...prev, [selectedTab]: res.count }));
        setItems({
          count: res.count,
          data: res.orders,
        });
        console.log("res", res);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setLoader(false));
  };

  const TabLabel = ({ isActive = false, count, children }) => {
    return (
      <div className="flex items-center">
        <span className="px-1">{children}</span>
        {count > 0 ? (
          <span
            className={`inline-flex items-center 
                justify-center px-1.5 py-1 ml-2 text-xs 
                font-bold leading-none text-red-100 
                bg-blue-600 rounded-full`}
          >
            {count}
          </span>
        ) : (
          <></>
        )}
      </div>
    );
  };

  const pagination = (
    <Pagination
      title={t("general.count")}
      count={items?.count}
      onChange={(pageNumber) => setCurrentPage(pageNumber)}
    />
  );

  return (
    <div>
      <Card className="m-4" footer={pagination}>
        <Filters style={{ backgroundColor: "transparent" }}>
          <StyledTabs
            value={selectedTab}
            onChange={(_, value) => setSelectedTab(value)}
            indicatorColor="primary"
            textColor="primary"
            centered={false}
            aria-label="full width tabs example"
            TabIndicatorProps={{ children: <span className="w-2" /> }}
          >
            <StyledTab
              label={
                <TabLabel count={counts.current}>
                  {t("current.orders")}
                </TabLabel>
              }
              value="current"
            />
            <StyledTab
              label={
                <TabLabel count={counts.history}>
                  {t("history.orders")}
                </TabLabel>
              }
              value="history"
            />
          </StyledTabs>
        </Filters>
        <TableContainer className="mt-4 rounded-lg border border-lightgray-1">
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>№</TableCell>
                <TableCell>{t("order_id")}</TableCell>
                <TableCell>{t("created.date")}</TableCell>
                <TableCell>{t("client.address")}</TableCell>
                <TableCell>{t("sum")}</TableCell>
                <TableCell>{t("operator1")}</TableCell>
                <TableCell>{t("branch")}</TableCell>
                <TableCell>{t("type.delivery")}</TableCell>
                <TableCell>{t("source")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.data && items.data.length ? (
                items.data.map(
                  (
                    {
                      id,
                      external_order_id,
                      created_at,
                      to_address,
                      order_amount,
                      steps,
                      delivery_type,
                      source,
                    },
                    index,
                  ) => (
                    <TableRow
                      className={index % 2 === 0 ? "bg-lightgray-5" : ""}
                      key={id}
                    >
                      <TableCell>
                        <p>{(currentPage - 1) * 10 + index + 1}</p>
                      </TableCell>
                      <TableCell>{external_order_id}</TableCell>
                      <TableCell>{created_at}</TableCell>
                      <TableCell>{to_address}</TableCell>
                      <TableCell>{order_amount}</TableCell>
                      <TableCell>----</TableCell>
                      <TableCell>{steps[0]?.branch_name}</TableCell>
                      <TableCell>
                        <Tag color="yellow" className="p-1">
                          {delivery_type}
                        </Tag>
                      </TableCell>
                      <TableCell>
                        <Tag color="purple" className="p-1">
                          {source}
                        </Tag>
                      </TableCell>
                    </TableRow>
                  ),
                )
              ) : (
                <></>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <LoaderComponent isLoader={loader} />
      </Card>
    </div>
  );
}
