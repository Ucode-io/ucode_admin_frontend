import { useState, useEffect, useCallback, useReducer } from "react";
import { useTranslation } from "react-i18next";
import { Formik } from "formik";
import {
  getV2Good,
  postV2Good,
  updateV2Good,
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
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { showAlert } from "redux/actions/alertActions";
import FullScreenLoader from "components/FullScreenLoader";
import * as Yup from "yup";
import Filters from "components/Filters";
import { StyledTabs, StyledTab } from "components/StyledTabs";
import SwipeableViews from "react-swipeable-views";
import { TabPanel } from "components/Tab/TabBody";
import { useTheme } from "@material-ui/core/styles";
import Good from "./tabs/Good";
import ConnectedGoods from "./tabs/ConnectedGoods";
import formFields, { divisibility } from "./api.js";
import validate from "helpers/validateField";
import genSelectOption from "helpers/genSelectOption";

// var selectsReducer = function (state, { type, payload }) {
//   switch (type) {
//     case "Update":
//       return { ...state, ...payload };
//     default:
//       return { ...state };
//   }
// };

// var initialState = {};

export default function GoodsCreate() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const history = useHistory();
  const { id } = useParams();
  const theme = useTheme();

  // const [selects, dispatchSelects] = useReducer(selectsReducer, initialState);
  const [tags, setTags] = useState([]);
  const [units, setUnits] = useState([]);
  const [brands, setBrands] = useState([]);
  const [properties, setProperties] = useState([]);
  const [categories, setCategories] = useState([]);
  const [propertyOptions, setPropertyOptions] = useState([]);
  const [initialValues, setInitialValues] = useState(id ? {} : formFields);
  const [btnDisabled, setBtnDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [value, setValue] = useState(0);
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
      tags = tags.tags.map((tag) => ({
        label: tag.title.ru,
        value: tag.id,
      }));
      categories = categories.categories.map((category) => ({
        label: category.title.ru,
        value: category.id,
      }));
      measurements = measurements.measurements.map((measurement) => ({
        ...measurement,
        label: measurement.title,
        value: measurement.id,
      }));
      brands = brands.brands?.map((brand) => ({
        label: brand.title.ru,
        value: brand.id,
      }));
      setPropertyGroups(properties.property_groups);
      var _properties = properties.property_groups.map((group) => ({
        label: group.title.ru,
        value: group.id,
      }));
      var _propertyOptions = properties.property_groups.reduce((obj, group) => {
        var options = group.options?.map((option) => ({
          label: option.title.ru,
          value: option.code,
        }));
        obj[group.id] = options;
        return obj;
      }, {});
      // dispatchSelects({
      //   type: "Update",
      //   payload: {
      //     tags,
      //     brands,
      //     measurements,
      //     _properties,
      //     categories,
      //     _propertyOptions,
      //   },
      // });
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
    let res = await getV2Good(id, {});
    var divOptions = genSelectOption(divisibility);
    return {
      description_ru: res.description.ru,
      description_uz: res.description.uz,
      description_en: res.description.en,
      in_price: res.in_price,
      out_price: res.out_price,
      is_divisible: divOptions.find((option) =>
        option.value == res.is_divisible ? "divisible" : "nondivisible",
      ),
      title_ru: res.title.ru,
      title_uz: res.title.uz,
      title_en: res.title.en,
      brand: brands.find((brand) => brand.value == res.brand_id.id),
      unit: units.find((unit) => unit.value == res.measurement_id.id),
      tags: tags.filter((tag) =>
        res.tag_ids.filter((tag_id) => tag_id.id == tag.value),
      ),
      categories: categories.filter((category) =>
        res.category_ids.filter(
          (category_id) => category_id.id == category.value,
        ),
      ),
      images: [res.image, ...res.gallery],
      code: res.code,
      currency: genSelectOption(res.currency),
    };
  }, [id, brands, units, tags, categories]);

  const saveChanges = (data) => {
    setBtnDisabled(true);
    if (id) {
      updateV2Good(id, data)
        .catch((err) =>
          dispatch(showAlert(t(err?.data?.Error?.Message ?? err?.data?.Error))),
        )
        .then(() => history.push("/home/catalog/goods"))
        .finally(() => setBtnDisabled(false));
    } else {
      postV2Good(data)
        .catch((err) =>
          dispatch(showAlert(t(err.data?.Error?.Message ?? err?.data?.Error))),
        )
        .then(() => history.push("/home/catalog/goods"))
        .finally(() => setBtnDisabled(false));
    }
  };

  const onSubmit = (values) => {
    console.log(propertyGroups, values.property_groups);
    var ids = values.property_groups.map((group) => group.property.value);
    var options = values.property_groups.map(
      (group) => group.property_option.value,
    );
    var property_groups = propertyGroups.filter((group) =>
      ids.includes(group.id),
    );
    property_groups = property_groups.map((group, i) => ({
      ...group,
      options: property_groups[i].options.filter((option) =>
        options.includes(option),
      ),
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
      is_divisible: values.is_divisible.value,
      title: {
        ru: values.title_ru,
        uz: values.title_uz,
        en: values.title_en,
      },
      brand_id: values.brand.value,
      category_ids: values.categories.map((category) => category.value),
      combo_ids: [],
      favorite_ids: [],
      measurement_id: values.unit.value,
      rate_id: "",
      tag_ids: values.tags.map((tag) => tag.value),
      variant_ids: [],
      property_groups,
      currency: values.currency.value,
      code: values.code,
    };
    saveChanges(data);
  };

  useEffect(() => {
    setIsLoading(true);
    fetchData().finally(() => {
      setIsLoading(false);
    });
  }, [fetchData]);

  useEffect(() => {
    setIsLoading(true);
    if (id) {
      fetchProductData()
        .then((data) => setInitialValues(data))
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [fetchProductData, id]);

  const validationSchema = Yup.object().shape({
    description_ru: validate(),
    description_uz: validate(),
    description_en: validate(),
    in_price: validate("number"),
    out_price: validate("number"),
    is_divisible: validate("mixed"),
    title_ru: validate(),
    title_uz: validate(),
    title_en: validate(),
    brand: validate("selectItem"),
    unit: validate("selectItem"),
    currency: validate("selectItem"),
    tags: validate("array"),
    categories: validate("array"),
    images: validate("arrayStr"),
    property_groups: validate("multiple_select"),
    code: validate("default"),
  });

  const routes = [
    {
      title: <div>{t("goods")}</div>,
      link: true,
      route: `/home/catalog/goods`,
    },
    {
      title: id ? initialValues?.title?.ru : t("create"),
    },
  ];

  // Tabs
  const a11yProps = (index) => {
    return {
      id: `full-width-tab-${index}`,
      "aria-controls": `full-width-tabpanel-${index}`,
    };
  };

  const handleTabChange = (event, newValue) => setValue(newValue);

  const handleChangeIndex = (index) => setValue(index);

  const tabLabel = (text, isActive = false) => (
    <span className="px-1">{text}</span>
  );

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
                <Filters>
                  <StyledTabs
                    value={value}
                    onChange={handleTabChange}
                    centered={false}
                    aria-label="full width tabs example"
                    TabIndicatorProps={{ children: <span className="w-2" /> }}
                  >
                    <StyledTab
                      label={tabLabel(t("good"))}
                      {...a11yProps(0)}
                      style={{ width: "75px" }}
                    />
                    <StyledTab
                      label={tabLabel(t("connected_goods"))}
                      {...a11yProps(1)}
                      style={{ width: "175px" }}
                    />
                  </StyledTabs>
                </Filters>
                <SwipeableViews
                  axis={theme.direction === "rtl" ? "x-reverse" : "x"}
                  index={value}
                  onChangeIndex={handleChangeIndex}
                >
                  <TabPanel value={value} index={0} dir={theme.direction}>
                    <Good
                      formik={formik}
                      handleChange={formik.handleChange}
                      values={formik.values}
                      setFieldValue={formik.setFieldValue}
                      tags={tags}
                      categories={categories}
                      units={units}
                      brands={brands}
                      properties={properties}
                      propertyOptions={propertyOptions}
                      initialValues={initialValues}
                    />
                  </TabPanel>
                  <TabPanel value={value} index={1} dir={theme.direction}>
                    <ConnectedGoods />
                  </TabPanel>
                </SwipeableViews>
              </form>
            )}
          </Formik>
        </>
      )}
    </>
  );
}
