import React, { useEffect, useMemo, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router-dom";
import { Input } from "alisa-ui";
import "./styles.scss";

//components and functions
import Form from "components/Form/Index";
import Breadcrumb from "components/Breadcrumb";
import Header from "components/Header";
import Card from "components/Card";
import Button from "components/Button";
import { updateCourierType } from "services/courierType";
import CancelIcon from "@material-ui/icons/Cancel";
import SaveIcon from "@material-ui/icons/Save";
import { StyledTab, StyledTabs } from "components/StyledTabs";
import RusFlag from "assets/icons/Ellipse 8.png";
import EngFlag from "assets/icons/Ellipse 9.png";
import FlagUz from "assets/icons/Ellipse 7.png";
import Filters from "components/Filters";
import CustomSkeleton from "components/Skeleton";
import Select from "components/Select";
import IconButton from "components/Button/IconButton";
import ClearIcon from "@material-ui/icons/Clear";
import { getMenus } from "services";
import {
  getCategories,
  getCompanyCategories,
  getOneCompanyCategory,
} from "services/company_category";
import { getOnePromotion, savePromotion } from "services/promotion";
import ProductModal from "./ProductModal";

export default function CreateCourierType() {
  const history = useHistory();
  const { id } = useParams();
  const { t } = useTranslation();
  const [saveLoading, setSaveLoading] = useState(false);
  const [loader, setLoader] = useState(false);
  const [checkedProducts, setCheckedProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [menuIds, setMenuIds] = useState([]);
  const [shippers, setShippers] = useState([]);
  const [open, setOpen] = useState(false);
  const [menus, setMenus] = useState([]);
  const [companyCategories, setCompanyCategories] = useState([]);
  const [selectedTab, setSelectedTab] = useState("ru");
  const [productsSwitch, setProductsSwitch] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState(null);
  const [weekArray, setWeekArray] = useState([
    {
      id: 1,
      title: "monday",
      isChecked: true,
      value: {
        startDate: "",
        endDate: "",
      },
    },
    {
      id: 2,
      title: "tuesday",
      isChecked: true,
      value: {
        startDate: "",
        endDate: "",
      },
    },
    {
      id: 3,
      title: "wednesday",
      isChecked: true,
      value: {
        startDate: "",
        endDate: "",
      },
    },
    {
      id: 4,
      title: "thursday",
      isChecked: true,
      value: {
        startDate: "",
        endDate: "",
      },
    },
    {
      id: 5,
      title: "friday",
      isChecked: true,
      value: {
        startDate: "",
        endDate: "",
      },
    },
    {
      id: 6,
      title: "saturday",
      isChecked: true,
      value: {
        startDate: "",
        endDate: "",
      },
    },
    {
      id: 7,
      title: "sunday",
      isChecked: true,
      value: {
        startDate: "",
        endDate: "",
      },
    },
  ]);

  const changeWeekArray = (e) => {
    setWeekArray((prev) =>
      prev.map((item) =>
        String(item.id) === e.target.value
          ? {
              ...item,
              isChecked: !item.isChecked,
            }
          : item,
      ),
    );
  };

  const getItem = () => {
    if (!id) return setLoader(false);
    setLoader(true);
    getOnePromotion(id)
      .then((res) => {
        console.log(res);
        // formik.setValues({
        //   name: res.name,
        // })
      })
      .finally(() => setLoader(false));
  };

  const tabLabel = (text, _) => {
    return <span className="px-1">{text}</span>;
  };

  useEffect(() => {
    getItem();
    getCompanyCategories({ limit: 1000 }).then((res) => {
      setCompanyCategories(res?.company_categories);
    });
  }, []);

  const initialValues = useMemo(
    () => ({
      name: {
        uz: "",
        ru: "",
        en: "",
      },
      company_category: null,
      discount_value: "",
      start_date: "",
      end_date: "",
    }),
    [],
  );

  const validationSchema = useMemo(() => {
    const defaultSchema = yup.mixed().required(t("required.field.error"));
    return yup.object().shape({
      name: defaultSchema,
    });
  }, []);

  const saveChanges = (data) => {
    delete data.company_category;
    const daily_start_times = weekArray.map((item) => item.value.startDate);
    const daily_end_times = weekArray.map((item) => item.value.endDate);
    const start_date = `${data.start_date.split("-")[1]}-${
      data.start_date.split("-")[2]
    }-${data.start_date.split("-")[0]}`;
    const end_date = `${data.end_date.split("-")[1]}-${
      data.end_date.split("-")[2]
    }-${data.end_date.split("-")[0]}`;
    setSaveLoading(true);
    const selectedAction = id
      ? updateCourierType(id, data)
      : savePromotion({
          ...data,
          product_ids: checkedProducts,
          shipper_ids: data.shipper_ids.map((item) => item.value),
          region_ids: [],
          discount_type: data.discount_type.value,
          expense_type: data.expense_type.value,
          daily_start_times,
          daily_end_times,
          start_date,
          end_date,
          is_active: true,
        });
    selectedAction
      .then(() => {
        history.goBack();
      })
      .finally(() => setSaveLoading(false));
  };

  const onSubmit = (values) => {
    saveChanges(values);
  };

  const onFieldChange = (name, e) => {
    setFieldValue(`${name}.${selectedTab}`, e.target.value);
  };

  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
  });

  const { values, setFieldValue, handleChange, handleSubmit } = formik;

  useEffect(() => {
    if (values.company_category) {
      getOneCompanyCategory(values.company_category.value).then((res) => {
        const result = res?.shippers?.map((item) => ({
          label: item.name,
          value: item.id,
        }));
        setShippers(result);
        setFieldValue("shipper_ids", result);
      });
    }
  }, [values.company_category]);

  useEffect(() => {
    if (values.shipper_ids) {
      setMenus([]);
      values.shipper_ids.map((item) => {
        getMenus({ shipper_id: item.value, limit: 1000 }).then((res) => {
          setMenus((prev) => [...prev, ...res.menus]);
        });
      });
    }
  }, [values.shipper_ids]);

  const handleChangeTimes = (event, id, action) => {
    setWeekArray((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              value: {
                ...item.value,
                [action]: event.target.value,
              },
            }
          : item,
      ),
    );
  };

  if (loader) return <CustomSkeleton />;

  const routes = [
    {
      title: t("list.stocks"),
      link: true,
      route: `/home/marketing/stocks`,
    },
    {
      title: id ? formik.values?.name.ru : t("create"),
    },
  ];

  const openPopup = (data) => {
    let mySet = new Set([...menuIds, data.value]);
    setMenuIds(Array.from(mySet));
    getCategories({
      menu_id: data.value,
      with_product: true,
    }).then((res) => {
      setOpen(true);
      setCategories(res.categories || []);
      res.categories?.forEach((item) => {
        setCategoryId(null);
        if (item.products) {
          if (!menuIds.includes(data.value)) {
            item.products.forEach((el) => {
              setCheckedProducts((prev) => [...prev, el.id]);
            });
          }
          setProducts((prev) => [...prev, ...item.products]);
        }
      });
    });
  };
  const switchCategory = (id) => {
    const newProducts = categories.find((item) => item.id === id);
    setCategoryId(id);
    setProducts(newProducts.products || []);
  };

  return (
    <div className="w-full Stocks">
      <form onSubmit={handleSubmit}>
        <Header
          startAdornment={[<Breadcrumb routes={routes} />]}
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
              onClick={() => console.log()}
            >
              {t(id ? "save" : "create")}
            </Button>,
          ]}
        />

        <div className="p-4 w-full flex flex-col gap-4 box-border font-body text-sm">
          <Card title={t("general.settings")}>
            <div className="w-full grid grid-cols-12 gap-8">
              <div className="col-span-12">
                <Filters
                  className="mb-4 filterStock"
                  style={{ borderTop: "none" }}
                >
                  <StyledTabs
                    value={selectedTab}
                    onChange={(_, value) => {
                      setSelectedTab(value);
                    }}
                    indicatorColor="primary"
                    textColor="primary"
                    centered={false}
                    aria-label="full width tabs example"
                    TabIndicatorProps={{ children: <span className="w-2" /> }}
                  >
                    <StyledTab
                      label={
                        <div className="flex items-center">
                          <img
                            className="mr-2"
                            src={RusFlag}
                            width={16}
                            alt=""
                          />
                          {tabLabel(t("russian"))}
                        </div>
                      }
                      value="ru"
                    />
                    <StyledTab
                      label={
                        <div className="flex items-center">
                          <img
                            className="mr-2"
                            src={EngFlag}
                            width={16}
                            alt=""
                          />
                          {tabLabel(t("english"))}
                        </div>
                      }
                      value="en"
                    />
                    <StyledTab
                      label={
                        <div className="flex items-center">
                          <img
                            className="mr-2"
                            src={FlagUz}
                            width={16}
                            alt=""
                          />
                          {tabLabel(t("uzbek"))}
                        </div>
                      }
                      value="uz"
                    />
                  </StyledTabs>
                </Filters>
                <div className="grid grid-cols-12 items-baseline">
                  <span className="col-span-3 input-label">
                    {t(`name.in.${selectedTab}`)}
                  </span>
                  <div className="col-span-9">
                    <Form.Item formik={formik} name={`name.${selectedTab}`}>
                      <Input
                        size="large"
                        value={values?.name?.[selectedTab]}
                        onChange={(e) => onFieldChange("name", e)}
                      />
                    </Form.Item>
                  </div>
                </div>

                <div className="grid grid-cols-12 gap-4 items-baseline">
                  <span className="col-span-3 input-label">
                    {t(`start.time`)}
                  </span>
                  <div className="col-span-4">
                    <Form.Item formik={formik} name="start_date">
                      <Input
                        type="date"
                        size="large"
                        id="start_date"
                        onChange={handleChange}
                      />
                    </Form.Item>
                  </div>
                  <div className="col-span-4 ">
                    <Form.Item formik={formik} name="end_date">
                      <Input
                        type="date"
                        size="large"
                        id="end_date"
                        onChange={handleChange}
                      />
                    </Form.Item>
                  </div>
                </div>
              </div>
            </div>
          </Card>
          <Card title={t("goods")}>
            <div className="grid grid-cols-12 items-baseline">
              <span className="col-span-3 input-label">{t("categories")}</span>
              <div className="col-span-9">
                <div className="flex gap-8 items-start">
                  <div className="w-full">
                    <Form.Item formik={formik} name="company_category">
                      <Select
                        height={40}
                        options={companyCategories.map((elm) => ({
                          label: elm.name[selectedTab],
                          value: elm.id,
                        }))}
                        value={values.company_category}
                        onChange={(val) =>
                          setFieldValue("company_category", val)
                        }
                      />
                    </Form.Item>
                  </div>
                  <div>
                    <IconButton
                      style={{ width: "40px", height: "40px" }}
                      color="red"
                      icon={<ClearIcon />}
                      onClick={() => setFieldValue("company_category", {})}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-12 items-baseline">
              <span className="col-span-3 input-label">{t("restaurants")}</span>
              <div className="col-span-9">
                <div className="flex gap-8 items-start">
                  <div className="w-full">
                    <Form.Item formik={formik} name="shipper_ids">
                      <Select
                        isMulti
                        height={40}
                        options={shippers}
                        value={values.shipper_ids}
                        maxMenuHeight={200}
                        onChange={(val) => setFieldValue("shipper_ids", val)}
                      />
                    </Form.Item>
                  </div>
                  <div>
                    <IconButton
                      style={{ width: "40px", height: "40px" }}
                      color="red"
                      onClick={() => setFieldValue("shipper_ids", [])}
                      icon={<ClearIcon />}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-12 items-baseline">
              <span className="col-span-3 input-label">{t("products")}</span>
              <div className="col-span-9">
                <div className="flex gap-8 items-start">
                  <div className="w-full">
                    <Form.Item formik={formik} name="product_ids">
                      <Select
                        height={40}
                        options={menus.map((item) => ({
                          label: item?.name?.[selectedTab],
                          value: item?.id,
                        }))}
                        customOptionMulti
                        isMulti
                        onClickOption={openPopup}
                        value={values.product_ids}
                        onChange={(val) => setFieldValue("product_ids", val)}
                      />
                    </Form.Item>
                  </div>
                  <div>
                    <IconButton
                      style={{ width: "40px", height: "40px" }}
                      color="red"
                      icon={<ClearIcon />}
                    />
                  </div>
                </div>
              </div>
            </div>
          </Card>
          <Card title={t("discount")}>
            <div className="grid grid-cols-12 items-baseline">
              <span className="col-span-3 input-label">
                {t("type.variable")}
              </span>
              <div className="col-span-9">
                <Form.Item formik={formik} name="expense_type">
                  <Select
                    height={40}
                    options={[
                      { label: "Цена товара", value: "product" },
                      { label: "Цена доставки", value: "delivery" },
                    ]}
                    value={values.expense_type}
                    onChange={(val) => setFieldValue("expense_type", val)}
                  />
                </Form.Item>
              </div>
            </div>
            <div className="grid grid-cols-12 items-baseline">
              <span className="col-span-3 input-label">
                {t("discount.type")}
              </span>
              <div className="col-span-9">
                <Form.Item formik={formik} name="discount_type">
                  <Select
                    height={40}
                    options={[
                      { label: "Фиксированный", value: "fixed" },
                      { label: "Процент", value: "present" },
                    ]}
                    value={values.discount_type}
                    onChange={(val) => setFieldValue("discount_type", val)}
                  />
                </Form.Item>
              </div>
            </div>
            <div className="grid grid-cols-12 items-baseline gap-4">
              <span className="col-span-3 input-label">{t(`value`)}</span>
              <div className="col-span-9">
                <Form.Item formik={formik} name="discount_value">
                  <Input
                    type="number"
                    size="large"
                    id="discount_value"
                    onChange={handleChange}
                    value={values.discount_value}
                  />
                </Form.Item>
              </div>
            </div>
            <div className="grid grid-cols-12 items-baseline gap-4">
              <span className="col-span-3 input-label">{t("budget")}</span>
              <div className="col-span-9">
                <Form.Item formik={formik}>
                  <Input
                    type="number"
                    size="large"
                    // onChange={handleChange}
                    // value={values.discount_value}
                  />
                </Form.Item>
              </div>
            </div>
          </Card>
          <Card title={t("schedule")}>
            {weekArray.map((elm) => (
              <div
                className="grid grid-cols-12 w-full items-baseline"
                key={elm.id}
              >
                <div className="col-span-3 input-label">{t(elm.title)}</div>
                <div className="col-span-9 grid grid-cols-12 gap-x-3 items-baseline">
                  <div className="col-span-5">
                    <Form.Item formik={formik}>
                      <Input
                        size="large"
                        disabled={!elm.isChecked}
                        id="monday"
                        value={elm.value.startDate}
                        onChange={(e) =>
                          handleChangeTimes(e, elm.id, "startDate")
                        }
                        type="time"
                      />
                    </Form.Item>
                  </div>
                  <div className="col-span-5">
                    <Form.Item formik={formik}>
                      <Input
                        size="large"
                        disabled={!elm.isChecked}
                        id="monday"
                        value={elm.value.endDate}
                        onChange={(e) =>
                          handleChangeTimes(e, elm.id, "endDate")
                        }
                        type="time"
                      />
                    </Form.Item>
                  </div>
                  <input
                    onChange={changeWeekArray}
                    checked={elm.isChecked}
                    className="w-5 h-5 rounded ml-8"
                    value={elm.id}
                    type="checkbox"
                  />
                </div>
              </div>
            ))}
          </Card>
        </div>
      </form>
      <ProductModal
        open={open}
        onClose={() => {
          setOpen(false);
          setProducts([]);
        }}
        categories={categories}
        products={products}
        switchCategory={switchCategory}
        categoryId={categoryId}
        setCheckedProducts={setCheckedProducts}
        checkedProducts={checkedProducts}
        setProductsSwitch={setProductsSwitch}
        productsSwitch={productsSwitch}
      />
    </div>
  );
}
