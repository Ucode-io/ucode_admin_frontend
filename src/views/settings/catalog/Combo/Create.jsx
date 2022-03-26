import { useState, useEffect, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Formik } from "formik";
import { getV2Combo, postV2Combo, updateV2Combo } from "services";
import { useParams } from "react-router-dom";
import Header from "components/Header";
import Breadcrumb from "components/Breadcrumb";
import Button from "components/Button";
import CancelIcon from "@material-ui/icons/Cancel";
import SaveIcon from "@material-ui/icons/Save";
import { useHistory } from "react-router-dom";
import FullScreenLoader from "components/FullScreenLoader";
import * as Yup from "yup";
import Filters from "components/Filters";
import validate from "helpers/validateField";
import Card from "components/Card";
import Form from "components/Form/Index";
import { Input } from "alisa-ui";

export default function CreateCombo() {
  const { t } = useTranslation();
  const history = useHistory();
  const { id } = useParams();

  const [initialValues, setInitialValues] = useState();
  const [btnDisabled, setBtnDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchProductData = useCallback(async () => {
    if (id) {
      return await getV2Combo(id);
    }
  }, [id]);

  const saveChanges = useCallback(
    (data) => {
      setBtnDisabled(true);
      if (id) {
        updateV2Combo(id, data)
          .then(() => history.push("/home/catalog/combo"))
          .finally(() => setBtnDisabled(false));
      } else {
        postV2Combo(data)
          .then(() => history.push("/home/catalog/combo"))
          .finally(() => setBtnDisabled(false));
      }
    },
    [history, id],
  );

  const onSubmit = useCallback(
    (values) => {
      var data = values;
      saveChanges(data);
    },
    [saveChanges],
  );

  useEffect(() => {
    setIsLoading(true);
    fetchData().finally(() => {
      setIsLoading(false);
    });
  }, [fetchData]);

  useEffect(() => {
    setIsLoading(true);
    fetchProductData()
      .then((data) => {
        data && setInitialValues(data);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [fetchProductData]);

  const validationSchema = useMemo(() => {
    return Yup.object().shape({
      name: validate(),
    });
  }, []);

  const routes = [
    {
      title: <div>{t("combo")}</div>,
      link: true,
      route: `/home/catalog/combo`,
    },
    {
      title: id ? t("edit") : t("create"),
    },
  ];

  return (
    <>
      {isLoading ? (
        <FullScreenLoader />
      ) : (
        <>
          <Formik
            initialValues={initialValues}
            onSubmit={onSubmit}
            validationSchema={validationSchema}
          >
            {(formik) => (
              <form onSubmit={formik.handleSubmit}>
                <Header
                  startAdornment={[<Breadcrumb routes={routes} />]}
                  endAdornment={[
                    <Button
                      icon={CancelIcon}
                      size="large"
                      shape="outlined"
                      color="red"
                      iconClassName="red"
                      borderColor="bordercolor"
                      onClick={() => history.goBack()}
                    >
                      {t("cancel")}
                    </Button>,
                    <Button
                      icon={SaveIcon}
                      size="large"
                      type="submit"
                      loading={btnDisabled}
                    >
                      {t(id ? "save" : "create")}
                    </Button>,
                  ]}
                />
                <Filters></Filters>

                <div className="m-4">
                  <div className="grid grid-cols-2 gap-5">
                    <Card title={t("general.information")}>
                      <div className="grid grid-cols-3 items-baseline">
                        <div className="input-label">{t("reduction")}</div>
                        <div className="col-span-2">
                          <Form.Item formik={formik} name="reduction">
                            <Input
                              size="large"
                              value={"novalue"}
                              onChange={formik.handleChange}
                              name="reduction"
                            />
                          </Form.Item>
                        </div>

                        <div className="input-label">{t("reduction")}</div>
                        <div className="col-span-2">
                          <Form.Item formik={formik} name="reduction">
                            <Input
                              size="large"
                              value={"novalue"}
                              onChange={formik.handleChange}
                              name="reduction"
                            />
                          </Form.Item>
                        </div>

                        <div className="input-label">{t("reduction")}</div>
                        <div className="col-span-2">
                          <Form.Item formik={formik} name="reduction">
                            <Input
                              size="large"
                              value={"novalue"}
                              onChange={formik.handleChange}
                              name="reduction"
                            />
                          </Form.Item>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
              </form>
            )}
          </Formik>
        </>
      )}
    </>
  );
}
