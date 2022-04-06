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

export default function CreateOperator() {
  const history = useHistory();
  const { id } = useParams();
  const { t } = useTranslation();
  const [saveLoading, setSaveLoading] = useState(false);
  const [loader, setLoader] = useState(true);
  const [userRoles, setUserRoles] = useState([]);
  const [regions, setRegions] = useState([]);
  const [visible, setVisible] = useState(false);

  const getItem = () => {
    if (!id) return setLoader(false);
    setLoader(true);
    getOperator(id)
      .then((res) => {
        formik.setValues({
          name: res.name,
          phone: res.phone?.substring(4),
          username: res.username,
          region_ids: res.region_ids.map((id, _) => id),
          user_roles: {
            label: res.name,
            value: res.user_role_id,
          },
          password: "no_password",
        });
      })
      .finally(() => setLoader(false));
  };

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
    getItem();
  }, []);

  const initialValues = useMemo(
    () => ({
      name: "",
      user_roles: null,
      username: "",
      phone: "",
      password: "",
      region_ids: [],
      lastname: "",
    }),
    [],
  );

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

  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
  });

  if (loader) return <CustomSkeleton />;

  const routes = [
    {
      title: t("add.patient"),
      link: true,
      route: `/home/patients`,
    },
    // {
    //   title: id ? formik.values?.user_roles?.label : t("create"),
    // },
  ];

  const { values, handleChange, setFieldValue, handleSubmit } = formik;

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit}>
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
            <Card title={t("personal.data")} className="col-span-12">
              <div className="grid grid-cols-2 gap-8">
                <div className="flex items-baseline">
                  <span className="w-1/4 input-label">{t("first.name")}</span>
                  <div className="w-3/4">
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
                <div className="flex items-baseline">
                  <span className="w-1/4 input-label">{t("last.name")}</span>
                  <div className="w-3/4">
                    <Form.Item formik={formik}>
                      <Input
                        size="large"
                        // id="lastname"
                        // value={values.lastname}
                        // onChange={handleChange}
                      />
                    </Form.Item>
                  </div>
                </div>
                <div className="flex items-baseline">
                  <spam className="w-1/4 input-label">{t("position")}</spam>
                  <div className="w-3/4">
                    <Form.Item formik={formik} name="user_roles">
                      <Select
                        height={40}
                        id="user_roles"
                        options={userRoles}
                        value={values.user_roles}
                        onChange={(val) => setFieldValue("user_roles", val)}
                      />
                    </Form.Item>
                  </div>
                </div>
                <div className="flex items-baseline">
                  <span className="w-1/4 input-label">{t("last.name")}</span>
                  <div className="w-3/4">
                    <Form.Item formik={formik}>
                      <Input
                        size="large"
                        // id="lastname"
                        // value={values.lastname}
                        // onChange={handleChange}
                      />
                    </Form.Item>
                  </div>
                </div>
                <div className="flex items-baseline">
                  <spam className="w-1/4 input-label">{t("position")}</spam>
                  <div className="w-3/4">
                    <Form.Item formik={formik} name="user_roles">
                      <Select
                        height={40}
                        id="user_roles"
                        options={userRoles}
                        value={values.user_roles}
                        onChange={(val) => setFieldValue("user_roles", val)}
                      />
                    </Form.Item>
                  </div>
                </div>
                <div className="flex items-baseline">
                  <spam className="w-1/4 input-label">{t("position")}</spam>
                  <div className="w-3/4">
                    <Form.Item formik={formik} name="user_roles">
                      <Select
                        height={40}
                        id="user_roles"
                        options={userRoles}
                        value={values.user_roles}
                        onChange={(val) => setFieldValue("user_roles", val)}
                      />
                    </Form.Item>
                  </div>
                </div>
                
              </div>
            </Card>
            <Card title={t("authorization")} className="col-span-12">
              <div className="flex items-baseline">
                <span className="w-1/5 input-label">{t("phone.number")}</span>
                <div className="w-4/5">
                  <Form.Item formik={formik} name="phone">
                    <Input
                      size="large"
                      prefix="+998"
                      id="phone"
                      type="number"
                      value={values.phone}
                      onChange={handleChange}
                    />
                  </Form.Item>
                </div>
              </div>

              <div className="flex items-baseline">
                <span className="w-1/5 input-label">{t("login")}</span>
                <div className="w-4/5">
                  <Form.Item formik={formik} name="username">
                    <Input
                      size="large"
                      id="username"
                      value={values.username}
                      onChange={handleChange}
                    />
                  </Form.Item>
                </div>
              </div>

              <div className={id ? "hidden" : "flex items-baseline"}>
                <span className="w-1/5 input-label">{t("enter.password")}</span>
                <div className="w-4/5">
                  <Form.Item formik={formik} name="password">
                    <Input
                      size="large"
                      id="password"
                      type={visible ? "text" : "password"}
                      suffix={
                        <VisibilityIcon
                          className="cursor-pointer"
                          onClick={() => setVisible((prev) => !prev)}
                        />
                      }
                      value={values.password}
                      onChange={handleChange}
                    />
                  </Form.Item>
                </div>
              </div>
            </Card>
            <Card title={t("access")} className="col-span-12">
              <div className="grid grid-cols-2 gap-8">
                <div className="flex items-baseline">
                  <spam className="w-1/4 input-label">{t("position")}</spam>
                  <div className="w-3/4">
                    <Form.Item formik={formik} name="user_roles">
                      <Select
                        height={40}
                        id="user_roles"
                        options={userRoles}
                        value={values.user_roles}
                        onChange={(val) => setFieldValue("user_roles", val)}
                      />
                    </Form.Item>
                  </div>
                </div>

                <div className="flex items-baseline">
                  <spam className="w-1/4 input-label">{t("regions")}</spam>
                  <div className="w-3/4">
                    <Form.Item formik={formik} name="region_ids">
                      <Select
                        id="region_ids"
                        isMulti
                        height={40}
                        value={
                          regions && regions.length
                            ? regions.filter((item) =>
                                values.region_ids.includes(item.value),
                              )
                            : []
                        }
                        onChange={(val) => {
                          setFieldValue(
                            "region_ids",
                            val && val.length
                              ? val.map((item) => item.value)
                              : [],
                          );
                        }}
                        options={regions}
                      />
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
