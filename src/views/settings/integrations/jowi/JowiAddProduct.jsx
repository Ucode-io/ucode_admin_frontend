import { useMemo, useState, useEffect, useCallback } from "react";
import Card from "components/Card";
import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router-dom";
import Form from "components/Form/Index";
import * as yup from "yup";
import { useFormik } from "formik";
import Header from "components/Header";
import Button from "components/Button";
import Breadcrumb from "components/Breadcrumb";
import CancelIcon from "@material-ui/icons/Cancel";
import SaveIcon from "@material-ui/icons/Save";
import {
  getBranchesCount,
  getJowiMenu,
  getProduct,
  postProduct,
} from "../../../../services";
import { getOnePayme } from "services/promotion";
import CustomSkeleton from "components/Skeleton";
import Async from "components/Select/Async";

export default function JowiAddProduct() {
  const { t } = useTranslation();
  const history = useHistory();
  const params = useParams();
  const [saveLoading, setSaveLoading] = useState(false);
  const [items, setItems] = useState();
  const [loader, setLoader] = useState(true);
  const [jowiMenu, setJowiMenu] = useState();

  useEffect(() => {
    getItems();
    fetchData();
  }, []);

  useEffect(() => {
    if (params.branch_id) {
      getBranchesCount.then((res) => {
        setValues({
          login: res.login,
          key: res.key,
          branch_id: res.branch_id,
        });
      });
    }
  }, []);

  const fetchData = () => {
    if (params.id) {
      setLoader(true);
      getOnePayme(params.id)
        .then((res) => {
          formik.setValues({
            login: res.login,
            key: res.key,
            branch_id: res.branch_id,
          });
        })
        .finally(() => setLoader(false));
    } else {
      setLoader(false);
    }
  };

  const getItems = (page) => {
    getProduct({ limit: 10, page }).then((res) => {
      setItems(res.products);
    });
    getJowiMenu({ limit: 10, page: 1 }).then((res) => {
      setJowiMenu(res.products);
    });
  };
  const products = items?.map((elm) => ({
    label: elm?.name,
    value: elm?.id,
  }));
  const menu = jowiMenu?.map((elm) => ({
    label: elm?.name,
    value: elm?.id,
  }));

  const loadBranch = useCallback(
    (input, cb) => {
      getProduct({ limit: 10, search: input })
        .then((res) => {
          var products = res.products?.map((elm) => ({
            label: `${elm?.name} (${elm?.price}uzs)`,
            value: elm?.id,
            price: elm?.price,
            category_id: elm?.category_id,
            description: elm?.description,
            description_v2: elm?.description_v2,
            name: elm?.name,
            order_no: elm?.order_no,
            slug: elm?.slug,
            title: elm?.title,
          }));
          products = products.filter((elm) => elm.value !== params.id);
          cb(products);
        })
        .catch((err) => console.log(err));
    },
    [params.id],
  );
  const loadMenu = useCallback(
    (input, cb) => {
      getJowiMenu({ limit: 10, search: input })
        .then((res) => {
          var products = res.products?.map((elm) => ({
            label: `${elm?.name} (${elm?.price}uzs)`,
            value: elm?.id,
            price: elm?.price,
          }));
          products = products.filter((elm) => elm.value !== params.id);
          cb(products);
        })
        .catch((err) => console.log(err));
    },
    [params.id],
  );

  const initialValues = useMemo(
    () => ({
      menu: null,
      product: null,
    }),
    [],
  );

  const validationSchema = useMemo(() => {
    const defaultSchema = yup.mixed().required(t("required.field.error"));
    return yup.object().shape({
      menu: defaultSchema,
    });
  }, []);

  const onSubmit = (values) => {
    const data = {
      category_id: values.product?.category_id,
      description: values.product?.description,
      description_v2: values.product?.description_v2,
      iiko_id: "",
      image: "",
      is_active: true,
      id: values.product.value,
      name: values.product.name,
      order_no: values.product.order_no,
      slug: values.product.slug,
      title: values.product.title,
      jowi_id: values.menu.value,
    };

    setSaveLoading(true);
    const selectedAction = params.id
      ? postProduct(data, params.id)
      : postProduct(data.id, data);
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

  console.log("values", values);
  const routes = [
    {
      title: t(`aggregator`),
      link: true,
      route: `/home/settings/aggregator`,
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

  if (loader) return <CustomSkeleton />;

  return (
    <form onSubmit={handleSubmit}>
      <Header
        startAdornment={[<Breadcrumb routes={routes} />]}
        endAdornment={headerButtons}
      />

      <div className="m-4">
        <div className="grid grid-cols-1 gap-5">
          <Card title={t("general.information")}>
            <div className="grid grid-cols-4 gap-5 items-baseline">
              <div className="col-span-2">
                <Form.Item formik={formik} name="product">
                  <div className="input-label">
                    <span style={{ color: "red" }}>*</span>{" "}
                    {t("Пожалуйста, выберите продукт")}
                  </div>
                  <Async
                    isSearchable
                    isClearable
                    cacheOptions
                    height={40}
                    name="product"
                    options={products}
                    loadOptions={loadBranch}
                    defaultOptions={true}
                    value={values.product}
                    onChange={(val) => {
                      formik.setFieldValue("product", val);
                    }}
                  />
                </Form.Item>
              </div>

              <div className="col-span-2">
                <Form.Item formik={formik} name="menu">
                  <div className="input-label">
                    <span style={{ color: "red" }}>*</span>{" "}
                    {t("Пожалуйста, выберите Jowi Menu")}
                  </div>
                  <Async
                    isSearchable
                    isClearable
                    cacheOptions
                    height={40}
                    options={menu}
                    loadOptions={loadMenu}
                    defaultOptions={true}
                    value={values.menu}
                    onChange={(val) => {
                      formik.setFieldValue("menu", val);
                    }}
                  />
                </Form.Item>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </form>
  );
}
