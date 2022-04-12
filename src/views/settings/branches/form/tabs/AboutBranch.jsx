import { Input } from "alisa-ui";
import Button from "components/Button";
import Card from "components/Card";
import CheckBox from "components/Checkbox1/CheckBox";
import Form from "components/Form/Index";
import { Field, FieldArray, FormikProvider, useFormik } from "formik";
import { isNumber } from "helpers/inputHelpers";
import { useTranslation } from "react-i18next";
import * as yup from "yup";
import add_icon from "../../../../../assets/icons/add_icon.svg";
import { Map, Placemark, YMaps } from "react-yandex-maps";
import Select from "components/Select/index";
import Gallery from "components/Gallery";
import CustomInputMask from "components/CustomInputMask";
import { mapDefaults } from "constants/mapDefaults";
import PhoneInputField from "components/PhoneInputMask";
import { TextField } from "@material-ui/core";
import { getBranchById } from "services/branch";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { onClickMap } from "services/currentLocation";
// import Gallery from "components/Gallery/v2";
import UploadWithDrag from "components/Upload/UploadWithDrag";


export default function AboutBranch({
  formik,
  initialValues,
  setCoordinators,
  coordinators,
}) {
  // ======== const variables ====== //
  const { t } = useTranslation();
  const params = useParams();
  const [address, setAddress] = useState("");

  console.log('formik ', formik.values)

  const cities = [
    {
      value: 1,
      label: "Tashkent",
    },
    {
      value: 2,
      label: "Andijon",
    },
    {
      value: 3,
      label: "Fergana",
    },
    {
      value: 4,
      label: "Namangan",
    },
    {
      value: 5,
      label: "Sirdaryo",
    },
    {
      value: 6,
      label: "Jizzakh",
    },
    {
      value: 7,
      label: "Samarqand",
    },
    {
      value: 8,
      label: "Kharezm",
    },
  ];

  const catalogs = [
    {
      value: 1,
      label: "catalog 1",
    },
    {
      value: 2,
      label: "catalog 2",
    },
  ];

  const days = [
    {
      title: t("monday"),
    },
    {
      title: t("tuesday"),
    },
    {
      title: t("wednesday"),
    },
    {
      title: t("thursday"),
    },
    {
      title: t("friday"),
    },
    {
      title: t("saturday"),
    },
    {
      title: t("sunday"),
    },
  ];

  // ====== < formik section /> ===== //

  const getBranch = () => {
    if(params.id){
      getBranchById(params.id).then((res) => {
        formik.setFieldValue("name", res.data.name);
        formik.setFieldValue("company_id", res.data.company_id);
        formik.setFieldValue("id", res.data.id);
        formik.setFieldValue("address", res.data.address);
        formik.setFieldValue("city", res.data.city);
        formik.setFieldValue("latitude", res.data.ilatituded);
        formik.setFieldValue("longitude", res.data.longitude);
        formik.setFieldValue("inns", res.data.inns);
        formik.setFieldValue("logo", res.data.logo);
        formik.setFieldValue("phone_numbers", res.data.phone_numbers);
        formik.setFieldValue("service_ids", res.data.service_ids);
        formik.setFieldValue("working_days", res.data.working_days);
        
      });
    }
    
  };

  useEffect(() => {
    getBranch();
    onClickMap(
      setAddress,
      formik.values,
    );
  }, []);

  return (
    <div className="m-4">
      <div className="flex gap-5">
        <div className="w-3/5">
          <Card title={t("add.new.company")} style={{ height: "fit-content" }}>
            <div className="grid grid-cols-12 gap-8">
              <div className="col-span-3">
                <Form.Item formik={formik} name="logo">
                  <div className="w-full h-full flex mt-6 items-center flex-col">
                    <Gallery
                      width={120}
                      height={120}
                      gallery={formik.values.logo ? [formik.values.logo] : []}
                      setGallery={(elm) =>
                        formik.setFieldValue("logo", elm[0])
                      }
                      multiple={false}
                    />
                  </div>
                </Form.Item>
              </div>
              <div className="col-span-9">
                <div className="w-full items-baseline">
                  <div className="input-label">
                    <span>{t("company.name")}</span>
                  </div>
                  <div className="w-full">
                    <div>
                      <Form.Item formik={formik} name="name">
                        <Input
                          size="large"
                          id="name"
                          value={formik.values.name}
                          onChange={formik.handleChange}
                        />
                      </Form.Item>
                    </div>
                  </div>
                </div>

                <div className="w-full items-baseline">
                  <div className="input-label">
                    <span>{t("phone")}</span>
                  </div>
                  <div className="col-span-2 flex flex-wrap">
                    {/* <Form.Item formik={formik} name="phone_numbers">
                        <CustomInputMask
                          mask={`+\\9\\9\\8 99 999 99 99`}
                          maskChar={null}
                          id="phone_numbers"
                          // {...formik.getFieldProps("phone_number")}
                          autoComplete="none"
                          onChange={formik.handleChange}
                          value={formik.values.phone}
                          placeholder="Введите рабочий телефон"
                          style={{ flex: "1 1 80%" }}
                        />
                      </Form.Item> */}

                    <FormikProvider value={formik}>
                      <FieldArray
                        name="phone_numbers"
                        render={(phone_helper) => (
                          <>
                            {formik.values.phone_numbers.map((inn, index) => (
                              <>
                                <Field
                                  style={{ flex: "1 1 80%" }}
                                  size="large"
                                  className="
                                  order-1
                                  Input
                                  border 
                                  bg-white
                                  flex
                                  space-x-2
                                  items-center
                                  rounded-lg
                                  text-body
                                  relative
                                  p-1
                                  px-2
                                  w-full
                                  font-smaller
                                  focus-within:ring
                                  focus-within:outline-none
                                  transition
                                  focus-within:border-blue-300
                                  "
                                  name={`phone_numbers.${index}`}
                                />
                              </>
                            ))}
                            <Button
                              className="order-2 "
                              style={{
                                flex: "1 1 20%",
                                marginLeft: "10px",
                                background: "#4094F71A",
                                border: "none",
                                height: "39px",
                              }}
                              type="button"
                              onClick={() => phone_helper.push("")}
                            >
                              <img src={add_icon} alt="add_icon" />
                            </Button>
                          </>
                        )}
                      />
                    </FormikProvider>
                  </div>
                </div>

                <div className="w-full items-baseline">
                  <div className="input-label">
                    <span>{t("inn")}</span>
                  </div>
                  <div className="col-span-2 flex flex-wrap">
                    <FormikProvider value={formik}>
                      <FieldArray
                        name="inns"
                        render={(arrayHelperes) => (
                          <>
                            {formik.values.inns.map((inn, index) => (
                              <>
                                <Field
                                  style={{ flex: "1 1 80%" }}
                                  size="large"
                                  className="
                                  order-1
                                  Input
                                  border 
                                  bg-white
                                  flex
                                  space-x-2
                                  items-center
                                  rounded-lg
                                  text-body
                                  relative
                                  p-1
                                  px-2
                                  w-full
                                  font-smaller
                                  focus-within:ring
                                  focus-within:outline-none
                                  transition
                                  focus-within:border-blue-300
                                  "
                                  name={`inns.${index}`}
                                />
                              </>
                            ))}
                            <Button
                              className="order-2 "
                              style={{
                                flex: "1 1 20%",
                                marginLeft: "10px",
                                background: "#4094F71A",
                                border: "none",
                                height: "39px",
                              }}
                              type="button"
                              onClick={() => arrayHelperes.push("")}
                            >
                              <img src={add_icon} alt="add_icon" />
                            </Button>
                          </>
                        )}
                      />
                    </FormikProvider>
                  </div>
                </div>

                <div className="w-full items-baseline">
                  <div className="input-label">
                    <span>{t("address")}</span>
                  </div>
                  <div className="w-full">
                    <div>
                      <Form.Item formik={formik} name="address">
                        <Input
                          size="large"
                          id="address"
                          value={address}
                          onChange={formik.handleChange}
                          disabled
                        />
                      </Form.Item>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card title={t("geofence")} className="mt-4">
            <div className="col-span-1">
              <YMaps
                query={{
                  apikey: "3c8cad2d-8795-4a48-8f42-a279792c0e0e",
                }}
              >
                <Map
                  className="w-full"
                  style={{ height: "451px" }}
                  defaultState={mapDefaults}
                  onClick={(e) => {
                    setCoordinators({
                      ...coordinators,
                      lat: e.get("coords")[0],
                      long: e.get("coords")[1],
                    });
                    formik.setFieldValue(
                      "latitude",
                      String(e.get("coords")[0]),
                    );
                    formik.setFieldValue(
                      "longitude",
                      String(e.get("coords")[1]),
                    );
                    onClickMap(setAddress, {
                      longitude: e.get("coords")[1],
                      latitude: e.get("coords")[0],
                    });
                  }}
                  onChange={(e) => {
                    console.log("onChange ee ", e);
                    setCoordinators({
                      ...coordinators,
                      lat: e.get("coords")[0],
                      long: e.get("coords")[1],
                    });
                    formik.setFieldValue("latitude", e.get("coords")[0]);
                    formik.setFieldValue("longitude", e.get("coords")[1]);
                  }}
                  state={{
                    center: [coordinators.lat, coordinators.long],
                    zoom: 16,
                    controls: ["zoomControl", "fullscreenControl"],
                  }}
                  modules={["control.ZoomControl", "control.FullscreenControl"]}
                >
                  <Placemark
                    options={{
                      preset: "islands#redStretchyIcon",
                    }}
                    geometry={[coordinators.lat, coordinators.long]}
                  />
                </Map>
              </YMaps>
            </div>
          </Card>
        </div>

        <div className="w-2/5">
          <Card title={t("work.time")}>
            <div>
              {formik.values.working_days.map((e, index) => (
                <div
                  key={index}
                  className="flex w-full justify-between items-center"
                >
                  <div style={{ flex: "1 1 50%" }}>
                    {e.day}
                    <Form.Item
                      formik={formik}
                      name={`working_days[${index}].day`}
                    >
                      <Input
                        type="time"
                        name={`working_days[${index}].start_time`}
                        onKeyPress={isNumber}
                        size="large"
                        value={e.start_time}
                        onChange={formik.handleChange}
                      />
                      <Input
                        type="time"
                        name={`working_days[${index}].end_time`}
                        onKeyPress={isNumber}
                        size="large"
                        value={e.end_time}
                        onChange={formik.handleChange}
                      />
                    </Form.Item>
                  </div>
                  <div style={{ width: "4%", marginLeft: "15px" }}>
                    <CheckBox
                      onChange={(e) =>
                        formik.setFieldValue(
                          "working_days[1].is_open",
                          e.target.checked,
                        )
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card title={t("settings.branch")} className="mt-4">
            <div className="w-full items-baseline">
              <div className="input-label">
                <span>{t("catalog.servive")}</span>
              </div>
              <div className="w-full">
                <div>
                  <Form.Item formik={formik} name="service_ids">
                    <Select
                      id="service_ids"
                      isMulti
                      height={40}
                      value={formik.values.service_ids}
                      onChange={(value) =>
                        formik.setFieldValue("service_ids", value)
                      }
                      options={catalogs}
                    />
                  </Form.Item>
                </div>
              </div>
            </div>

            <div className="w-full items-baseline">
              <div className="input-label">
                <span>{t("city")}</span>
              </div>
              <div className="w-full">
                <div>
                  <Form.Item formik={formik} name="city">
                    <Select
                      id="city"
                      isMulti
                      height={40}
                      value={formik.values.city}
                      onChange={(value) => formik.setFieldValue("city", value)}
                      options={cities}
                    />
                  </Form.Item>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
