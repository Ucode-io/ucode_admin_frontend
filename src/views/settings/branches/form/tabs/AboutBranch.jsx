import { makeStyles } from '@material-ui/core/styles'
import { Input } from 'alisa-ui'
import Button from 'components/Button'
import Card from 'components/Card'
import CheckBox from 'components/Checkbox1/CheckBox'
import Form from 'components/Form/Index'
import { useFormik } from 'formik'
import { isNumber } from 'helpers/inputHelpers'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import * as yup from "yup";
import add_icon from '../../../../../assets/icons/add_icon.svg'
import MuiButton from "@material-ui/core/Button";
import { Map, Placemark, YMaps } from "react-yandex-maps";
import Select from 'components/Select'
import Gallery from 'components/Gallery'

const useStyles = makeStyles((theme) => ({
    root: {
      "& > *": {
        width: "100%",
        fontSize: "1.5rem",
        padding: "0",
        borderColor: "#ecf4fe",
        backgroundColor: "#ecf4fe",
        color: "#4094f7",
      },
      "& > *:hover": {
        borderColor: "#ecf4fe",
        backgroundColor: "#ecf4fe",
      },
    },
  }));

export default function AboutBranch() {


    // ======== const variables ====== //
    const { t } = useTranslation()
    const classes = useStyles()


    const columns = [
        // {
        //   title: t("time"),
        // },
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


    // ====== < formik section > ===== //
    const initialValues = useMemo(
      () => ({
        name: null,
        base_price: null,
        type: null,
        base_distance: null,
        price_per_km: null,
      }),
      [],
    );

    const onSubmit = (values) => {
      console.log("submit submit");
    };

    const validationSchema = useMemo(() => {
      const defaultSchema = yup.mixed().required(t("required.field.error"));
      return yup.object().shape({
        base_price: defaultSchema,
        type: defaultSchema,
      });
    }, []);

    const formik = useFormik({
      initialValues,
      onSubmit,
      validationSchema,
    });

      const { values, handleChange, setFieldValue, setValues, handleSubmit } =
    formik;

   // ====== < formik section /> ===== //


    return (
      <div className="m-4">
        <div className="flex gap-5">
          <div className="w-3/5">
            <Card
              title={t("add.new.company")}
              style={{ height: "fit-content" }}
            >
              <div className="grid grid-cols-12 gap-8">
                <div className="col-span-3">
                  <Form.Item formik={formik} name="image">
                    <div className="w-full h-full flex mt-6 items-center flex-col">
                      <Gallery
                        width={120}
                        height={120}
                        gallery={values.image ? [values.image] : []}
                        setGallery={(elm) => setFieldValue("image", elm[0])}
                        multiple={false}
                      />
                    </div>
                  </Form.Item>
                </div>
                <div className="col-span-9">
                  <div className="w-full items-baseline">
                    <div className="input-label">
                      {/* <span style={{ color: "red" }}>*</span>{" "} */}
                      <span>{t("company.name")}</span>
                    </div>
                    <div className="w-full">
                      <div>
                        <Form.Item formik={formik} name="name">
                          <Input
                            size="large"
                            id="name"
                            value={values.first_name}
                            onChange={handleChange}
                          />
                        </Form.Item>
                      </div>
                    </div>
                  </div>

                  <div className="w-full items-baseline">
                    <div className="input-label">
                      {/* <span style={{ color: "red" }}>*</span>{" "} */}
                      <span>{t("phone")}</span>
                    </div>
                    <div className="col-span-2 flex flex-wrap">
                      <Form.Item formik={formik} name="name">
                        <Input
                          className="order-1"
                          size="large"
                          style={{ flex: "1 1 80%" }}
                        />
                      </Form.Item>
                      <Button
                        className="order-2 "
                        style={{
                          flex: "1 1 20%",
                          marginLeft: "10px",
                          background: "#4094F71A",
                          border: "none",
                          height: "39px",
                        }}
                      >
                        <img src={add_icon} alt="add_icon" />
                      </Button>
                    </div>
                  </div>

                  <div className="w-full items-baseline">
                    <div className="input-label">
                      {/* <span style={{ color: "red" }}>*</span>{" "} */}
                      <span>{t("inn")}</span>
                    </div>
                    <div className="col-span-2 flex flex-wrap">
                      <Form.Item formik={formik} name="name">
                        <Input
                          className="order-1"
                          size="large"
                          style={{ flex: "1 1 80%" }}
                        />
                      </Form.Item>
                      <Button
                        className="order-2 "
                        style={{
                          flex: "1 1 20%",
                          marginLeft: "10px",
                          background: "#4094F71A",
                          border: "none",
                          height: "39px",
                        }}
                      >
                        <img src={add_icon} alt="add_icon" />
                      </Button>
                    </div>
                  </div>

                  <div className="w-full items-baseline">
                    <div className="input-label">
                      {/* <span style={{ color: "red" }}>*</span>{" "} */}
                      <span>{t("address")}</span>
                    </div>
                    <div className="w-full">
                      <div>
                        <Form.Item formik={formik} name="name">
                          <Input
                            size="large"
                            id="name"
                            value={values.first_name}
                            onChange={handleChange}
                          />
                        </Form.Item>
                      </div>
                    </div>
                  </div>

                  <div className="w-full items-baseline">
                    <div className="input-label">
                      {/* <span style={{ color: "red" }}>*</span>{" "} */}
                      <span>{t("staffs.number")}</span>
                    </div>
                    <div className="w-full">
                      <div>
                        <Form.Item formik={formik} name="name">
                          <Input
                            size="large"
                            id="name"
                            value={values.first_name}
                            onChange={handleChange}
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
                  <YMaps>
                    <Map
                    className='w-full'
                      style={{ height: "451px" }}
                      defaultState={{ center: [41.34557, 69.284599], zoom: 16 }}
                    ></Map>
                  </YMaps>
                </div>
            </Card>
          </div>
          <div className="w-2/5">
            <Card title={t("work.time")}>
              <div className="">
                {columns.map((e) => (
                  <div className="flex w-full justify-between items-center">
                    <div style={{ flex: "1 1 50%" }}>
                      {e.title}
                      <Form.Item formik={formik} name="work_time">
                        <Input
                          type="time"
                          id="work_time"
                          onKeyPress={isNumber}
                          size="large"
                          value={values.base_price}
                          onChange={handleChange}
                        />
                      </Form.Item>
                    </div>
                    <div style={{ width: "4%", marginLeft: "15px" }}>
                      <CheckBox />{" "}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card title={t("settings.branch")} className="mt-4">
      

              <div className="w-full items-baseline">
                <div className="input-label">
                  {/* <span style={{ color: "red" }}>*</span>{" "} */}
                  <span>{t("catalog.servive")}</span>
                </div>
                <div className="w-full">
                  <div>
                    <Form.Item formik={formik} name="name">
                      <Select
                        id="region_ids"
                        isMulti
                        height={40}
                        name="region_ids"
                        value={values.region_ids}
                        onChange={(value) => setFieldValue("region_ids", value)}
                        //   options={regions}
                      />
                    </Form.Item>
                  </div>
                </div>
              </div>

            

              <div className="w-full items-baseline">
                <div className="input-label">
                  {/* <span style={{ color: "red" }}>*</span>{" "} */}
                  <span>{t("city")}</span>
                </div>
                <div className="w-full">
                  <div>
                    <Form.Item formik={formik} name="name">
                      <Select
                        id="region_ids"
                        isMulti
                        height={40}
                        name="region_ids"
                        value={values.region_ids}
                        onChange={(value) => setFieldValue("region_ids", value)}
                        //   options={regions}
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