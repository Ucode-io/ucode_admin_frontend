import { useState, useEffect, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Formik } from "formik";
import {
  getV2ProductVariant,
  postV2ProductVariant,
  updateV2ProductVariant,
  getV2Brands,
  getV2Tags,
  getV2Measurements,
  getV2Categories,
  getV2Properties,
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
import Context from "./Context";
import formFields, { divisibility } from "./api.js";
import validate from "helpers/validateField";
import genSelectOption from "helpers/genSelectOption";

export default function ProductVariantsCreate() {
  const { t } = useTranslation();
  const history = useHistory();
  const { id } = useParams();

  const [tags, setTags] = useState([]);
  const [units, setUnits] = useState([]);
  const [brands, setBrands] = useState([]);
  const [properties, setProperties] = useState([]);
  const [categories, setCategories] = useState([]);
  const [propertyOptions, setPropertyOptions] = useState([]);
  const [initialValues, setInitialValues] = useState(formFields);
  const [btnDisabled, setBtnDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [propertyGroups, setPropertyGroups] = useState();

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      var [tags, measurements, categories, brands, properties] =
        await Promise.all([
          getV2Tags({ page: 1, limit: 10 }),
          getV2Measurements({ page: 1, limit: 10 }),
          getV2Categories({ page: 1, limit: 10 }),
          getV2Brands({ page: 1, limit: 10 }),
          getV2Properties({ page: 1, limit: 10 }),
        ]);
      tags = tags.tags?.map((tag) => ({
        label: tag.title.ru,
        value: tag.id,
      }));
      categories = categories.categories?.map((category) => ({
        label: category.title.ru,
        value: category.id,
      }));
      measurements = measurements.measurements?.map((measurement) => ({
        ...measurement,
        label: measurement.title,
        value: measurement.id,
      }));
      brands = brands.brands?.map((brand) => ({
        label: brand.title.ru,
        value: brand.id,
      }));
      setPropertyGroups(properties.property_groups);
      var _properties = properties.property_groups?.map((group) => ({
        label: group.title.ru,
        value: group.id,
      }));
      var _propertyOptions = properties.property_groups?.reduce(
        (obj, group) => {
          var options = group.options?.map((option) => ({
            label: option.title.ru,
            value: option.code,
          }));
          obj[group.id] = options;
          return obj;
        },
        {},
      );
      setTags(tags);
      setBrands(brands);
      setUnits(measurements);
      setProperties(_properties);
      setCategories(categories);
      setPropertyOptions(_propertyOptions);
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchProductData = useCallback(async () => {
    if (
      id &&
      brands.length &&
      units.length &&
      tags.length &&
      categories.length
    ) {
      var res = await getV2ProductVariant(id, {});
      var divOptions = genSelectOption(divisibility);
      var unit = units.find((unit) => unit.id === res.measurement_id.id);

      return {
        ...res,
        description_ru: res.description.ru,
        description_uz: res.description.uz,
        description_en: res.description.en,
        in_price: res.in_price,
        out_price: res.out_price,
        is_divisible: divOptions.find((option) =>
          option.value === res.is_divisible ? "divisible" : "nondivisible",
        ),
        title_ru: res.title.ru,
        title_uz: res.title.uz,
        title_en: res.title.en,
        brand: brands.find((brand) => brand.value === res.brand_id.id),
        unit,
        unit_short: { label: unit.short_name, value: unit.short_name },
        accuracy: unit.accuracy,
        tags: tags.filter((tag) =>
          res.tag_ids.filter((tag_id) => tag_id.id === tag.value),
        ),
        categories: categories.filter((category) =>
          res.category_ids.filter(
            (category_id) => category_id.id === category.value,
          ),
        ),
        category_ids: res.category_ids.map((category_id) => ({
          label: category_id.title.ru,
          value: category_id.id,
        })),
        images: [res.image, ...res.gallery],
        code: res.code,
        property_groups: res.property_groups.map((group) => ({
          property: {
            label: group.title?.ru,
            value: group.id,
          },
          property_option:
            group.type === "number" || group.type === "string"
              ? group.value
              : {
                  label: group.options[0].title.ru,
                  value: group.options[0].code,
                },
        })),
      };
    }
    return null;
  }, [id, brands, units, tags, categories]);

  const saveChanges = useCallback(
    (data) => {
      setBtnDisabled(true);
      if (id) {
        updateV2ProductVariant(id, data)
          .then(() => history.push("/home/catalog/product_variants"))
          .finally(() => setBtnDisabled(false));
      } else {
        postV2ProductVariant(data)
          .then(() => history.push("/home/catalog/product_variants"))
          .finally(() => setBtnDisabled(false));
      }
    },
    [history, id],
  );

  const onSubmit = useCallback(
    (values) => {
      var ids = values.property_groups.map((group) => group.property.value);
      var property_groups = propertyGroups?.filter((group) =>
        ids.includes(group.id),
      );

      property_groups = property_groups.map((group) => {
        var property_option = values.property_groups.find(
          (property_group) => property_group.property.value === group.id,
        ).property_option;
        if (property_option.value) {
          var option = group.options.find(
            (option) => option.code === property_option.value,
          );
        }
        return {
          ...group,
          order: group.order.toString(),
          options: group.type === "select" ? [option] : [],
          value: group.type === "select" ? "" : property_option.toString(),
        };
      });

      property_groups?.forEach((group) => delete group.is_active);
      property_groups = property_groups?.map((group) => ({
        ...group,
        order: group.order.toString(),
        is_active: true, // hardcoded
      }));

      const data = {
        description: {
          ru: values.description_ru,
          uz: values.description_uz,
          en: values.description_en,
        },
        image: values.images[0],
        gallery: values.images.slice(1, values.images.length),
        in_price: values.in_price,
        out_price: values.out_price,
        is_divisible: values.is_divisible.value === "divisible",
        title: {
          ru: values.title_ru,
          uz: values.title_uz,
          en: values.title_en,
        },
        brand_id: values.brand.value,
        category_ids: values.category_ids.map((category) => category.value),
        combo_ids: [],
        measurement_id: values.unit.value,
        rate_id: "",
        tag_ids: values.tags.map((tag) => tag.value),
        property_groups,
        code: values.code,
        price_changer_ids: [],
      };
      saveChanges(data);
    },
    [saveChanges, propertyGroups],
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
      description_ru: validate(),
      description_en: validate(),
      description_uz: validate(),
      in_price: validate("number"),
      out_price: validate("number"),
      is_divisible: validate("mixed"),
      title_ru: validate(),
      title_en: validate(),
      title_uz: validate(),
      brand: validate("selectItem"),
      unit: validate("selectItem"),
      tags: validate("array"),
      category_ids: validate("array"),
      images: validate("arrayStr"),
      property_groups: validate("multiple_select"),
      code: validate("default"),
    });
  }, []);

  const routes = [
    {
      title: <div>{t("product_variants")}</div>,
      link: true,
      route: `/home/catalog/product_variants`,
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

                <Context
                  formik={formik}
                  tags={tags}
                  categories={categories}
                  units={units}
                  brands={brands}
                  properties={properties}
                  propertyOptions={propertyOptions}
                  initialValues={initialValues}
                  propertyGroups={propertyGroups}
                />
              </form>
            )}
          </Formik>
        </>
      )}
    </>
  );
}
