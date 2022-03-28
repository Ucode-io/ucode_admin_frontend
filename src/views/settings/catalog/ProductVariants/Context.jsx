import { useEffect, useState, useCallback } from "react";
import Card from "components/Card";
import Form from "components/Form/Index";
import { Input } from "alisa-ui";
import { useTranslation } from "react-i18next";
import { StyledTabs, StyledTab } from "components/StyledTabs";
import SwipeableViews from "react-swipeable-views";
import { TabPanel } from "components/Tab/TabBody";
import { useTheme } from "@material-ui/core/styles";
import UzIcon from "assets/icons/Ellipse 7.png";
import RuIcon from "assets/icons/Ellipse 8.png";
import EnIcon from "assets/icons/Ellipse 9.png";
import Select from "components/Select";
import MuiButton from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
import { makeStyles } from "@material-ui/core/styles";
import Gallery from "components/Gallery/v2";
import genSelectOption from "helpers/genSelectOption";
import Uzbek from "./Uzbek";
import English from "./English";
import Russian from "./Russian";
import { FieldArray } from "formik";
import DeleteIcon from "@material-ui/icons/Delete";
import BaseFields from "./BaseFields";

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

export default function Context({
  formik,
  categories,
  tags,
  units,
  brands,
  properties,
  propertyOptions,
  initialValues,
  propertyGroups,
}) {
  const { t } = useTranslation();
  const classes = useStyles();
  const theme = useTheme();
  const { setValues, values, handleChange, setFieldValue } = formik;

  const [value, setValue] = useState(0);

  const getInputType = useCallback(
    (index) => {
      // console.log(values, values?.property_groups[index]?.property?.value);
      return propertyGroups?.find(
        (group) =>
          group?.id === values?.property_groups[index]?.property?.value,
      )?.type === "string"
        ? "text"
        : "number";
    },
    [propertyGroups, values?.property_groups],
  );

  const fieldIsSelect = useCallback(
    (index) => {
      return (
        propertyGroups?.find(
          (group) =>
            group?.id === values?.property_groups[index]?.property?.value,
        )?.type === "select"
      );
    },
    [propertyGroups, values?.property_groups],
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
          title={t("product_variant")}
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
              <BaseFields
                lang={<Russian />}
                formik={formik}
                categories={categories}
                tags={tags}
                units={units}
                brands={brands}
              />
            </TabPanel>
            <TabPanel value={value} index={1} dir={theme.direction}>
              <BaseFields
                lang={<English />}
                formik={formik}
                categories={categories}
                tags={tags}
                units={units}
                brands={brands}
              />
            </TabPanel>
            <TabPanel value={value} index={2} dir={theme.direction}>
              <BaseFields
                lang={<Uzbek />}
                formik={formik}
                categories={categories}
                tags={tags}
                units={units}
                brands={brands}
              />
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
                      gallery={values.images?.length ? [...values.images] : []}
                      setGallery={(elm) => {
                        setFieldValue("images", [
                          ...values.images,
                          elm[elm.length - 1],
                        ]);
                      }}
                      style={{ flexDirection: "row" }}
                      // multiple={true}
                    />
                  </div>
                </Form.Item>
              </div>
            </div>
          </Card>
          <Card
            title={t("dimension")}
            className="m-4 mr-2"
            bodyStyle={{ padding: "0 1rem" }}
          >
            <div className="flex items-center w-full mt-4">
              <div className="w-6/12 mr-4">
                <div className="input-label">
                  <span>{t("dimension.type")}</span>
                </div>
                <div className="">
                  <div>
                    <Form.Item formik={formik} name="unit_short">
                      <Select
                        disabled
                        height={40}
                        id="unit_short"
                        options={genSelectOption("")}
                        value={values.unit_short}
                        onChange={(val) => {
                          setFieldValue("unit_short", val);
                        }}
                      />
                    </Form.Item>
                  </div>
                </div>
              </div>
              <div className="w-6/12">
                <div className="input-label">
                  <span>{t("number")}</span>
                </div>
                <div className="">
                  <div>
                    <Form.Item formik={formik} name="accuracy">
                      <Input
                        disabled
                        size="large"
                        id="accuracy"
                        value={values.accuracy}
                        onChange={handleChange}
                      />
                    </Form.Item>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
      <Card
        title={t("characteristics")}
        className="m-4 mr-2"
        bodyStyle={{ padding: "0 1rem" }}
      >
        <FieldArray name="property_groups">
          {({ push, remove }) => (
            <>
              {values.property_groups?.map((group, index) => (
                <div
                  className="flex items-baseline w-full mt-4"
                  key={`group-${index}`}
                >
                  <>
                    <div className="w-4/12 mr-4">
                      <Form.FieldArrayItem
                        formik={formik}
                        name="property_groups"
                        index={index}
                      >
                        <Select
                          height={40}
                          id={`property_groups.${index}.property`}
                          options={properties}
                          value={values.property_groups[index].property}
                          onChange={(val) => {
                            setFieldValue(
                              `property_groups.${index}.property`,
                              val,
                            );
                            setFieldValue(
                              `property_groups.${index}.property_option`,
                              "",
                            );
                          }}
                        />
                      </Form.FieldArrayItem>
                    </div>

                    <div className="w-8/12">
                      <Form.FieldArrayItem
                        formik={formik}
                        name="property_groups"
                        index={index}
                      >
                        {fieldIsSelect(index) ? (
                          <Select
                            height={40}
                            id={`property_groups.${index}.property_option`}
                            options={
                              values.property_groups[index].property &&
                              propertyOptions[
                                values.property_groups[index].property.value
                              ]
                            }
                            value={
                              values.property_groups[index].property_option
                            }
                            onChange={(val) => {
                              setFieldValue(
                                `property_groups.${index}.property_option`,
                                val,
                              );
                            }}
                          />
                        ) : (
                          <Input
                            id={`property_groups.${index}.property_option`}
                            type={getInputType(index)}
                            size="large"
                            value={
                              values?.property_groups[index]?.property_option
                            }
                            onChange={handleChange}
                          />
                        )}
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
                  onClick={() => push({ property: "", property_option: "" })}
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
