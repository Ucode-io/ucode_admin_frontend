import React, { useState, useMemo, useEffect } from "react";
import { useSelector } from "react-redux";
import Card from "components/Card";
import Form from "components/Form/Index";
import { useTranslation } from "react-i18next";
import { Input } from "alisa-ui";
import { Close, Add } from "@material-ui/icons";
import IconButton from "components/Button/IconButton";
import Modal from "components/Modal";
import { useFormik } from "formik";
// import * as yup from "yup";
import Select from "components/Select";
import TextArea from "components/Textarea";
import Button from "components/Button";
import { getProducts, getOneProduct } from "services";
import { RadioGroup, Radio } from "components/Radio";
import MonetizationOnIcon from "@material-ui/icons/MonetizationOn";
import DriveEtaIcon from "@material-ui/icons/DriveEta";
import FunctionsIcon from "@material-ui/icons/Functions";
import cashIcon from "../../../assets/icons/cash.png";
import paymeIcon from "../../../assets/icons/image 4.png";
import clickIcon from "../../../assets/icons/image 5.png";
import bankIcon from "../../../assets/icons/image 7.png";
import numberToPrice from "../../../helpers/numberToPrice";

export default function ProductContent({
  formik,
  shipperId,
  selectedProducts,
  setSelectedProducts,
  deliveryPrice,
  productRef,
}) {
  const { t } = useTranslation();
  const lang = useSelector((state) => state.lang.current);

  const [modal, setModal] = useState(null);
  const [products, setProducts] = useState([]);
  const [options, setOptions] = useState([]);
  const [ingredients, setIngredients] = useState([]);

  const modalFormik = useFormik({
    initialValues: {
      product: null,
      option: null,
      ingredient: null,
      child_option: 0,
      count: 1,
    },
    // validationSchema: yup.object().shape({
    //   name: {}
    // }),
    onSubmit,
  });

  const { values, handleChange, setFieldValue } = modalFormik;

  useEffect(() => {
    const menu_id = formik?.values?.branch?.elm?.menu_id;
    if (menu_id) {
      getProducts({ limit: 1000, menu_id })
        .then((res) =>
          setProducts(
            res.products
              ? res.products.map((elm) => ({
                  label: elm.name[lang],
                  value: elm,
                }))
              : [],
          ),
        )
        .catch((err) => console.log(err));
    }
  }, [formik?.values?.branch?.elm?.menu_id]);

  useEffect(() => {
    if (shipperId && values.product?.value?.id) {
      setFieldValue("option", null);
      setFieldValue("ingredient", null);

      getOneProduct(values.product.value.id, {}, shipperId)
        .then((res) => {
          if (res.options && res.options.length) {
            let isNotRequired = [];
            let options = res.options.map((elm) => ({
              ...elm,
              child_options: elm.child_options.length
                ? elm.child_options.filter((el) => {
                    if (!el.is_required) {
                      isNotRequired.push(el);
                      // setIngredients(prev => [...prev, el])
                      return false;
                    }
                    return true;
                  })
                : [],
            }));
            setOptions(options);
            setIngredients(isNotRequired);

            setFieldValue("option", {
              label: `${options[0].name[lang]} (${options[0].price})`,
              value: options[0],
            });
            setFieldValue("child_option", options[0].child_options[0]);
          } else {
            setOptions([]);
            setIngredients([]);
          }
        })
        .catch((err) => console.log(err));
    }
  }, [values.product]);

  const totalPrice = useMemo(() => {
    const productPrice = values.product?.value?.price ?? 0;
    const optionPrice = values.option?.value?.price ?? 0;
    const optionChildPrice = values.child_option
      ? values.child_option.price
      : 0;
    const ingredientsPrice = values.ingredient
      ? values.ingredient.reduce((pre, cur) => pre + cur.value.price, 0)
      : 0;

    return (
      (productPrice + optionPrice + optionChildPrice + ingredientsPrice) *
      values.count
    );
  }, [
    values.product,
    values.option,
    values.child_option,
    values.ingredient,
    values.count,
  ]);

  const generalPrice = useMemo(() => {
    return selectedProducts.reduce(
      (pre, cur) =>
        pre +
        (cur.price +
          (cur.optionPrice || 0) +
          (cur.optionChildPrice || 0) +
          (cur.ingredientsPrice || 0)) *
          cur.quantity,
      0,
    );
  }, [selectedProducts]);

  function onSubmit(values) {
    try {
      const { name, description, id } = values.product.value;
      const { child_options, ...options } = values.option?.value ?? {};
      const optionValue =
        child_options?.find((item) => item.id === values.child_option.id) ?? {};

      setSelectedProducts((prev) => [
        ...prev,
        {
          name,
          description,
          product_id: id,
          price: values.product?.value?.price,
          quantity: values.count,
          optionPrice:
            values.option && values.option.value.price
              ? values.option.value.price
              : 0,
          ingredientsPrice: values.ingredient
            ? values.ingredient.reduce((total, item) => {
                return total + item.value.price;
              }, 0)
            : 0,
          optionChildPrice: values.child_option ? values.child_option.price : 0,
          option: values.option?.value
            ? {
                ...options,
                child_options: [
                  optionValue,
                  ...(values?.ingredient
                    ? values?.ingredient?.map((elm) => elm.value)
                    : []),
                ],
              }
            : {},
        },
      ]);
      setModal(null);
    } catch (e) {
      console.log(e);
    }
  }

  const handleRemoveProduct = (index) => {
    setSelectedProducts((prev) => prev.filter((elm, i) => index !== i));
  };

  const handleChangeQuantity = (index, val) => {
    setSelectedProducts((prev) =>
      prev.map((elm, i) => (index === i ? { ...elm, quantity: val } : elm)),
    );
  };

  const cardFooter = (
    <div className="grid grid-cols-2 my-3">
      <div style={{ paddingRight: 26 }}>
        <div className="w-full flex items-start">
          <div className="w-3/12 input-label">
            <span>{t("payment.types")}</span>
          </div>
          <div className="w-9/12">
            <Form.Item formik={formik} name="name">
              <div className="flex gap-2">
                <div className="w-3/12 h-10 border bg-blue-200 cursor-pointer border-bordercolor rounded-md py-2 flex justify-center">
                  <img src={cashIcon} alt="click image" className="h-6" />
                </div>
                <div className="w-3/12 h-10 border bg-gray-50 hover:bg-blue-50 cursor-pointer border-bordercolor rounded-md py-2 flex justify-center">
                  <img src={paymeIcon} alt="click image" className="h-6" />
                </div>
                <div className="w-3/12 h-10 border bg-gray-50 hover:bg-blue-50 cursor-pointer border-bordercolor rounded-md py-2 flex justify-center">
                  <img src={clickIcon} alt="click image" className="h-5" />
                </div>
                <div className="w-3/12 h-10 border bg-gray-50 hover:bg-blue-50 cursor-pointer border-bordercolor rounded-md py-2 flex justify-center">
                  <img src={bankIcon} alt="click image" className="h-6" />
                </div>
              </div>
            </Form.Item>
          </div>
        </div>
        <div className="flex">
          <div className="w-1/3 input-label">
            <span>Курьер</span>
          </div>
          <div className="w-2/3">
            <Form.Item formik={formik}>
              <Select id="courier" placeholder="Курьер" />
            </Form.Item>
          </div>
        </div>
      </div>
      <div className="border-l-2" style={{ paddingLeft: 26 }}>
        <div className="w-full grid grid-cols-2 gap-4">
          <div className="flex gap-3" style={{ color: "#84919A" }}>
            <MonetizationOnIcon className="text-primary" />
            Сумма заказа
          </div>
          <div className="input-label font-medium">
            {numberToPrice(generalPrice, "сум")}
          </div>

          <div className="flex gap-3" style={{ color: "#84919A" }}>
            <DriveEtaIcon className="text-primary" />
            Сумма доставки
          </div>
          <div className="input-label font-medium">
            {numberToPrice(deliveryPrice, "сум")}
          </div>
        </div>
        <div className="h-0.5 w-full bg-bordercolor my-3"></div>
        <div className="w-full grid grid-cols-2 gap-4">
          <div className="flex gap-3 text-black-1 text-base">
            <FunctionsIcon className="text-primary" />
            Итого
          </div>
          <div className="text-black font-medium">
            {numberToPrice(generalPrice + deliveryPrice, "сум")}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Card title={t("products")} footer={cardFooter} headerClass="py-3">
      {selectedProducts.map((elm, i) => (
        <div className="flex justify-between items-end gap-4 mb-4">
          <div className="flex gap-4">
            <div>
              <span className="input-label mb-1">{t("name")}</span>
              <Input value={elm?.name[lang]} disabled />
            </div>

            {elm.option?.name ? (
              <div>
                <span className="input-label mb-1">{t("option")}</span>
                <Input value={elm.option?.name?.[lang]} disabled />
              </div>
            ) : (
              <></>
            )}

            {elm.option?.child_options && elm.option?.child_options?.length ? (
              <div>
                <span className="input-label mb-1">
                  {t("additional.option")}
                </span>
                <Input
                  value={elm.option?.child_options[0]?.name?.[lang]}
                  disabled
                />
              </div>
            ) : (
              <></>
            )}
          </div>

          <div className="flex gap-4">
            <div>
              <span className="input-label mb-1">{t("price")}</span>
              <Input
                type="number"
                value={
                  elm.price +
                  (elm.optionPrice || 0) +
                  (elm.optionChildPrice || 0) +
                  (elm.ingredientsPrice || 0)
                }
                suffix="sum"
                width={182}
                disabled
              />
            </div>
            <div>
              <Close className="text-primary mt-7" />
            </div>
            <div>
              <span className="input-label mb-1">{t("amount")}</span>
              <Input
                type="number"
                min={"1"}
                value={elm.quantity}
                width={182}
                onChange={(e) =>
                  e.target.value >= 0 && handleChangeQuantity(i, e.target.value)
                }
              />
            </div>
            <div>
              <div className="text-primary mt-5 text-3xl">=</div>
            </div>
            <div>
              <span className="input-label mb-1">{t("total.cost")}</span>
              <Input
                type="number"
                value={
                  (elm.price +
                    (elm.optionPrice || 0) +
                    (elm.optionChildPrice || 0) +
                    (elm.ingredientsPrice || 0)) *
                  elm.quantity
                }
                suffix="sum"
                width={182}
                disabled
              />
            </div>
            <div>
              <span className="input-label mb-1">{t("description")}</span>
              <Input type="text" placeholder={t("description")} width={182} />
            </div>
            <IconButton
              icon={<Close />}
              color="red"
              onClick={() => handleRemoveProduct(i)}
              className="self-end"
            />
          </div>
        </div>
      ))}
      <div
        className="mt-4 cursor-pointer border border-dashed border-blue-800 text-secondary text-sm bg-gray-200 p-2 rounded-md flex justify-center items-center gap-2.5"
        onClick={() => setModal(true)}
        ref={productRef}
      >
        <Add />
        <div className="text-black-1">Добавить продукт</div>
      </div>

      <Modal
        width={400}
        open={modal}
        title={t("add.new.product")}
        footer={null}
        onClose={() => setModal(null)}
        isWarning={false}
      >
        <form onSubmit={modalFormik.handleSubmit}>
          <Form.Item
            name="product"
            formik={modalFormik}
            label={t("product.name")}
          >
            <Select
              options={products}
              value={values.product}
              onChange={(val) => setFieldValue("product", val)}
            />
          </Form.Item>

          {options.length ? (
            <Form.Item name="option" formik={modalFormik} label={t("option")}>
              <Select
                value={values.option}
                onChange={(val) => setFieldValue("option", val)}
                options={options.map((elm) => ({
                  label: `${elm.name[lang]} (${elm.price})`,
                  value: elm,
                }))}
              />
              <RadioGroup
                className="mt-3"
                onChange={(val) => {
                  setFieldValue("child_option", val);
                }}
              >
                {values.option?.value?.child_options?.map((elm, i) => (
                  <Radio
                    value={elm}
                    checked={values.child_option.id === elm.id}
                  >
                    {elm.name[lang]} ({elm.price})
                  </Radio>
                ))}
              </RadioGroup>
            </Form.Item>
          ) : (
            <></>
          )}

          {ingredients.length ? (
            <Form.Item
              name="ingredient"
              formik={modalFormik}
              label={t("ingredients")}
            >
              <Select
                isMulti
                value={values.ingredient}
                onChange={(val) => setFieldValue("ingredient", val)}
                options={ingredients
                  .filter(
                    (item) =>
                      values.option &&
                      item.parent_id === values.option.value.id,
                  )
                  .map((elm) => ({
                    label: `${elm.name[lang]} (${elm.price})`,
                    value: elm,
                  }))}
              />
            </Form.Item>
          ) : (
            <></>
          )}

          <Form.Item name="count" formik={modalFormik} label={t("amount")}>
            <Input
              id="count"
              value={values.count}
              onChange={handleChange}
              type="number"
            />
          </Form.Item>

          <Form.Item
            name="description"
            formik={modalFormik}
            label={t("description")}
          >
            <TextArea
              id="description"
              size={2}
              value={values.description}
              onChange={handleChange}
            />
          </Form.Item>
          <Form.Item formik={modalFormik} label={t("total.cost")}>
            <Input type="number" disabled={true} value={totalPrice} />
          </Form.Item>
          <div className="flex justify-end gap-3 items-center">
            <Button
              shape="outlined"
              borderColor="bordercolor"
              size="small"
              color="gray"
              onClick={() => setModal(null)}
            >
              {t("cancel")}
            </Button>
            <Button size="small" type="submit">
              {t("save")}
            </Button>
          </div>
        </form>
      </Modal>
    </Card>
  );
}
