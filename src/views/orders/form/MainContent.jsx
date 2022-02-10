import "./style.scss"
import { useState, useEffect } from "react"
import Card from "../../../components/Card"
import Form from "../../../components/Form/Index"
import Select, { customStyles } from "../../../components/Select"
import Switch from "../../../components/Switch"
import TextArea from "../../../components/Textarea"
import { Input } from "alisa-ui"
import MapContent from "./MapContent"
import RequiredStar from "../../../components/RequiredStar"
import AutoComplate from "../../../components/Select/AutoComplate"
import CreatableSelect from "react-select/creatable"
import { getCustomers } from "../../../services"
import { useTranslation } from "react-i18next"
import { LocationOn, Phone, PlaceIcon } from "@material-ui/icons"
import { Radio, RadioGroup } from "../../../components/Radio"
import AddressDropdown from "../../../components/Filters/AddressDropdown"
import OutsideClickHandler from "react-outside-click-handler"

export default function MainContent({
  formik,
  shippers,
  branches,
  deliveryPrice,
  fares,
  setAddressList,
  setSearchAddress,
  addressList,
  ...props
}) {
  const { t } = useTranslation()
  const { values, handleChange, setFieldValue } = formik
  const [customers, setCustomers] = useState([])
  const [anchorEl, setAnchorEl] = useState(null)
  useEffect(() => {
    getClients()
  }, [])

  const getClients = (search) => {
    getCustomers({ limit: 10, search })
      .then((res) =>
        setCustomers(
          res.customers?.map((elm) => ({
            label: `${elm.phone} (${elm.name})`,
            value: elm.id,
            elm,
          }))
        )
      )
      .catch((err) => console.log(err))
  }

  const onSearchCustomer = (inputValue, actionMeta) => {
    getClients(inputValue)
  }

  const onClientSelect = (newValue, actionMeta) => {
    setFieldValue("client", { ...newValue, action: actionMeta.action })
    if (actionMeta.action === "create-option") {
      setFieldValue("client_name", "")
    } else {
      setFieldValue("client_name", newValue?.elm?.name)
    }
  }

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

            <div className="w-full flex items-baseline">
              <div className="w-1/3 input-label">
                <span>{t("first.name")}</span>
              </div>
              <div className="w-2/3">
                <Form.Item formik={formik} name="client_name">
                  <Input
                    id="client_name"
                    placeholder={t("first.name") + "..."}
                    value={values.client_name}
                    onChange={handleChange}
                  />
                </Form.Item>
              </div>
            </div>

            {/* <div className="w-full flex items-baseline">
              <div className="w-1/3">
                <span>{t("can.the.courier.call")}</span>
              </div>
              <div className="w-2/3">
                <Form.Item formik={formik} name="is_courier_call">
                  <Switch
                    checked={values.is_courier_call}
                    onChange={(val) => setFieldValue("is_courier_call", val)}
                  />
                </Form.Item>
              </div>
            </div>

            <div className="w-full flex items-baseline">
              <div className="w-1/3">
                <span>{t("re-issued")}</span>
              </div>
              <div className="w-2/3">
                <Form.Item formik={formik} name="is_reissued">
                  <RadioGroup
                    className="flex gap-4"
                    onChange={(val) => setFieldValue("is_reissued", val)}
                  >
                    <Radio checked={values.is_reissued === true} value={true}>
                      {t("yes")}
                    </Radio>
                    <Radio checked={values.is_reissued === false} value={false}>
                      {t("no")}
                    </Radio>
                  </RadioGroup>
                </Form.Item>
              </div>
            </div> */}
          </Card>

          <Card title={t("comments")} className="mt-4">
            <div className="w-full flex items-baseline">
              <div className="w-1/3 input-label">
                <span>{t("description")}</span>
              </div>
              <div className="w-2/3">
                <Form.Item formik={formik} name="description">
                  <TextArea
                    size={5}
                    id="description"
                    value={values.description}
                    onChange={handleChange}
                    placeholder={t("description") + "..."}
                  />
                </Form.Item>
              </div>
            </div>
          </Card>
        </div>

        <Card title={t("type-delivery")} className="w-3/5">
          <div className="w-full grid grid-cols-2 gap-4">
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
                    disabled
                    id="co_delivery_price"
                    placeholder={t("fares") + "..."}
                    value={deliveryPrice}
                    onChange={handleChange}
                  />
                </Form.Item>
              </div>
            </div>
          </div>
          <div className="w-full grid grid-cols-2 gap-4">
            <div className="flex items-baseline">
              <div className="w-1/3 input-label">
                <span>{t("apartment")}</span>
              </div>
              <div className="w-2/3">
                <Form.Item formik={formik} name="building">
                  <Input
                    id="building"
                    value={values.building}
                    onChange={handleChange}
                    placeholder={t("apartment") + "..."}
                  />
                </Form.Item>
              </div>
            </div>

            <div className="flex items-baseline">
              <div className="w-1/3 input-label">
                <span>{t("entrance")}</span>
              </div>
              <div className="w-2/3">
                <Form.Item formik={formik} name="apartment">
                  <Input
                    id="apartment"
                    value={values.apartment}
                    onChange={handleChange}
                    placeholder={t("entrance") + "..."}
                  />
                </Form.Item>
              </div>
            </div>
          </div>
          <div className="w-full grid grid-cols-2 gap-4">
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
                    placeholder={t("floor") + "..."}
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
                  placeholder={t("address") + "..."}
                  value={values.to_address}
                  onChange={(e) => {
                    handleChange(e)
                    setSearchAddress(e.target.value)
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

          <MapContent branches={branches} formik={formik} {...props} />

          <div className="w-full mt-4 grid grid-cols-2 gap-2">
            <div className="flex items-baseline">
              <div className="w-1/3 input-label">
                <span>{t("company")}</span>
              </div>
              <div className="w-2/3">
                <Form.Item formik={formik} name="shipper">
                  <Select
                    id="shipper"
                    options={shippers}
                    value={values.shipper}
                    placeholder={t("company")}
                    onChange={(val) => {
                      setFieldValue("branch", null)
                      setFieldValue("shipper", val)
                    }}
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
                    value={values.branch} // { label. ....}
                    options={branches}
                    placeholder={t("branch")}
                    onChange={(val) => setFieldValue("branch", val)}
                  />
                </Form.Item>
              </div>
            </div>

            <div className="flex items-baseline">
              <div className="w-1/3 input-label">
                <span>{t("address")}</span>
              </div>
              {/* {JSON.stringify(values)} */}
              <div className="w-2/3">
                <Form.Item formik={formik} name="branch.elm.address">
                  <Input
                    disabled
                    value={values.branch?.elm?.address ?? ""}
                    addonBefore={
                      <LocationOn fontSize="small" className="text-primary" />
                    }
                    placeholder={t("address")}
                    id="branch-address"
                  />
                </Form.Item>
              </div>
            </div>

            <div className="flex">
              <div className="w-1/3 input-label">
                <span>{t("phone.number")}</span>
              </div>
              <div className="w-2/3">
                <Form.Item formik={formik} name="branch.elm.phone">
                  <Input
                    disabled
                    value={values.branch?.elm?.phone ?? ""}
                    addonBefore={
                      <Phone className="text-primary" fontSize="small" />
                    }
                    placeholder={t("phone.number")}
                    id="name"
                  />
                </Form.Item>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </>
  )
}
