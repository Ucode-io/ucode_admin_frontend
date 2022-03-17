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
import TextArea from "components/Textarea";
import Gallery from "components/Gallery";

export default function GeneralInformation({
                                               formik,
                                               values,
                                               handleChange,
                                               setFieldValue,
                                           }) {
    const { t } = useTranslation();
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
        <div className="grid">
            <Card
                className="m-4 mr-2"
                title={t("general.settings")}
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
                        <div className="grid grid-cols-12 mb-14">
                            <div className="col-span-3">
                                <Form.Item formik={formik} name="image">
                                    <div className="flex m-6 flex-col">
                                        <Gallery
                                            width={160}
                                            height={160}
                                            gallery={values.image ? [values.image] : []}
                                            setGallery={(elm) => setFieldValue("image", elm[0])}
                                            multiple={false}
                                        />
                                        {
                                            <span className="mt-2 text-primary text-base">
                      </span>
                                        }
                                    </div>
                                </Form.Item>
                            </div>

                            <div className="col-span-9">
                                <div className="w-full flex justify-between items-baseline pt-4">
                                    <div className="w-1/4 input-label">
                                        <span>{t("name")}</span>
                                    </div>
                                    <div className="w-3/4">
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

                                <div className="grid grid-cols-12 gap-4 items-baseline">
                                      <span className="col-span-3 input-label">
                                        {t(`start.time`)}
                                      </span>
                                    <div className="col-span-4">
                                        <Form.Item formik={formik} name="start_date">
                                            <Input
                                                type="date"
                                                max="9999-12-31"
                                                size="large"
                                                id="start_date"
                                                value={values.start_date}
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
                                                max="9999-12-31"
                                                value={values.end_date}
                                                onChange={handleChange}
                                            />
                                        </Form.Item>
                                    </div>
                                </div>

                                <div className="w-full flex justify-between items-baseline">
                                    <div className="w-1/4 input-label">
                                        <span>{t("description")}</span>
                                    </div>
                                    <div className="w-3/4">
                                        <div>
                                            <Form.Item formik={formik} name="description_ru">
                                                <TextArea
                                                    id="description_ru"
                                                    {...formik.getFieldProps("description_ru")}
                                                />
                                            </Form.Item>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TabPanel>
                    <TabPanel value={value} index={1} dir={theme.direction}>
                        <div className="grid grid-cols-12 mb-14">
                            <div className="col-span-3">
                                <Form.Item formik={formik} name="image">
                                    <div className="flex m-6 flex-col">
                                        <Gallery
                                            width={160}
                                            height={160}
                                            gallery={values.image ? [values.image] : []}
                                            setGallery={(elm) => setFieldValue("image", elm[0])}
                                            multiple={false}
                                        />
                                        {
                                            <span className="mt-2 text-primary text-base">
                        {/* {values.image ? t("change.photo") : t("product.image")} */}
                      </span>
                                        }
                                    </div>
                                </Form.Item>
                            </div>

                            <div className="col-span-9">
                                <div className="w-full flex justify-between items-baseline pt-4">
                                    <div className="w-1/4 input-label">
                                        <span>{t("name")}</span>
                                    </div>
                                    <div className="w-3/4">
                                        <div>
                                            <Form.Item formik={formik} name="title_en">
                                                <Input
                                                    size="large"
                                                    id="title_en"
                                                    value={values.title_en}
                                                    onChange={handleChange}
                                                />
                                            </Form.Item>
                                        </div>
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
                                                max="9999-12-31"
                                                size="large"
                                                id="start_date"
                                                value={values.start_date}
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
                                                max="9999-12-31"
                                                value={values.end_date}
                                                onChange={handleChange}
                                            />
                                        </Form.Item>
                                    </div>
                                </div>

                                <div className="w-full flex justify-between items-baseline">
                                    <div className="w-1/4 input-label">
                                        <span>{t("description")}</span>
                                    </div>
                                    <div className="w-3/4">
                                        <div>
                                            <Form.Item formik={formik} name="description_en">
                                                <TextArea
                                                    id="description_en"
                                                    {...formik.getFieldProps("description_en")}
                                                />
                                            </Form.Item>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TabPanel>
                    <TabPanel value={value} index={2} dir={theme.direction}>
                        <div className="grid grid-cols-12 mb-14">
                            <div className="col-span-3">
                                <Form.Item formik={formik} name="image">
                                    <div className="flex m-6 flex-col">
                                        <Gallery
                                            width={160}
                                            height={160}
                                            gallery={values.image ? [values.image] : []}
                                            setGallery={(elm) => setFieldValue("image", elm[0])}
                                            multiple={false}
                                        />
                                        {
                                            <span className="mt-2 text-primary text-base">
                        {/* {values.image ? t("change.photo") : t("product.image")} */}
                      </span>
                                        }
                                    </div>
                                </Form.Item>
                            </div>

                            <div className="col-span-9">
                                <div className="w-full flex justify-between items-baseline pt-4">
                                    <div className="w-1/4 input-label">
                                        <span>{t("name")}</span>
                                    </div>
                                    <div className="w-3/4">
                                        <div>
                                            <Form.Item formik={formik} name="title_uz">
                                                <Input
                                                    size="large"
                                                    id="title_uz"
                                                    value={values.title_uz}
                                                    onChange={handleChange}
                                                />
                                            </Form.Item>
                                        </div>
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
                                                max="9999-12-31"
                                                size="large"
                                                id="start_date"
                                                value={values.start_date}
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
                                                max="9999-12-31"
                                                value={values.end_date}
                                                onChange={handleChange}
                                            />
                                        </Form.Item>
                                    </div>
                                </div>

                                <div className="w-full flex justify-between items-baseline">
                                    <div className="w-1/4 input-label">
                                        <span>{t("description")}</span>
                                    </div>
                                    <div className="w-3/4">
                                        <div>
                                            <Form.Item formik={formik} name="description_uz">
                                                <TextArea
                                                    id="description_uz"
                                                    {...formik.getFieldProps("description_uz")}
                                                />
                                            </Form.Item>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TabPanel>
                </SwipeableViews>
            </Card>
        </div>
    );
}
