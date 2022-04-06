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


    return(
        <div className="m-4">
        <div className="grid grid-cols-2 gap-5">
          <div>

          <Card
            title={t("general.information")}
            style={{ height: "fit-content" }}
          >
            <div className="grid grid-cols-3 items-baseline">
              <div className="input-label">{t("name")}</div>
              <div className="col-span-2 grid-rows-2">
                <Form.Item formik={formik} name="name">
                  <Input
                    size="large"
                    value={values.name}
                    onChange={handleChange}
                    name="name"
                  />
                </Form.Item>
              </div>

              <div className="input-label">{t("phone")}</div>
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
          </Card>



          <Card title={t("geofence")} className="mt-4">
            <div className="grid grid-cols-3 items-baseline">
              <div className="input-label">{t("address")}</div>
              <div className="col-span-2">
                <Form.Item formik={formik} name="name">
                  <Input
                    size="large"
                    value={values.name}
                    onChange={handleChange}
                    name="name"
                  />
                </Form.Item>
              </div>

              <div className="col-span-2">
                <YMaps>
                  <Map
                    style={{ width: "500px", height: "451px" }}
                    defaultState={{ center: [41.34557, 69.284599], zoom: 16 }}
                  ></Map>
                </YMaps>
              </div>
            </div>
          </Card>

          </div>
         

         <div>
         <Card title={t("work.time")}>
            <div className="">
              {columns.map((e) => (
                <div className="flex w-full justify-between">
                  <div className="input-label" style={{ flex: "1 1 20%" }}>
                    {" "}
                    {e.title}{" "}
                  </div>
                  <div style={{ flex: "1 1 50%" }}>
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
                    {" "}
                    <CheckBox />{" "}
                  </div>
                </div>
              ))}  
            </div>
          </Card>

          <Card title={t("settings.branch")} className="mt-4">
            <div className="grid grid-cols-3 items-baseline">
              <div className="input-label">{t("catalog")}</div>
              <div className="col-span-2">
                <Form.Item formik={formik} name="name">
                  <Form.Item formik={formik} name="region_ids">
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
                </Form.Item>
              </div>

              <div className="input-label">{t("city")}</div>
              <div className="col-span-2">
                <Form.Item formik={formik} name="name">
                  <Form.Item formik={formik} name="region_ids">
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
                </Form.Item>
              </div>
            </div>
          </Card>
         </div>          
        </div>
      </div> 
    )
}