import { useEffect, useState, useCallback } from "react";
import Card from "components/Card";
import Form from "components/Form/Index";
import { useTranslation } from "react-i18next";
import { StyledTabs, StyledTab } from "components/StyledTabs";
import SwipeableViews from "react-swipeable-views";
import { TabPanel } from "components/Tab/TabBody";
import { useTheme } from "@material-ui/core/styles";
import UzIcon from "assets/icons/Ellipse 7.png";
import RuIcon from "assets/icons/Ellipse 8.png";
import EnIcon from "assets/icons/Ellipse 9.png";
import Gallery from "components/Gallery/v2";
import Uzbek from "./tabs/Uzbek";
import English from "./tabs/English";
import Russian from "./tabs/Russian";
import BaseFields from "./BaseFields";
import { FieldArray } from "formik";
import DeleteIcon from "@material-ui/icons/Delete";
import MuiButton from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
import { makeStyles } from "@material-ui/core/styles";
import Async from "components/Select/Async";
import { getV2Goods } from "services";
import Select from "components/Select";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      width: "100%",
      border: "1px solid #ddd",
      color: "#0e73f6",
      marginBottom: "1rem",
    },
    "& > *:hover": {
      border: "1px solid #0e73f6",
      background: "#fff",
    },
    "&:first-child:last-child": {
      marginTop: "1rem",
    },
    icon: {
      color: "#0e73f6",
    },
  },
}));

export default function Combo({ formik, tags, initialValues }) {
  const { t } = useTranslation();
  const theme = useTheme();
  const classes = useStyles();

  const [value, setValue] = useState(0);
  const [products, setProducts] = useState([]);

  const { setValues, values, setFieldValue } = formik;

  const loadProducts = useCallback(async (input) => {
    var res = await getV2Goods({ limit: 10, page: 1, search: input });
    setProducts(res.products);
    var products = res.products?.map((product) => ({
      label: product.title.ru,
      value: product.id,
    }));
    return products;
  }, []);

  const loadOptions = useCallback(
    (index) => {
      var productId = values.products_and_variants[index]?.product?.value;
      var correctProduct = products.find((product) => product.id === productId);
      var selectFriendly =
        correctProduct &&
        correctProduct.variant_ids.map((variantId) => {
          return { label: variantId.title.ru, value: variantId.id };
        });
      return selectFriendly;
    },
    [products, values.products_and_variants],
  );

  useEffect(() => {
    setValues(initialValues);
  }, [initialValues, setValues]);

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
      <div className="grid grid-cols-2">
        <Card
          className="m-4 mr-2"
          title={t("combo")}
          bodyStyle={{ padding: "0 1rem" }}
        >
          <StyledTabs
            value={value}
            onChange={handleTabChange}
            centered={false}
            aria-label="full width tabs example"
            TabIndicatorProps={{ children: <span className="w-2" /> }}
            className="border-b"
          >
            <StyledTab
              label={
                <span className="flex justify-around items-center">
                  <img src={RuIcon} alt="uzb logo" width="20" height="20" />{" "}
                  {tabLabel(t("russian"))}
                </span>
              }
              {...a11yProps(0)}
              style={{ width: "150px" }}
            />
            <StyledTab
              label={
                <span className="flex justify-around items-center">
                  <img src={EnIcon} alt="uzb logo" width="20" height="20" />{" "}
                  {tabLabel(t("english"))}
                </span>
              }
              {...a11yProps(1)}
              style={{ width: "150px" }}
            />
            <StyledTab
              label={
                <span className="flex justify-around items-center">
                  <img src={UzIcon} alt="uzb logo" width="20" height="20" />{" "}
                  {tabLabel(t("uzbek"))}
                </span>
              }
              {...a11yProps(2)}
              style={{ width: "150px" }}
            />
          </StyledTabs>
          <SwipeableViews
            axis={theme.direction === "rtl" ? "x-reverse" : "x"}
            index={value}
            onChangeIndex={handleChangeIndex}
          >
            <TabPanel value={value} index={0} dir={theme.direction}>
              <BaseFields lang={<Russian />} formik={formik} tags={tags} />
            </TabPanel>
            <TabPanel value={value} index={1} dir={theme.direction}>
              <BaseFields lang={<English />} formik={formik} tags={tags} />
            </TabPanel>
            <TabPanel value={value} index={2} dir={theme.direction}>
              <BaseFields lang={<Uzbek />} formik={formik} tags={tags} />
            </TabPanel>
          </SwipeableViews>
        </Card>

        <div>
          <Card
            title={t("photo")}
            className="m-4 mr-2"
            bodyStyle={{ padding: "0 1rem" }}
          >
            <div className="grid grid-cols-12 gap-8 mb-6">
              <div className="col-span-12 mb-6">
                <Form.Item formik={formik} name="images">
                  <div className="w-full h-full flex items-center">
                    <Gallery
                      width={120}
                      height={120}
                      gallery={values.images?.length ? values.images : []}
                      setGallery={(images) => {
                        setFieldValue("images", [...images]);
                      }}
                      style={{ flexDirection: "row" }}
                      // multiple={true}
                    />
                  </div>
                </Form.Item>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <Card
        title={t("products_and_variants")}
        className="m-4 mr-2"
        bodyStyle={{ padding: "0 1rem" }}
      >
        <FieldArray name="products_and_variants">
          {({ push, remove }) => (
            <>
              {values.products_and_variants?.map((group, index) => (
                <div
                  className="flex items-baseline w-full mt-4"
                  key={`group-${index}`}
                >
                  <>
                    <div className="w-4/12 mr-4">
                      <Form.FieldArrayItem
                        formik={formik}
                        name="products_and_variants"
                        index={index}
                      >
                        <Async
                          isSearchable
                          isClearable
                          cacheOptions
                          id="products-select"
                          defaultOptions={true}
                          value={values.products_and_variants[index].product}
                          loadOptions={loadProducts}
                          onChange={(val) => {
                            setFieldValue(
                              `products_and_variants.${index}.product`,
                              val,
                            );
                            setFieldValue(
                              `products_and_variants.${index}.variants`,
                              "",
                            );
                          }}
                          placeholder={t("product")}
                        />
                      </Form.FieldArrayItem>
                    </div>

                    <div className="w-8/12">
                      <Form.FieldArrayItem
                        formik={formik}
                        name="products_and_variants"
                        index={index}
                      >
                        <Select
                          height={40}
                          isMulti
                          isSearchable
                          isClearable
                          cacheOptions
                          id="product-variants-select"
                          value={values.products_and_variants[index].variants}
                          options={loadOptions(index)}
                          onChange={(val) => {
                            setFieldValue(
                              `products_and_variants.${index}.variants`,
                              val,
                            );
                          }}
                          placeholder={t("product_variants")}
                        />
                      </Form.FieldArrayItem>
                    </div>

                    <div className="ml-4">
                      <span
                        className="cursor-pointer d-block border rounded-md p-2"
                        onClick={() => remove(index)}
                      >
                        <DeleteIcon color="error" />
                      </span>
                    </div>
                  </>
                </div>
              ))}

              <div className={classes.root}>
                <MuiButton
                  variant="outlined"
                  startIcon={<AddIcon className={classes.icon} />}
                  onClick={() => push({ product: "", variants: "" })}
                >
                  {t("add")}
                </MuiButton>
              </div>
            </>
          )}
        </FieldArray>
      </Card>
    </>
  );
}
