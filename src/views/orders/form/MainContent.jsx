import "./style.scss";
import { useState, useEffect } from "react";
import Card from "components/Card";
import Form from "components/Form/Index";
import Select, { customStyles } from "components/Select";
import TextArea from "components/Textarea";
import { Input } from "alisa-ui";
import MapContent from "./MapContent";
import CreatableSelect from "react-select/creatable";
import { getCustomers } from "services";
import { useTranslation } from "react-i18next";
import { Phone } from "@material-ui/icons";
import AddressDropdown from "components/Filters/AddressDropdown";
import OutsideClickHandler from "react-outside-click-handler";

export default function MainContent({
  formik,
  shippers,
  branches,
  deliveryPrice,
  fares,
  setAddressList,
  setSearchAddress,
  addressList,
  distance,
  ...props
}) {
  const { t } = useTranslation();
  const { values, handleChange, setFieldValue } = formik;
  const [customers, setCustomers] = useState([]);
  const [branch, setBranch] = useState(null);
  const branchItem = branch?.branches?.map((elm) => elm?.name);
  console.log("branches", branchItem);
  console.log("values", values);

  useEffect(() => {
    getClients();
  }, []);

  const getClients = (search) => {
    getCustomers({ limit: 10, search })
      .then((res) =>
        setCustomers(
          res.customers?.map((elm) => ({
            label: `${elm.phone} (${elm.name})`,
            value: elm.id,
            elm,
          })),
        ),
      )
      .catch((err) => console.log(err));
  };

  const onSearchCustomer = (inputValue, actionMeta) => {
    getClients(inputValue);
  };

  const onSearchClientType = (inputValue, actionMeta) => {
    // getClientTypes(inputValue);
  };

  const onClientSelect = (newValue, actionMeta) => {
    setFieldValue("client", { ...newValue, action: actionMeta.action });
    if (actionMeta.action === "create-option") {
      setFieldValue("client_first_name", "");
      setFieldValue("client_last_name", "");
    } else {
      setFieldValue("client_first_name", newValue?.elm?.name);
      setFieldValue("client_last_name", newValue?.elm?.last_name);
    }
  };

  const onClientTypeSelect = (newValue, actionMeta) => {
    setFieldValue("client", { ...newValue, action: actionMeta.action });
    if (actionMeta.action === "create-option") {
      setFieldValue("client_first_name", "");
    } else {
      setFieldValue("client_first_name", newValue?.elm?.first_name);
      setFieldValue("client_first_name", newValue?.elm?.last_name);
    }
  };

  return (
    <>
      <div className="flex">
        <div className="w-2/5 mr-4">
          <Card title={t("client")}>
            <div className="w-full flex items-baseline mb-4">
              <div className="w-1/3 input-label">
                <span>{t("phone.number")}</span>
              </div>
              <div className="w-2/3">
                <Form.Item formik={formik} name="client">
                  <CreatableSelect
                    options={customers}
                    value={values.client}
                    formatCreateLabel={(inputText) =>
                      `${t("create")} "${inputText}"`
                    }
                    styles={customStyles({})}
                    onChange={onClientSelect}
                    onInputChange={onSearchCustomer}
                    placeholder={t("phone.number")}
                    className="react-select-input"
                  />
                </Form.Item>
              </div>
            </div>

            <div className="w-full flex items-baseline mb-4">
              <div className="w-1/3 input-label">
                <span>{t("client.type")}</span>
              </div>
              <div className="w-2/3">
                <Form.Item formik={formik} name="client_type">
                  <CreatableSelect
                    options={[{ label: "", value: "" }]}
                    value={values.client_type}
                    formatCreateLabel={(inputText) =>
                      `${t("create")} "${inputText}"`
                    }
                    styles={customStyles({})}
                    onChange={onClientTypeSelect}
                    onInputChange={onSearchClientType}
                    placeholder={t("client.type")}
                    className="react-select-input"
                  />
                </Form.Item>
              </div>
            </div>

            <div className="w-full flex items-baseline">
              <div className="w-1/3 input-label">
                <span>{t("first.name")}</span>
              </div>
              <div className="w-2/3">
                <Form.Item formik={formik} name="client_first_name">
                  <Input
                    id="client_first_name"
                    placeholder={t("first.name")}
                    value={values.client_first_name}
                    onChange={handleChange}
                  />
                </Form.Item>
              </div>
            </div>

            <div className="w-full flex items-baseline">
              <div className="w-1/3 input-label">
                <span>{t("last.name")}</span>
              </div>
              <div className="w-2/3">
                <Form.Item formik={formik} name="client_last_name">
                  <Input
                    id="client_last_name"
                    placeholder={t("last.name")}
                    value={values.client_last_name}
                    onChange={handleChange}
                  />
                </Form.Item>
              </div>
            </div>
          </Card>

          <Card title={t("comments")} className="mt-4">
            <div className="w-full flex items-baseline">
              <div className="w-1/3 input-label">
                <span>{t("client.description")}</span>
              </div>
              <div className="w-2/3">
                <Form.Item formik={formik} name="client_description">
                  <TextArea
                    size={5}
                    id="client_description"
                    value={values.client_description}
                    onChange={handleChange}
                    placeholder={t("client.description")}
                  />
                </Form.Item>
              </div>
            </div>

            <div className="w-full flex items-baseline">
              <div className="w-1/3 input-label">
                <span>{t("order.description")}</span>
              </div>
              <div className="w-2/3">
                <Form.Item formik={formik} name="order_description">
                  <TextArea
                    size={5}
                    id="order_description"
                    value={values.order_description}
                    onChange={handleChange}
                    placeholder={t("order.description")}
                  />
                </Form.Item>
              </div>
            </div>
          </Card>
        </div>

        <Card
          title={
            <div className="flex justify-between">
              <span>{t("type-delivery")}</span>
              {distance && (
                <span className="font-normal text-sm">
                  {t("distance")}:{" "}
                  <span className="font-bold">
                    {distance} {t("km")}
                  </span>
                </span>
              )}
            </div>
          }
          className="w-3/5"
        >
          <div className="w-full grid grid-cols-2 gap-6">
            <div className="flex items-baseline">
              <div className="w-1/3 input-label">
                <span>{t("delivery.type")}</span>
              </div>
              <div className="w-2/3">
                <Form.Item formik={formik} name="delivery_type">
                  <Select
                    id="delivery_type"
                    options={[
                      { label: t("type-delivery"), value: "delivery" },
                      { label: t("type-self-pickup"), value: "self-pickup" },
                    ]}
                    value={values.delivery_type}
                    placeholder={t("delivery.type")}
                    onChange={(val) => setFieldValue("delivery_type", val)}
                  />
                </Form.Item>
              </div>
            </div>
            <div className="flex items-baseline">
              <div className="w-1/3 input-label">
                <span>{t("fares")}</span>
              </div>
              <div className="w-2/3">
                <Form.Item formik={formik} name="co_delivery_price">
                  <Input
                    id="co_delivery_price"
                    placeholder={t("fares")}
                    value={deliveryPrice}
                    onChange={handleChange}
                  />
                </Form.Item>
              </div>
            </div>
          </div>

          <div className="w-full flex items-baseline position-relative">
            <div className="input-label w-2/12">
              <span>{t("address")}</span>
            </div>
            <div className="w-10/12">
              <Form.Item formik={formik} name="to_address">
                <Input
                  id="to_address"
                  placeholder={t("address")}
                  value={values.to_address}
                  onChange={(e) => {
                    handleChange(e);
                    setSearchAddress(e.target.value);
                  }}
                  autocomplete="off"
                />
              </Form.Item>
              {addressList.length > 0 && (
                <OutsideClickHandler onOutsideClick={() => setAddressList([])}>
                  <AddressDropdown
                    options={addressList}
                    setAddressList={setAddressList}
                    setFieldValue={setFieldValue}
                    setSearchAddress={setSearchAddress}
                    setPlacemarkGeometry={props.setPlacemarkGeometry}
                  />
                </OutsideClickHandler>
              )}
            </div>
          </div>

          <MapContent
            branches={branches}
            formik={formik}
            {...props}
            setBranch={setBranch}
          />

          <div className="w-full mt-4 grid grid-cols-2 gap-6">
            <div className="flex items-baseline">
              <div className="w-1/3 input-label">
                <span>{t("restaurant")}</span>
              </div>
              <div className="w-2/3">
                <Form.Item formik={formik} name="restaurant">
                  <Input
                    id="restaurant"
                    value={values.restaurant}
                    onChange={handleChange}
                    placeholder={t("restaurant")}
                  />
                </Form.Item>
              </div>
            </div>

            <div className="flex items-baseline">
              <div className="w-1/3 input-label">
                <span>{t("branch")}</span>
              </div>
              <div className="w-2/3">
                <Form.Item formik={formik} name="branch">
                  <Select
                    id="branch"
                    value={values.branch}
                    options={branchItem}
                    placeholder={t("branch")}
                    onChange={(val) => setFieldValue("branch", val)}
                  />
                </Form.Item>
              </div>
            </div>

            <div className="flex items-baseline">
              <div className="w-1/3 input-label">
                <span>{t("apartment_block")}</span>
              </div>
              <div className="w-2/3">
                <Form.Item formik={formik} name="apartment_block">
                  <Input
                    id="apartment_block"
                    value={values.apartment_block}
                    onChange={handleChange}
                    placeholder={t("apartment_block")}
                  />
                </Form.Item>
              </div>
            </div>

            <div className="flex items-baseline">
              <div className="w-1/3 input-label">
                <span>{t("apartment")}</span>
              </div>
              <div className="w-2/3">
                <Form.Item formik={formik} name="apartment">
                  <Input
                    id="apartment"
                    value={values.apartment}
                    onChange={handleChange}
                    placeholder={t("apartment")}
                  />
                </Form.Item>
              </div>
            </div>

            <div className="flex items-baseline">
              <div className="w-1/3 input-label">
                <span>{t("floor")}</span>
              </div>
              <div className="w-2/3">
                <Form.Item formik={formik} name="floor">
                  <Input
                    id="floor"
                    value={values.floor}
                    onChange={handleChange}
                    placeholder={t("floor")}
                  />
                </Form.Item>
              </div>
            </div>

            <div className="flex">
              <div className="w-1/3 input-label">
                <span>{t("intercom")}</span>
              </div>
              <div className="w-2/3">
                <Form.Item formik={formik} name="intercom">
                  <Input
                    defaultValue={values.branch?.elm?.intercom ?? ""}
                    addonBefore={
                      <Phone className="text-primary" fontSize="small" />
                    }
                    placeholder={t("intercom")}
                    id="name"
                  />
                </Form.Item>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}
