import { useState, useEffect } from "react";
import { StyledTab, StyledTabs } from "components/StyledTabs/index";
import { useTranslation } from "react-i18next";
import OrderTable from "./Table";
import { getCountOrder } from "services/order";
import { statusTabList } from "constants/statuses";
import { useSelector } from "react-redux";

const StatusBar = ({ filters, columns, setColumns }) => {
  const { t } = useTranslation();
  const [tabValue, setTabValue] = useState(statusTabList[0].id);
  const [ordersCount, setOrdersCount] = useState([]);
  const { region_id } = useSelector((state) => state.auth);

  useEffect(() => {
    const interval = setInterval(() => {
      getCount();
    }, 5000);

    return () => clearInterval(interval);
  }, [filters]);

  useEffect(() => {
    getCount();
  }, []);

  const getCount = () => {
    const formatStatusList = Array.from(
      new Set(
        statusTabList
          .map((elm) => elm.id.split(","))
          .reduce((acc, curr) => [...acc, ...curr], [])
          .map((el) => el.trim()),
      ),
    );
    getCountOrder({
      status_ids: formatStatusList.join(","),
      start_date: filters.start_date,
      end_date: filters.end_date,
    })
      .then((res) => {
        setOrdersCount(res.orders_count);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const defineCount = (id, arr = []) => {
    if (id.length > 400) {
      return false;
    }
    const ids = id.split(",");
    if (ids.length > 1) {
      let count = 0;
      arr.forEach((elm) => {
        if (ids.includes(elm.status_id)) {
          count += +elm.count;
        }
      });
      return count;
    } else {
      return arr.find((elm) => id === elm.status_id)?.count ?? 0;
    }
  };

  const TabLabel = ({ isActive = false, count, children }) => {
    return (
      <div className="flex items-center">
        <span
          className={`px-1 ${isActive ? "text-blue-600" : "text-secondary"}`}
        >
          {children}
        </span>
        {count > 0 ? (
          <span
            className={`inline-flex items-center 
                justify-center px-1.5 py-1 ml-2 text-xs 
                font-bold leading-none text-white
                ${isActive ? "bg-blue-600" : "bg-secondary"} rounded-full`}
          >
            {count}
          </span>
        ) : (
          <></>
        )}
      </div>
    );
  };

  return (
    <OrderTable
      columns={columns}
      setColumns={setColumns}
      tabValue={tabValue}
      filters={filters}
    >
      <div className="px-4">
        <StyledTabs
          value={tabValue}
          onChange={(e, val) => {
            setTabValue(val);
          }}
          centered={false}
        >
          {statusTabList.map((elm) => (
            <StyledTab
              key={elm.id + Math.random()}
              value={elm.id}
              label={
                <TabLabel
                  isActive={elm.id === tabValue}
                  count={defineCount(elm.id, ordersCount)}
                >
                  {t(elm.label)}
                </TabLabel>
              }
            />
          ))}
        </StyledTabs>
      </div>
    </OrderTable>
  );
};

export default StatusBar;
