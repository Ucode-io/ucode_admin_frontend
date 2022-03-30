import { useState, useMemo, useEffect } from "react";
import Card from "components/Card";
import Form from "components/Form/Index";
import { Input } from "alisa-ui";
import { useTranslation } from "react-i18next";
import Gallery from "components/Gallery";
import Select from "components/Select";
import { useFormik } from "formik";
import { getOneShipper } from "services";
import { useSelector } from "react-redux";
import { RadioGroup, Radio } from "components/Radio";
import FullScreenLoader from "components/FullScreenLoader";

export default function AboutCompany() {
  const { t } = useTranslation();
  const shipper_id = useSelector((state) => state.auth.shipper_id);

  const [loader, setLoader] = useState(true);

  const fetchData = () => {
    setLoader(true);
    if (!shipper_id) return setLoader(false);
    getOneShipper(shipper_id)
      .then((res) => {
        formik.setValues({
          name: res.name,
          phone: res.phone[0].slice(4),
          call_center_tg: res.call_center_tg,
          address: res.address,
          crm: res.crm,
          logo: res.logo,
          average_delivery_time: res.average_delivery_time,
          minimal_order_price: res.minimal_order_price,
          max_delivery_time: res.max_delivery_time,
          order_late_colour: res.order_late_colour,
          order_road: res.order_road,
          courier_period: res.courier_period,
          courier_accept_radius: res.courier_accept_radius,
          courier_action_radius: res.courier_action_radius,
          work_hour_start: res.work_hour_start,
        });
      })
      .finally(() => setLoader(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const initialValues = useMemo(
    () => ({
      name: null,
      phone: null,
      call_center_tg: null,
      address: null, //not
      crm: null,
      logo: "",
      average_delivery_time: null, //not
      minimal_order_price: null,
      max_delivery_time: null,
      order_late_colour: null,
      order_road: null,
      courier_period: null,
      courier_accept_radius: null,
      courier_action_radius: null,
      work_hour_start: null, //not
    }),
    [],
  );

  const formik = useFormik({
    initialValues,
  });

  const { values, handleChange, setFieldValue } = formik;

  return (
    <>
      {loader ? (
        <FullScreenLoader />
      ) : (
        <>
          <div className="grid grid-cols-2">
            <Card className="m-4 mr-2" title={t("client")}>
              <div className="grid grid-cols-12 gap-8">
                <div className="col-span-3">
                  <Form.Item formik={formik} name="logo">
                    <div className="w-full h-full flex mt-6 items-center flex-col">
                      <Gallery
                        rounded
                        width={120}
                        height={120}
                        gallery={values.logo ? [values.logo] : []}
                        setGallery={(elm) => setFieldValue("logo", elm[0])}
                        multiple={false}
                      />
                      {
                        <span className="mt-2 text-primary text-base">
                          {values.logo ? t("change.photo") : t("add.photo")}
                        </span>
                      }
                    </div>
                  </Form.Item>
                </div>

                <div className="col-span-9">
                  <div className="w-full flex items-baseline">
                    <div className="w-1/4 input-label">
                      <span>{t("name")}</span>
                    </div>
                    <div className="w-3/4">
                      <div>
                        <Form.Item formik={formik} name="name">
                          <Input
                            size="large"
                            id="name"
                            value={values.name}
                            onChange={handleChange}
                          />
                        </Form.Item>
                      </div>
                    </div>
                  </div>

                  <div className="w-full flex items-baseline">
                    <div className="w-1/4 input-label">
                      <span>{t("phone")}</span>
                    </div>
                    <div className="w-3/4">
                      <div>
                        <Form.Item formik={formik} name="phone">
                          <Input
                            size="large"
                            id="phone"
                            value={values.phone}
                            onChange={handleChange}
                            type="number"
                            min="1"
                          />
                        </Form.Item>
                      </div>
                    </div>
                  </div>

                  <div className="w-full flex items-baseline">
                    <div className="w-1/4 input-label">
                      <span>{t("address.telegram")}</span>
                    </div>
                    <div className="w-3/4 flex">
                      <div className="w-full">
                        <Form.Item formik={formik} name="call_center_tg">
                          <Input
                            size="large"
                            id="call_center_tg"
                            value={values.call_center_tg}
                            onChange={handleChange}
                          />
                        </Form.Item>
                      </div>
                      {/* <IconButton icon={<AddIcon />} /> */}
                    </div>
                  </div>

                  <div className="flex w-full items-baseline">
                    <div className="w-1/4 input-label">
                      <label>{t("address")}</label>
                    </div>
                    <div className="w-3/4">
                      <Form.Item formik={formik} name="address">
                        <Input
                          size="large"
                          id="address"
                          value={values.address}
                          onChange={handleChange}
                        />
                      </Form.Item>
                    </div>
                  </div>

                  <div className="flex w-full items-baseline">
                    <div className="w-1/4 input-label">
                      <label>{t("integration")}</label>
                    </div>
                    <div className="w-3/4">
                      <Form.Item formik={formik} name="crm">
                        <Select
                          height={40}
                          options={[
                            { label: "IIKO", value: "iiko" },
                            { label: "JOWI", value: "jowi" },
                            { label: t("nobody"), value: "" },
                          ]}
                          onChange={(val) => {
                            setFieldValue("crm", val);
                          }}
                        />
                      </Form.Item>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
            <Card className="m-4" title={t("orders")}>
              <div className="grid grid-cols-4">
                <div className="col-span-4 w-full flex items-baseline">
                  <div className="w-1/4 input-label">
                    <span>{t("average_delivery_time")}</span>
                  </div>
                  <div className="w-3/4">
                    <div>
                      <Form.Item formik={formik} name="average_delivery_time">
                        <Input
                          size="large"
                          id="average_delivery_time"
                          value={values.average_delivery_time}
                          onChange={handleChange}
                          suffix={t("min")}
                          type="number"
                          min="1"
                        />
                      </Form.Item>
                    </div>
                  </div>
                </div>

                <div className="col-span-4 w-full flex items-baseline">
                  <div className="w-1/4 input-label">
                    <span>{t("minimal_order_price")}</span>
                  </div>
                  <div className="w-3/4">
                    <div>
                      <Form.Item formik={formik} name="minimal_order_price">
                        <Input
                          size="large"
                          id="minimal_order_price"
                          value={values.minimal_order_price}
                          onChange={handleChange}
                        />
                      </Form.Item>
                    </div>
                  </div>
                </div>

                <div className="col-span-4 w-full flex items-baseline">
                  <div className="w-1/4 input-label">
                    <span>{t("max_delivery_time")}</span>
                  </div>
                  <div className="w-3/4 flex">
                    <div className="w-full">
                      <Form.Item formik={formik} name="max_delivery_time">
                        <Input
                          size="large"
                          suffix={t("min")}
                          id="max_delivery_time"
                          value={values.max_delivery_time}
                          onChange={handleChange}
                          type="number"
                          min="1"
                        />
                      </Form.Item>
                    </div>
                    {/* <IconButton icon={<AddIcon />} /> */}
                  </div>
                </div>

                <div className="col-span-4 w-full flex items-baseline">
                  <div className="w-1/4 input-label">
                    <span>{t("order_late_colour")}</span>
                  </div>
                  <div className="w-3/4 flex">
                    <div className="w-full">
                      <Form.Item formik={formik} name="order_late_colour">
                        <Select
                          height={40}
                          options={[
                            { label: t("yellow"), value: "yellow" },
                            { label: t("red"), value: "red" },
                            { label: t("green"), value: "green" },
                          ]}
                          onChange={(val) => {
                            setFieldValue("order_late_colour", val);
                          }}
                        />
                      </Form.Item>
                    </div>
                    {/* <IconButton icon={<AddIcon />} /> */}
                  </div>
                </div>

                <div className="col-span-4 flex w-full items-baseline">
                  <div className="w-1/4 input-label">
                    <label>{t("order_road")}</label>
                  </div>
                  <div className="w-3/4">
                    <Form.Item formik={formik} name="order_road">
                      <RadioGroup
                        name="order_road"
                        selectedValue={"way"}
                        onChange={handleChange}
                        className="flex items-center"
                      >
                        <Radio value="way" className="mr-4" />
                        <span className="mr-4">{t("road")}</span>
                        <Radio value="radius" className="mr-4" />
                        <span className="mr-4">{t("radius")}</span>
                      </RadioGroup>
                    </Form.Item>
                  </div>
                </div>
              </div>
            </Card>
          </div>
          <Card className="m-4" title={t("couriers")}>
            <div className="grid grid-cols-4">
              <div className="col-span-4 w-full flex items-baseline">
                <div className="w-1/4 input-label">
                  <span>{t("courier_period")}</span>
                </div>
                <div className="w-3/4">
                  <div>
                    <Form.Item formik={formik} name="courier_period">
                      <Input
                        size="large"
                        id="courier_period"
                        value={values.courier_period}
                        onChange={handleChange}
                        suffix={t("min")}
                        type="number"
                        min="1"
                      />
                    </Form.Item>
                  </div>
                </div>
              </div>

              <div className="col-span-4 w-full flex items-baseline">
                <div className="w-1/4 input-label">
                  <span>{t("courier_accept_radius")}</span>
                </div>
                <div className="w-3/4">
                  <div>
                    <Form.Item formik={formik} name="courier_accept_radius">
                      <Input
                        size="large"
                        id="courier_accept_radius"
                        value={values.courier_accept_radius}
                        onChange={handleChange}
                        suffix={t("km")}
                        type="number"
                        min="1"
                      />
                    </Form.Item>
                  </div>
                </div>
              </div>

              <div className="col-span-4 w-full flex items-baseline">
                <div className="w-1/4 input-label">
                  <span>{t("courier_action_radius")}</span>
                </div>
                <div className="w-3/4 flex">
                  <div className="w-full">
                    <Form.Item formik={formik} name="courier_action_radius">
                      <Input
                        size="large"
                        id="courier_action_radius"
                        value={values.courier_action_radius}
                        onChange={handleChange}
                        type="number"
                        min="1"
                        suffix={t("km")}
                      />
                    </Form.Item>
                  </div>
                  {/* <IconButton icon={<AddIcon />} /> */}
                </div>
              </div>

              <div className="col-span-4 flex w-full items-baseline">
                <div className="w-1/4 input-label">
                  <label>{t("courier_work_hours")}</label>
                </div>
                <div className="w-3/4">
                  <Form.Item formik={formik} name="work_hour_start">
                    <Input
                      size="large"
                      id="work_hour_start"
                      value={values.work_hour_start}
                      onChange={handleChange}
                    />
                  </Form.Item>
                </div>
              </div>
            </div>
          </Card>
        </>
      )}
    </>
  );
}
