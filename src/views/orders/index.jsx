import { useState } from "react";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import moment from "moment";
import { Input } from "alisa-ui";
import AddIcon from "@material-ui/icons/Add";
import SearchIcon from "@material-ui/icons/Search";
import StatusBar from "./StatusBar";
import FilterForm from "./FilterForm";
import Header from "components/Header";
import Filter from "components/Filters";
import RangePicker from "components/DatePicker/RangePicker";
import Button from "components/Button";
import { DownloadIcon } from "constants/icons";
import "./style.scss";

export default function Orders() {
  const { t } = useTranslation();
  const history = useHistory();
  const [open, setOpen] = useState(false);

  const [filters, setFilters] = useState({
    customer_id: undefined,
    branch_ids: undefined,
    courier_id: undefined,
    start_date: moment().format("YYYY-MM-DD"),
    end_date: moment().add(1, "d").format("YYYY-MM-DD"),
    external_order_id: undefined,
    payment_type: undefined,
  });

  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const Status = [
    {
      label: t("new"),
      id: 1,
    },
    {
      label: t("branch.accepted"),
      id: 2,
    },
    {
      label: t("branch.prepared"),
      id: 3,
    },
    {
      label: t("courier.accepted"),
      id: 4,
    },
    {
      label: t("courier.onTheWay"),
      id: 5,
    },
    {
      label: t("operator.accepted"),
      id: 6,
    },
    {
      label: t("operator.declined"),
      id: 7,
    },
    {
      label: t("finished"),
      id: 8,
    },
    {
      label: t("server.declined"),
      id: 9,
    },
  ];

  const PaymentStatus = [
    {
      label: t("cash"),
      id: 10,
    },
  ];

  return (
    <>
      <Header
        title={t("orders")}
        endAdornment={[
          <Button
            size="medium"
            icon={AddIcon}
            onClick={() => history.push(`/home/orders/create`)}
          >
            {t("create.order")}
          </Button>,
        ]}
      />
      <Filter
        extra={
          <div className="flex gap-4">
            {/* <Button
              icon={DownloadIcon}
              iconClassName="text-blue-600"
              color="zinc"
              shape="outlined"
              size="medium"
              onClick={() => console.log("clicked")}
            >
              {t("download")}
            </Button> */}
          </div>
        }
      >
        <div className="flex gap-4">
          <Input
            width={240}
            placeholder={t("search")}
            size="middle"
            addonBefore={
              <SearchIcon style={{ fill: "var(--color-primary)" }} />
            }
            onChange={(e) => {
              setFilters((old) => ({
                ...old,
                external_order_id: e.target.value,
              }));
            }}
          />
          <RangePicker
            hideTimePicker
            placeholder={t("order.period")}
            onChange={(e) => {
              e[0] === null
                ? setFilters((old) => ({
                    ...old,
                    start_date: undefined,
                    end_date: undefined,
                  }))
                : setFilters((old) => ({
                    ...old,
                    start_date: moment(e[0]).format("YYYY-MM-DD"),
                    end_date: moment(e[1]).format("YYYY-MM-DD"),
                  }));
            }}
          />
        </div>
      </Filter>
      {open && (
        <div className="filterForm">
          <FilterForm
            filters={filters}
            setFilters={setFilters}
            handleChange={handleChange}
            Status={Status}
            PaymentStatus={PaymentStatus}
          />
        </div>
      )}
      <StatusBar filters={filters} />
    </>
  );
}
