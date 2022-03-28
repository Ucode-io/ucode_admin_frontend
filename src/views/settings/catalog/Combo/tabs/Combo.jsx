import { useEffect, useState } from "react";
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
import Gallery from "components/Gallery/v2";
import genSelectOption from "helpers/genSelectOption";
import Uzbek from "./Uzbek";
import English from "./English";
import Russian from "./Russian";
import BaseFields from "../BaseFields";

export default function Combo({ formik, tags, initialValues }) {
  const { t } = useTranslation();
  const theme = useTheme();
  const { setValues, values, handleChange, setFieldValue } = formik;

  const [value, setValue] = useState(0);

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
    </>
  );
}
