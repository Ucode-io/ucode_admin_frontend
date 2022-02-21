import { useState, useEffect } from "react";
import axios from "../../utils/axios";
import Header from "./Header";
import Content from "./Content";
import Skeleton from "@material-ui/lab/Skeleton";
import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router-dom";

import { Formik } from "formik";
import * as Yup from "yup";

export default function RolesCreate() {
  // **** USE-HOOKS ****
  const { t } = useTranslation();
  const history = useHistory();
  const params = useParams();

  const [loading, setLoading] = useState(false);
  const [isGettingData, setIsGettingData] = useState(false);
  const [initialValues, setInitialValues] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    console.log(params);
    getPermission(params.id);
  }, []);

  // **** FUNCTIONS ****
  const getPermission = (id) => {
    if (!params.id) return setIsGettingData(true);
    axios
      .get(`/permission/${id}`)
      .then((res) => {
        console.log(res);
        setInitialValues(res);
      })
      .catch((err) => console.log(err))
      .finally(() => setIsGettingData(false));
  };

  // **** EVENTS ****
  const onSubmit = (values) => {
    setLoading(true);
    if (params.id) {
      axios
        .put(`/permission/${params.id}`, { ...values })
        .then((res) => {
          console.log(res);
          history.push("/home/settings/permission");
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      axios
        .post("/permission", { ...values })
        .then((res) => {
          console.log(res);
          history.push("/home/settings/permission");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  // **** CONSTANTS ****
  const ValidationSchema = Yup.object().shape({
    name: Yup.string().required(t("required.field.error")),
    description: Yup.string().required(t("required.field.error")),
  });

  return (
    <div>
      {!params.id || !isGettingData ? (
        <Formik
          initialValues={initialValues}
          onSubmit={onSubmit}
          validationSchema={ValidationSchema}
        >
          {(formik) => (
            <form onSubmit={formik.handleSubmit}>
              <Header params={params} loading={loading} />
              <Content formik={formik} />
            </form>
          )}
        </Formik>
      ) : (
        <Skeleton />
      )}
    </div>
  );
}
