import React, { useEffect, useMemo, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router-dom";
import { Input } from "alisa-ui";
import Form from "components/Form/Index";
import Breadcrumb from "components/Breadcrumb";
import Header from "components/Header";
import Card from "components/Card";
import Button from "components/Button";
import Select from "components/Select";
import { getUserRoles } from "services/userRoles";
import { getOperator, postOperator, updateOperator } from "services/operator";
import { getRegions } from "services/region";
import CancelIcon from "@material-ui/icons/Cancel";
import SaveIcon from "@material-ui/icons/Save";
import CustomSkeleton from "components/Skeleton";
import VisibilityIcon from "@material-ui/icons/Visibility";
import DatePicker from "components/DatePicker";
import Gallery from "components/Gallery/v2";
import CustomInputMask from "components/CustomInputMask";

export default function CreateOperator() {
  const history = useHistory();
  const { id } = useParams();
  const { t } = useTranslation();
  const [saveLoading, setSaveLoading] = useState(false);
  const [loader, setLoader] = useState(true);
  const [userRoles, setUserRoles] = useState([]);
  const [regions, setRegions] = useState([]);
//   const [visible, setVisible] = useState(false);



//   const getItem = () => {
//     if (!id) return setLoader(false);
//     setLoader(true);
//     getOperator(id)
//       .then((res) => {
//         formik.setValues({
//           name: res.name,
//           phone: res.phone?.substring(4),
//           username: res.username,
//           region_ids: res.region_ids.map((id, _) => id),
//           user_roles: {
//             label: res.name,
//             value: res.user_role_id,
//           },
//           password: "no_password",
//         });
//       })
//       .finally(() => setLoader(false));
//   };

  const fetchData = async () => {
    setLoader(true);
    try {
      const { user_roles } = await getUserRoles({ limit: 1000 });
      setUserRoles(
        user_roles
          ? user_roles.map((elm) => ({ label: elm.name, value: elm.id }))
          : [],
      );

      const { regions } = await getRegions({ limit: 1000 });
      setRegions(
        regions
          ? regions.map((elm) => ({ label: elm.name, value: elm.id }))
          : [],
      );
    } catch (e) {
      console.log(e);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    fetchData();
    // getItem();
  }, []);

//   const initialValues = useMemo(
//     () => ({
//       name: "",
//       user_roles: null,
//       username: "",
//       phone: "",
//       password: "",
//       region_ids: [],
//       lastname: "",
//     }),
//     [],
//   );




  const validationSchema = useMemo(() => {
    const defaultSchema = yup.mixed().required(t("required.field.error"));
    return yup.object().shape({
      name: defaultSchema,
      user_roles: defaultSchema,
      username: yup
        .string()
        .required(t("required.field.error"))
        .min(6, "Логин слишком короткий — минимум 6 символов"),
      region_ids: yup.array().min(1, t("required.field.error")),
      phone: yup
        .number()
        .typeError(t("required.field.error"))
        .positive("A phone number can't start with a minus")
        .integer("A phone number can't include a decimal point")
        .required(t("required.field.error")),
      password: id
        ? null
        : yup
            .string()
            .required(t("required.field.error"))
            .min(8, "Пароль слишком короткий — минимум 8 символов")
            .matches(
              /[a-zA-Z]/,
              "Пароль должен содержать только латинские буквы",
            )
            .matches(/[0-9]/, "Пароль должен содержать одну цифру"),
    });
  }, []);

  const formik = useFormik({
    initialValues : {
        fio: '',
        birthday: '',
        gender: '',
        phone: '',
        service_type: '',
        address: '',
        PINFL: '',
        passport_series: '',
        passport_number: '',
        validity: ''
    },
    onSubmit: values => {
      alert(JSON.stringify(values, null, 2));
    },
    validationSchema
})

  const saveChanges = (data) => {
    setSaveLoading(true);
    const selectedAction = id ? updateOperator(id, data) : postOperator(data);
    selectedAction
      .then(() => {
        history.goBack();
      })
      .finally(() => setSaveLoading(false));
  };

  const onSubmit = (values) => {
    const data = {
      ...values,
      user_role_id: values.user_roles.value,
      phone: "+998" + values.phone, // this is just to prevent validation of password
    };
    delete data.user_roles;
    delete data.region;
    delete data.lastname;
    saveChanges(data);
  };

//   const formik = useFormik({
//     initialValues,
//     onSubmit,
//     validationSchema,
//   });

  if (loader) return <CustomSkeleton />;

  const routes = [
    {
      title: t("add.patient"),
      link: true,
      route: `/home/patients`,
    },
  ];

//   const { values, handleChange, setFieldValue, handleSubmit } = formik;


  return (
    <div className="w-full">
      <form onSubmit={formik.handleSubmit}>
        <Header
          startAdornment={[<Breadcrumb routes={routes} />]}
          // title={t("add.patient")}
          endAdornment={[
            <Button
              icon={CancelIcon}
              size="large"
              shape="outlined"
              color="red"
              borderColor="bordercolor"
              onClick={(e) => history.go(-1)}
            >
              {t("cancel")}
            </Button>,
            <Button
              icon={SaveIcon}
              size="large"
              type="submit"
              loading={saveLoading}
            >
              {t(id ? "save" : "create")}
            </Button>,
          ]}
        />

        <div className="p-4">
          <div className="w-full grid grid-cols-12 gap-4">
            <Card title={t("patient.information")} className="col-span-12">
              <div className="grid grid-cols-2 gap-x-8">
                <div className="flex items-baseline">
                  <span className="w-1/4 input-label">{t("fio")}</span>
                  <div className="w-3/4">
                    <Form.Item formik={formik} name="fio">
                      <Input
                        size="large"
                        id="fio"
                        value={formik.values.fio}
                        onChange={formik.handleChange}
                        placeholder="Введите ФИО "
                      />
                    </Form.Item>
                  </div>
                </div>
                <div className="flex items-baseline">
                  <span className="w-1/4 input-label">{t("birthday")}</span>
                  <div className="w-3/4">
                    <Form.Item formik={formik}>
                      {/* <DatePicker 
                        value={formik.values.date}
                        onChange={formik.handleChange}
                        id="birthday"
                     /> */}
                      <Input
                        id="birthday"
                        type="date"
                        onChange={formik.handleChange}
                        value={formik.values.date}
                        placeholder="Введите дату рождение"
                      />
                    </Form.Item>
                  </div>
                </div>
                <div className="flex items-baseline">
                  <spam className="w-1/4 input-label">{t("gender")}</spam>
                  <div className="w-3/4">
                    <Form.Item formik={formik} name="gender">
                      <Select
                        height={40}
                        id="gender"
                        options={userRoles}
                        value={formik.values.user_roles}
                        onChange={(val) => formik.setFieldValue("gender", val)}
                        placeholder="Введите дату рождение"
                      />
                    </Form.Item>
                  </div>
                </div>
                <div className="flex items-baseline">
                  <span className="w-1/4 input-label">{t("phone")}</span>
                  <div className="w-3/4">
                    <Form.Item formik={formik}>
                      <CustomInputMask
                        className="mb-6"
                        mask={`+\\9\\9\\8 99 999 99 99`}
                        maskChar={null}
                        name="phone"
                        id="phone"
                        // {...formik.getFieldProps("phone_number")}
                        autoComplete="none"
                        onChange={formik.handleChange}
                        value={formik.values.phone}
                        placeholder="Введите рабочий телефон"
                      />
                    </Form.Item>
                  </div>
                </div>
                <div className="flex items-baseline">
                  <spam className="w-1/4 input-label">{t("service.type")}</spam>
                  <div className="w-3/4">
                    <Form.Item formik={formik} name="service_type">
                      <Select
                        height={40}
                        placeholder="Введите тип услуги"
                        id="service_type"
                        options={userRoles}
                        value={formik.values.user_roles}
                        onChange={(val) =>
                          formik.setFieldValue("service_type", val)
                        }
                      />
                    </Form.Item>
                  </div>
                </div>
                <div className="flex items-baseline">
                  <spam className="w-1/4 input-label">{t("doctor")}</spam>
                  <div className="w-3/4">
                    <Form.Item formik={formik} name="doctor">
                      <Select
                        height={40}
                        placeholder="Введите доктора"
                        id="doctor"
                        options={userRoles}
                        value={formik.values.user_roles}
                        onChange={(val) => formik.setFieldValue("doctor", val)}
                      />
                    </Form.Item>
                  </div>
                </div>
              </div>
            </Card>
            <Card title={t("address")} className="col-span-12">
              <div className="grid grid-cols-2 gap-x-8">
                <div className="flex items-baseline">
                  <span className="w-1/5 input-label">{t("region")}</span>
                  <div className="w-4/5">
                    <Form.Item formik={formik} name="region">
                      <Input
                        placeholder="Введите Регион"
                        size="large"
                        id="region"
                        value={formik.values.phone}
                        onChange={formik.handleChange}
                      />
                    </Form.Item>
                  </div>
                </div>

                <div className="flex items-baseline">
                  <span className="w-1/5 input-label">{t("address")}</span>
                  <div className="w-4/5">
                    <Form.Item formik={formik} name="address">
                      <Input
                        size="large"
                        placeholder="Введите Адрес"
                        id="address"
                        value={formik.values.username}
                        onChange={formik.handleChange}
                      />
                    </Form.Item>
                  </div>
                </div>

                <div className={id ? "hidden" : "flex items-baseline"}>
                  <span className="w-1/5 input-label">{t("district")}</span>
                  <div className="w-4/5">
                    <Form.Item formik={formik} name="district">
                      <Input
                        size="large"
                        id="district"
                        placeholder="Введите Район"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                      />
                    </Form.Item>
                  </div>
                </div>
              </div>
            </Card>
            <Card title={t("passport.details")} className="col-span-12">
              <div className="grid grid-cols-2 gap-x-8">
                <div className="flex items-baseline">
                  <span className="w-1/5 input-label">{t("PINFL")}</span>
                  <div className="w-4/5">
                    <Form.Item formik={formik} name="PINFL">
                      <Input
                        size="large"
                        id="PINFL"
                        placeholder="Введите ПИНФЛ"
                        value={formik.values.PINFL}
                        onChange={formik.handleChange}
                      />
                    </Form.Item>
                  </div>
                </div>

                <div className="flex items-baseline">
                  <span className="w-1/5 input-label">
                    {t("passport.series")}
                  </span>
                  <div className="w-4/5">
                    <Form.Item formik={formik} name="passport_series">
                      <Input
                        size="large"
                        placeholder="Введите серию паспорта"
                        id="passport_series"
                        value={formik.values.passport_series}
                        onChange={formik.handleChange}
                      />
                    </Form.Item>
                  </div>
                </div>

                <div className="flex items-baseline">
                  <span className="w-1/5 input-label">
                    {t("passport.number")}
                  </span>
                  <div className="w-4/5">
                    <Form.Item formik={formik} name="passport_number">
                      <Input
                        size="large"
                        id="passport_number"
                        placeholder="Введите номер паспорта"
                        value={formik.values.passport_number}
                        onChange={formik.handleChange}
                      />
                    </Form.Item>
                  </div>
                </div>

                <div className="flex items-baseline">
                  <span className="w-1/5 input-label">{t("validity")}</span>
                  <div className="w-4/5">
                    <Form.Item formik={formik} name="validity">
                      {/* <DatePicker /> */}
                      <Input
                        type="date"
                        id="validity"
                        value={formik.values.validity}
                        placeholder="Введите срок действия паспорта"
                        onChange={formik.handleChange}
                      />
                    </Form.Item>
                  </div>
                </div>

                <div className="flex items-baseline">
                  <span className="w-1/5 input-label">
                    {t("passport.photo")}
                  </span>
                  <div className="w-4/5">
                    <Form.Item formik={formik} name="passport_photo">
                      <Gallery />
                    </Form.Item>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}