import { useTranslation } from "react-i18next";
import "./style.scss";
import { Input } from "alisa-ui";
import RangePicker from "components/DatePicker/RangePicker";
import moment from "moment";
import AutoComplate from "components/Select/AutoComplate";

export default function FilterForm({
  filters,
  setFilters,
  handleChange,
  Status,
  PaymentStatus,
}) {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-3 p-4 gap-4">
      <AutoComplate
        placeholder={t("phone.number")}
        style={{ minWidth: "200px" }}
        url="/search-customers"
        queryName="customer_id"
        queryParams={{ limit: 10 }}
        onFetched={(res) => res.customers}
        formatOptions={(items) =>
          items.map((elm) => ({
            label: elm.name + " " + elm.phone,
            value: elm.id,
          }))
        }
        isClearable
        onChange={(e) => {
          setFilters((old) => ({
            ...old,
            customer_id: e === null ? undefined : e.value,
          }));
        }}
      />
      <AutoComplate
        placeholder={t("branches")}
        style={{ minWidth: "200px" }}
        url="/shippers"
        queryName="shipper"
        queryParams={{ limit: 10 }}
        onFetched={(res) => res.shippers}
        formatOptions={(items) =>
          items.map((elm) => ({ label: elm.name, value: elm.id }))
        }
        isClearable
        onChange={(e) => {
          setFilters((old) => ({
            ...old,
            branch_ids: e === null ? undefined : e.value,
          }));
        }}
      />
      <AutoComplate
        placeholder={t("courier")}
        style={{ minWidth: "200px" }}
        url="/couriers"
        queryName="courier"
        queryParams={{ limit: 10 }}
        onFetched={(res) => res.couriers}
        formatOptions={(items) =>
          items.map((elm) => ({ label: elm.first_name, value: elm.id }))
        }
        isClearable
        onChange={(e) => {
          setFilters((old) => ({
            ...old,
            courier_id: e === null ? undefined : e.value,
          }));
        }}
      />
      <Input
        placeholder={t("order_id")}
        name="order_id"
        style={{ width: 200 }}
        onChange={handleChange}
        value={filters.external_order_id}
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

      <div className="grid grid-cols-2 gap-4">
        <AutoComplate
          placeholder={t("status")}
          style={{ minWidth: "200px" }}
          url="/status_ids"
          isClearable
          queryName="status_ids"
          list={Status}
          formatOptions={(items) =>
            items.map((elm) => ({ label: elm.label, value: elm.id }))
          }
          queryParams={{ type_code: 4 }}
          onFetched={(res) => res.statuses}
          onChange={(val) => {
            setFilters((old) => ({
              ...old,
              status_ids: val === null ? undefined : val.id,
            }));
          }}
        />
        <AutoComplate
          placeholder={t("status")}
          style={{ minWidth: "200px" }}
          url="/status_ids"
          queryName="status_ids"
          isClearable
          list={PaymentStatus}
          queryParams={{ type_code: 4 }}
          onFetched={(res) => res.statuses}
          onChange={(val) => {
            setFilters((old) => ({
              ...old,
              payment_type: val === null ? undefined : val.id,
            }));
          }}
        />
        {/* <Select type="text" placeholder={t('status')}></Select>
                <Select size='large' type="text" placeholder={t('status')}></Select> */}
      </div>
    </div>
  );
}
