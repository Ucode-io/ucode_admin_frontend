import React, { useEffect, useState } from "react";
import * as yup from "yup";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import { getFares, postFare, updateFare } from "services/fares";
import Card from "components/Card";
import Form from "components/Form/Index";
import { Input } from "alisa-ui";
import Button from "components/Button";
import { CircularProgress } from "@material-ui/core";

export default function Powers({ createModal, setCreateModal }) {
  const { t } = useTranslation();
  const [items, setItems] = useState({});
  const [loader, setLoader] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [saveLoading, setSaveLoading] = useState(false);

  useEffect(() => {
    getItems(currentPage);
  }, [currentPage]);

  const getItems = (page) => {
    setLoader(true);
    getFares({ limit: 10, page })
      .then((res) => {
        setItems({
          count: res.count,
          data: res.fares,
        });
      })
      .finally(() => setLoader(false));
  };

  const onSubmit = (values) => {
    const data = {
      ...values,
    };

    setSaveLoading(true);
    updateFare(createModal.id, data)
      .then((res) => {
        getItems(currentPage);
      })
      .finally(() => {
        setSaveLoading(false);
      });
  };

  const formik = useFormik({
    initialValues: {
      api_login: null,
      dispatcher_id: null,
    },
    validationSchema: yup.object().shape({
      api_login: yup.mixed().required(t("required.field.error")),
      dispatcher_id: yup.mixed().required(t("required.field.error")),
    }),
    onSubmit,
  });

  const { values, handleChange, setFieldValue, setValues, handleSubmit } =
    formik;

  return (
    <form onSubmit={handleSubmit}>
      {loader ? (
        <div className="flex justify-center items-center h-40">
          <CircularProgress />
        </div>
      ) : (
        <Card className="m-4">
          {/* API Login */}
          <div className="input-label">{t("api_login")}</div>
          <div className="col-span-1">
            <Form.Item formik={formik} name="api_login">
              <Input
                size="large"
                value={values.name}
                onChange={handleChange}
                name="api_login"
                placeholder={t("api_login")}
              />
            </Form.Item>
          </div>
          {/* Dispatcher ID */}
          <div className="input-label">{t("dispatcher_id")}</div>
          <div className="col-span-1">
            <Form.Item formik={formik} name="dispatcher_id">
              <Input
                size="large"
                value={values.name}
                onChange={handleChange}
                name="dispatcher_id"
                placeholder={t("dispatcher_id")}
              />
            </Form.Item>
          </div>
          <Button type="submit" loading={saveLoading}>
            {t("save")}
          </Button>
        </Card>
      )}
    </form>
  );
}
