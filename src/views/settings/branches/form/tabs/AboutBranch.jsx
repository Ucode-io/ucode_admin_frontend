import { Input } from "alisa-ui";
import Button from "components/Button";
import Card from "components/Card";
import CheckBox from "components/Checkbox1/CheckBox";
import Form from "components/Form/Index";
import {
  ErrorMessage,
  FieldArray,
  FormikProvider,
} from "formik";
import { isNumber } from "helpers/inputHelpers";
import { useTranslation } from "react-i18next";
import add_icon from "../../../../../assets/icons/add_icon.svg";
import { Map, Placemark, YMaps } from "react-yandex-maps";
import Select from "components/Select/index";
import Gallery from "components/Gallery";
import CustomInputMask from "components/CustomInputMask";
import { getBranchById } from "services/branch";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { onClickMap } from "services/currentLocation";

export default function AboutBranch({
  formik,
  initialValues,
  setCoordinators,
  coordinators,
}) {
  // ======== const variables ====== //
  const { t } = useTranslation();
  const params = useParams();

  const cities = [
    {
      value: "tashkent",
      label: "Ташкент ",
    },
    {
      value: "andijan",
      label: "Андижан ",
    },
    {
      value: "fergana",
      label: "Фергана",
    },
    {
      value: "namangan",
      label: "Наманган",
    },
    {
      value: "sirdarya",
      label: "Cирдарё ",
    },
    {
      value: "djizzakh",
      label: "Жиззах ",
    },
    {
      value: "samarkand",
      label: "Самарканд",
    },
    {
      value: "xarezm",
      label: "Харезм",
    },
    {
      value: "bukhara",
      label: "Бухара ",
    },
    {
      value: "kashkadarya",
      label: "Кашкадарья",
    },
    {
      value: "nukus",
      label: "Нукус",
    },
    {
      value: "surkhandarya",
      label: "Сурхандарья",
    },
    {
      value: "navoi",
      label: "Навои",
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

  // ====== < GET BY ID /> ===== //

  const getBranch = () => {
    if (params.id) {
      getBranchById(params.id).then((res) => {
        formik.setValues(res.data);
        console.log('GET Branch ', res.data)
      });
    }
  };

  useEffect(() => {
    getBranch();
  }, []);


  return (
    <div className="m-4">
      <div className="flex gap-5">
        <div className="w-3/5">

          <Card title={t("add.new.company")} style={{ height: "fit-content" }}>
            <div className="grid grid-cols-12 gap-8">
              <div className="col-span-3">
                <Form.Item formik={formik} name="logo">
                  <div className="w-full h-full flex mt-6 items-center flex-col text-center">
                    <Gallery
                      width={120}
                      height={120}
                      gallery={formik.values.logo ? [formik.values.logo] : []}
                      setGallery={(elm) => formik.setFieldValue("logo", elm[0])}
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
                    <FormikProvider value={formik}>
                      <FieldArray
                        name="phone_numbers"
                        render={(phone_helper) => (
                          <>
                            {formik.values.phone_numbers.map((phone, index) => (
                              <div
                                style={{
                                  flex: "1 1 80%",
                                  marginBottom: "10px",
                                }}
                                key={index}
                              >
                                <CustomInputMask
                                  mask={`+\\9\\9\\8 99 999 99 99`}
                                  maskChar={null}
                                  autoComplete="none"
                                  onChange={formik.handleChange}
                                  value={formik.values.phone_numbers[index]}
                                  placeholder="Введите рабочий телефон"
                                  name={`phone_numbers.${index}`}
                                  onBlur={formik.handleBlur}
                                />
                                <ErrorMessage
                                  component="div"
                                  style={{
                                    color: "rgb(255, 77, 79)",
                                    fontSize: "12px",
                                  }}
                                  name={`phone_numbers.${index}`}
                                />
                              </div>
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
                              <div
                                style={{
                                  flex: "1 1 80%",
                                  marginBottom: "10px",
                                }}
                                key={index}
                              >
                                <Input
                                  type="number"
                                  size="large"
                                  name={`inns.${index}`}
                                  pattern="[0-9]"
                                  value={formik?.values?.inns[index]}
                                  onChange={(e) =>
                                    e.target.value.length < 11
                                      ? formik.handleChange(e)
                                      : () => {}
                                  }
                                />
                                <ErrorMessage
                                  component="div"
                                  style={{
                                    color: "rgb(255, 77, 79)",
                                    fontSize: "12px",
                                  }}
                                  name={`inns.${index}`}
                                />
                              </div>
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
                          value={formik.values.address}
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
                  // defaultState={mapDefaults}
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
                    onClickMap((val) => formik.setFieldValue("address", val), {
                      longitude: e.get("coords")[1],
                      latitude: e.get("coords")[0],
                    });
                  }}
                  state={{
                    center: [
                      formik.values.latitude
                        ? formik.values.latitude
                        : coordinators.lat,
                      formik.values.longitude
                        ? formik.values.longitude
                        : coordinators.long,
                    ],
                    zoom: 16,
                    controls: ["zoomControl", "fullscreenControl"],
                  }}
                  modules={["control.ZoomControl", "control.FullscreenControl"]}
                >
                  <Placemark
                    options={{
                      preset: "islands#redStretchyIcon",
                    }}
                    geometry={[
                      formik.values.latitude
                        ? formik.values.latitude
                        : coordinators.lat,
                      formik.values.longitude
                        ? formik.values.longitude
                        : coordinators.long,
                    ]}
                  />
                </Map>
              </YMaps>
            </div>
          </Card>

        </div>


        <div className="w-2/5">

          <Card title={t("work.time")}>
            <div>
              {formik.values.working_days.map((elm, index) => (
                <div
                  key={index}
                  className="flex w-full justify-between items-center"
                >
                  <div style={{ flex: "1 1 50%" }}>
                    {t(`${elm.day}`)}
                    <div className="grid grid-cols-2 gap-x-5">
                      <Form.Item
                        formik={formik}
                        name={`working_days[${index}].start_time`}
                      >
                        <Input
                          type="time"
                          name={`working_days[${index}].start_time`}
                          size="large"
                          value={elm.start_time}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                      </Form.Item>

                      <Form.Item
                        formik={formik}
                        name={`working_days[${index}].end_time`}
                      >
                        <Input
                          type="time"
                          name={`working_days[${index}].end_time`}
                          onKeyPress={isNumber}
                          size="large"
                          value={elm.end_time}
                          onChange={formik.handleChange}
                        />
                      </Form.Item>
                    </div>
                  </div>
                  <div style={{ width: "4%", marginLeft: "15px" }}>
                    <CheckBox
                      onChange={(e) =>
                        formik.setFieldValue(
                          `working_days[${index}].is_open`,
                          e.target.checked,
                        )
                      }
                      className="mt-1.5"
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
                  <Form.Item formik={formik} name="catalogue_id">
                    <Select
                      name="catalogue_id"
                      height={40}
                      value={catalogs.find(
                        (item) => item.label === formik.values.catalogue_id,
                      )}
                      onChange={(value) =>
                        formik.setFieldValue("catalogue_id", value.label)
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
                      name="city"
                      height={40}
                      value={cities.find(
                        (item) => item.label === formik.values.city,
                      )}
                      onChange={(value) => {
                        formik.setFieldValue("city", value.label);
                      }}
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
