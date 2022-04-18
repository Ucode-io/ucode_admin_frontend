import { useMemo, useState, useEffect } from "react";
import Card from "components/Card";
import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router-dom";
import { Input } from "alisa-ui";
import Form from "components/Form/Index";
import * as yup from "yup";
import { useFormik } from "formik";
import Header from "components/Header";
import Button from "components/Button";
import Breadcrumb from "components/Breadcrumb";
import CancelIcon from "@material-ui/icons/Cancel";
import SaveIcon from "@material-ui/icons/Save";
import { getUserRole, postUserRole, updateUserRole } from "services/userRoles";

export default function UserRolesCreate() {
  const { t } = useTranslation();
  const history = useHistory();
  const params = useParams();
  const [saveLoading, setSaveLoading] = useState(false);

  useEffect(() => {
    if (params.id) {
      getUserRole(params.id).then((res) => {
        setValues({
          name: res.name,
          phone_number: res.phone_number,
        });
      });
    }
  }, []);

  const initialValues = useMemo(
    () => ({
      name: null,
      phone_number: null,
    }),
    [],
  );

  const validationSchema = useMemo(() => {
    const defaultSchema = yup.mixed().required(t("required.field.error"));
    return yup.object().shape({
      name: defaultSchema,
      phone_number: defaultSchema,
    });
  }, []);

  const onSubmit = (values) => {
    const data = {
      ...values,
    };

    setSaveLoading(true);
    const selectedAction = params.id
      ? updateUserRole(params.id, data)
      : postUserRole(data);
    selectedAction
      .then((res) => {
        history.goBack();
      })
      .finally(() => {
        setSaveLoading(false);
      });
  };

  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
  });

  const { values, handleChange, setFieldValue, setValues, handleSubmit } =
    formik;

  const routes = [
    {
      title: t(`user-roles`),
      link: true,
      route: `/home/settings/user-roles`,
    },
    {
      title: t("create"),
    },
  ];

  const headerButtons = [
    <Button
      icon={CancelIcon}
      size="large"
      shape="outlined"
      color="red"
      borderColor="bordercolor"
      onClick={() => history.goBack()}
    >
      {t("cancel")}
    </Button>,
    <Button icon={SaveIcon} size="large" type="submit" loading={saveLoading}>
      {t("save")}
    </Button>,
  ];

  return <h1>Сейчас в разработке</h1>;
  {
    /* <form onSubmit={handleSubmit}>
      <Header
        startAdornment={[<Breadcrumb routes={routes} />]}
        endAdornment={headerButtons}
      />

      <div className="m-4">
        <div className="grid grid-cols-2 gap-5">
          <Card title={t("general.information")}>
            <div className="grid grid-cols-3 items-baseline">
              <div className="input-label">{t("name")}</div>
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

              <div className="input-label">{t("phone.number")}</div>
              <div className="col-span-2">
                <Form.Item formik={formik} name="phone_number">
                  <Input
                    size="large"
                    value={values.phone_number}
                    onChange={handleChange}
                    name="phone_number"
                  />
                </Form.Item>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </form> */
  }
}
