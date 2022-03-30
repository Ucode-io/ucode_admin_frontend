import { useState, useEffect, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Formik } from "formik";
import {
  getV2Combo,
  postV2Combo,
  updateV2Combo,
  getV2Tags,
  getV2Good,
  getV2ProductVariant,
  getV2Goods,
} from "services";
import { useParams } from "react-router-dom";
import Header from "components/Header";
import Breadcrumb from "components/Breadcrumb";
import Button from "components/Button";
import CancelIcon from "@material-ui/icons/Cancel";
import SaveIcon from "@material-ui/icons/Save";
import { useHistory } from "react-router-dom";
import FullScreenLoader from "components/FullScreenLoader";
import * as Yup from "yup";
import Combo from "./Combo";
import formFields from "./api.js";
import validate from "helpers/validateField";
import genSelectOption from "helpers/genSelectOption";

export default function ComboCreate() {
  const { t } = useTranslation();
  const history = useHistory();
  const { id } = useParams();

  const [tags, setTags] = useState([]);
  const [products, setProducts] = useState([]);
  const [initialValues, setInitialValues] = useState(formFields);
  const [btnDisabled, setBtnDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      var [tags, products] = await Promise.all([getV2Tags(), getV2Goods()]);

      tags = tags.tags?.map((tag) => ({
        label: tag.title.ru,
        value: tag.id,
      }));
      products = products.products?.map((product) => ({
        label: product.title.ru,
        value: product.id,
        variant_ids: product.variant_ids,
      }));

      setTags(tags);
      setProducts(products);
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchComboData = useCallback(async () => {
    if (id && tags.length && products.length) {
      var res = await getV2Combo(id, {});

      var products_and_variants = res.products_and_variants.map((pav) => {
        var product = products.find((product) => product.value === pav.product);
        if (product) {
          var { variant_ids, label, value } = product;

          var variants = variant_ids.filter(({ id }) => {
            return pav.variants.includes(id);
          });
          variants = variants.map((variant) => ({
            label: variant.title.ru,
            value: variant.id,
          }));

          return {
            product: { label, value },
            variants,
          };
        }
        return pav;
      });

      return {
        ...res,
        description_ru: res.description.ru,
        description_uz: res.description.uz,
        description_en: res.description.en,
        in_price: res.in_price, //
        out_price: res.out_price, //
        currency: genSelectOption(res.currency),
        title_ru: res.title.ru,
        title_uz: res.title.uz,
        title_en: res.title.en,
        tags: tags.filter((tag) =>
          res.tag_ids.filter((tag_id) => tag_id.id === tag.value),
        ),
        tag_ids: res.tag_ids.map((tag_id) => ({
          label: tag_id.title.ru,
          value: tag_id.id,
        })),
        images: [res.image, ...res.gallery],
        code: res.code, //
        products_and_variants,
      };
    }
    return null;
  }, [id, tags, products]);

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
      const data = {
        // ...values,
        shipper_id: values.shipper_id, //
        id: values.id, //
        description: {
          ru: values.description_ru,
          uz: values.description_uz,
          en: values.description_en,
        },
        image: values.images[0],
        gallery: values.images.slice(1, values.images.length),
        in_price: values.in_price, //
        out_price: values.out_price, //
        title: {
          ru: values.title_ru,
          uz: values.title_uz,
          en: values.title_en,
        },
        tag_ids: values.tag_ids.map((tag_id) => tag_id.value),
        currency: "UZS", // values.currency.value,
        code: values.code, //
        products_and_variants: values.products_and_variants.map(
          ({ product, variants }) => {
            return {
              product: product.value,
              variants: variants.map((variant) => variant.value),
            };
          },
        ),
      };
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
    fetchComboData()
      .then((data) => {
        data && setInitialValues(data);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [fetchComboData]);

  const validationSchema = useMemo(() => {
    return Yup.object().shape({
      description_ru: validate(),
      description_en: validate(),
      description_uz: validate(),
      in_price: validate("number"),
      out_price: validate("number"),
      title_ru: validate(),
      title_en: validate(),
      title_uz: validate(),
      currency: validate("selectItem"),
      tag_ids: validate("array"),
      images: validate("arrayStr"),
      code: validate("default"),
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
                <Combo
                  formik={formik}
                  tags={tags}
                  initialValues={initialValues}
                />
              </form>
            )}
          </Formik>
        </>
      )}
    </>
  );
}
