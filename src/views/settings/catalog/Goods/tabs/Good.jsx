import { useState } from "react";
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
import TextArea from "components/Textarea";
import MuiButton from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
import { makeStyles } from "@material-ui/core/styles";
import Gallery from "components/Gallery";

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
    icon: {
      color: "#0e73f6",
    },
  },
}));

export default function Good({
  formik,
  values,
  handleChange,
  setFieldValue,
  categories,
}) {
  const { t } = useTranslation();
  const classes = useStyles();
  const theme = useTheme();

  const [value, setValue] = useState(0);

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
          title={t("good")}
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
              <div className="grid grid-cols-12 gap-8 mt-4">
                <div className="col-span-12">
                  <div className="input-label">
                    <span>{t("name")}</span>
                  </div>
                  <div className="">
                    <div>
                      <Form.Item formik={formik} name="title_ru">
                        <Input
                          size="large"
                          id="title_ru"
                          value={values.title_ru}
                          onChange={handleChange}
                        />
                      </Form.Item>
                    </div>
                  </div>

                  <div className="input-label">
                    <span>{t("order.number")}</span>
                  </div>
                  <div className="">
                    <div>
                      <Form.Item formik={formik} name="order_no">
                        <Input
                          size="large"
                          id="order_no"
                          value={values.order_no}
                          onChange={handleChange}
                        />
                      </Form.Item>
                    </div>
                  </div>

                  <div className="input-label">
                    <span>{t("description")}</span>
                  </div>
                  <div className="">
                    <div>
                      <Form.Item formik={formik} name="description_ru">
                        <TextArea
                          id="description_ru"
                          {...formik.getFieldProps("description_ru")}
                        />
                      </Form.Item>
                    </div>
                  </div>

                  {/* Selects */}
                  <div className="col-span-12">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <div className="input-label">
                          <span>{t("general.category")}</span>
                        </div>
                        <div className="">
                          <div>
                            <Form.Item formik={formik} name="parent_id">
                              <Select
                                height={40}
                                id="parent_id"
                                options={categories}
                                value={values.parent_id}
                                onChange={(val) => {
                                  setFieldValue("parent_id", val);
                                }}
                              />
                            </Form.Item>
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="input-label">
                          <span>{t("general.category")}</span>
                        </div>
                        <div className="">
                          <div>
                            <Form.Item formik={formik} name="parent_id">
                              <Select
                                height={40}
                                id="parent_id"
                                options={categories}
                                value={values.parent_id}
                                onChange={(val) => {
                                  setFieldValue("parent_id", val);
                                }}
                              />
                            </Form.Item>
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="input-label">
                          <span>{t("order.number")}</span>
                        </div>
                        <div className="">
                          <div>
                            <Form.Item formik={formik} name="order_no">
                              <Input
                                size="large"
                                id="order_no"
                                value={values.order_no}
                                onChange={handleChange}
                              />
                            </Form.Item>
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="input-label">
                          <span>{t("general.category")}</span>
                        </div>
                        <div className="">
                          <div>
                            <Form.Item formik={formik} name="parent_id">
                              <Select
                                height={40}
                                id="parent_id"
                                options={categories}
                                value={values.parent_id}
                                onChange={(val) => {
                                  setFieldValue("parent_id", val);
                                }}
                              />
                            </Form.Item>
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="input-label">
                          <span>{t("general.category")}</span>
                        </div>
                        <div className="">
                          <div>
                            <Form.Item formik={formik} name="parent_id">
                              <Select
                                height={40}
                                id="parent_id"
                                options={categories}
                                value={values.parent_id}
                                onChange={(val) => {
                                  setFieldValue("parent_id", val);
                                }}
                              />
                            </Form.Item>
                          </div>
                        </div>
                      </div>

                      <div>
                        <span className="input-label">
                          {t("general.category")}
                        </span>
                        <div>
                          <Form.Item formik={formik} name="parent_id">
                            <Select
                              height={40}
                              id="parent_id"
                              options={categories}
                              value={values.parent_id}
                              onChange={(val) => {
                                setFieldValue("parent_id", val);
                              }}
                            />
                          </Form.Item>
                        </div>
                      </div>

                      <div>
                        <div className="input-label">
                          <span>{t("order.number")}</span>
                        </div>
                        <div className="">
                          <div>
                            <Form.Item formik={formik} name="order_no">
                              <Input
                                size="large"
                                id="order_no"
                                value={values.order_no}
                                onChange={handleChange}
                              />
                            </Form.Item>
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="input-label">
                          <span>{t("order.number")}</span>
                        </div>
                        <div className="">
                          <div>
                            <Form.Item formik={formik} name="order_no">
                              <Input
                                size="large"
                                id="order_no"
                                value={values.order_no}
                                onChange={handleChange}
                              />
                            </Form.Item>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabPanel>
            <TabPanel value={value} index={1} dir={theme.direction}></TabPanel>
            <TabPanel value={value} index={2} dir={theme.direction}></TabPanel>
          </SwipeableViews>
        </Card>

        <div>
          <Card
            title={t("photo")}
            className="m-4 mr-2"
            bodyStyle={{ padding: "0 1rem" }}
          >
            <div className="grid grid-cols-12 gap-8 mb-14">
              <div className="col-span-3">
                <Form.Item formik={formik} name="image">
                  <div className="w-full h-full flex mt-6 items-center flex-col">
                    <Gallery
                      width={120}
                      height={120}
                      gallery={values.image ? [values.image] : []}
                      setGallery={(elm) => setFieldValue("image", elm[0])}
                      multiple={true}
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
                  <span>{t("Gibberish")}</span>
                </div>
                <div className="">
                  <div>
                    <Form.Item formik={formik} name="parent_id">
                      <Select
                        height={40}
                        id="parent_id"
                        options={categories}
                        value={values.parent_id}
                        onChange={(val) => {
                          setFieldValue("parent_id", val);
                        }}
                      />
                    </Form.Item>
                  </div>
                </div>
              </div>
              <div className="w-6/12">
                <div className="input-label">
                  <span>{t("name")}</span>
                </div>
                <div className="">
                  <div>
                    <Form.Item formik={formik} name="title_ru">
                      <Input
                        size="large"
                        id="title_ru"
                        value={values.title_ru}
                        onChange={handleChange}
                      />
                    </Form.Item>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full">
              <div className="input-label">
                <span>{t("Gibberish")}</span>
              </div>
              <div className="">
                <div>
                  <Form.Item formik={formik} name="parent_id">
                    <Select
                      height={40}
                      id="parent_id"
                      options={categories}
                      value={values.parent_id}
                      onChange={(val) => {
                        setFieldValue("parent_id", val);
                      }}
                    />
                  </Form.Item>
                </div>
              </div>
            </div>

            <div className="w-full flex">
              <div className="w-4/12 mr-4">
                <div className="input-label">
                  <span>{t("name")}</span>
                </div>
                <div className="">
                  <div>
                    <Form.Item formik={formik} name="title_ru">
                      <Input
                        size="large"
                        id="title_ru"
                        value={values.title_ru}
                        onChange={handleChange}
                      />
                    </Form.Item>
                  </div>
                </div>
              </div>

              <div className="w-4/12 mr-4">
                <div className="input-label">
                  <span>{t("name")}</span>
                </div>
                <div className="">
                  <div>
                    <Form.Item formik={formik} name="title_ru">
                      <Input
                        size="large"
                        id="title_ru"
                        value={values.title_ru}
                        onChange={handleChange}
                      />
                    </Form.Item>
                  </div>
                </div>
              </div>

              <div className="w-4/12">
                <div className="input-label">
                  <span>{t("name")}</span>
                </div>
                <div className="">
                  <div>
                    <Form.Item formik={formik} name="title_ru">
                      <Input
                        size="large"
                        id="title_ru"
                        value={values.title_ru}
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
        title={t("prices")}
        className="m-4 mr-2"
        bodyStyle={{ padding: "0 1rem" }}
      >
        <div className="flex items-center w-full mt-4">
          <div className="w-2/12 mr-4">
            <div className="input-label">
              <span>{t("name")}</span>
            </div>
            <div className="">
              <div>
                <Form.Item formik={formik} name="title_ru">
                  <Input
                    size="large"
                    id="title_ru"
                    value={values.title_ru}
                    onChange={handleChange}
                  />
                </Form.Item>
              </div>
            </div>
          </div>

          <div className="w-1/12 mr-4">
            <div className="input-label">
              <span>{t("Gibberish")}</span>
            </div>
            <div className="">
              <div>
                <Form.Item formik={formik} name="parent_id">
                  <Select
                    height={40}
                    id="parent_id"
                    options={categories}
                    value={values.parent_id}
                    onChange={(val) => {
                      setFieldValue("parent_id", val);
                    }}
                  />
                </Form.Item>
              </div>
            </div>
          </div>

          <div className="w-1/12 mr-4">
            <div className="input-label">
              <span>{t("Gibberish")}</span>
            </div>
            <div className="">
              <div>
                <Form.Item formik={formik} name="parent_id">
                  <Select
                    height={40}
                    id="parent_id"
                    options={categories}
                    value={values.parent_id}
                    onChange={(val) => {
                      setFieldValue("parent_id", val);
                    }}
                  />
                </Form.Item>
              </div>
            </div>
          </div>

          <div className="w-4/12 mr-4">
            <div className="input-label">
              <span>{t("name")}</span>
            </div>
            <div className="">
              <div>
                <Form.Item formik={formik} name="title_ru">
                  <Input
                    size="large"
                    id="title_ru"
                    value={values.title_ru}
                    onChange={handleChange}
                  />
                </Form.Item>
              </div>
            </div>
          </div>

          <div className="w-4/12">
            <div className="input-label">
              <span>{t("name")}</span>
            </div>
            <div className="">
              <div>
                <Form.Item formik={formik} name="title_ru">
                  <Input
                    size="large"
                    id="title_ru"
                    value={values.title_ru}
                    onChange={handleChange}
                  />
                </Form.Item>
              </div>
            </div>
          </div>
        </div>

        <div className={classes.root}>
          <MuiButton
            variant="outlined"
            startIcon={<AddIcon className={classes.icon} />}
            onClick={() => {}}
          >
            {t("add")}
          </MuiButton>
        </div>
      </Card>
      <Card
        title={t("characteristics")}
        className="m-4 mr-2"
        bodyStyle={{ padding: "0 1rem" }}
      >
        <div className="flex items-center w-full mt-4">
          <div className="w-4/12 mr-4">
            <Form.Item formik={formik} name="parent_id">
              <Select
                height={40}
                id="parent_id"
                options={categories}
                value={values.parent_id}
                onChange={(val) => {
                  setFieldValue("parent_id", val);
                }}
              />
            </Form.Item>
          </div>
          <div className="w-8/12">
            <Form.Item formik={formik} name="order_no">
              <Input
                size="large"
                id="order_no"
                value={values.order_no}
                onChange={handleChange}
              />
            </Form.Item>
          </div>
        </div>

        <div className={classes.root}>
          <MuiButton
            variant="outlined"
            startIcon={<AddIcon className={classes.icon} />}
            onClick={() => {}}
          >
            {t("add")}
          </MuiButton>
        </div>
      </Card>
    </>
  );
}
