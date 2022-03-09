import { useMemo, useState, useEffect } from "react";
import Card from "components/Card";
import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router-dom";
import { Input } from "alisa-ui";
import Form from "components/Form/Index";
import * as yup from "yup";
import { useFormik } from "formik";
import Header from "components/Header";
import Button from "components/Button";
import Breadcrumb from "components/Breadcrumb";
import CancelIcon from "@material-ui/icons/Cancel";
import SaveIcon from "@material-ui/icons/Save";
import { getV2Tag, postV2Tag, updateV2Tag } from "services";
import Select from "components/Select";
import { colors } from "constants/tags";
import SwipeableViews from "react-swipeable-views";
import Filters from "components/Filters";
import { StyledTabs, StyledTab } from "components/StyledTabs";
import { TabPanel } from "components/Tab/TabBody";
import { useTheme } from "@material-ui/core/styles";
import UzIcon from "assets/icons/Ellipse 7.png";
import RuIcon from "assets/icons/Ellipse 8.png";
import EnIcon from "assets/icons/Ellipse 9.png";
import genSelectOption from "helpers/genSelectOption";
import CustomSkeleton from "components/Skeleton";

export default function TagsCreate() {
  const { t } = useTranslation();
  const history = useHistory();
  const params = useParams();
  const theme = useTheme();

  const [isLoading, setIsLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (params.id) {
      getV2Tag(params.id)
        .then((res) => {
          setValues({
            title_ru: res?.data?.title.ru,
            title_uz: res?.data?.title.uz,
            title_en: res?.data?.title.en,
            color: genSelectOption(res?.data?.color, t),
          });
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  const initialValues = useMemo(
    () => ({
      title_ru: null,
      title_en: null,
      title_uz: null,
      color: null,
    }),
    [],
  );

  const validationSchema = useMemo(() => {
    const defaultSchema = yup.mixed().required(t("required.field.error"));
    return yup.object().shape({
      title_ru: defaultSchema,
      title_en: defaultSchema,
      title_uz: defaultSchema,
      color: defaultSchema,
    });
  }, []);

  const onSubmit = (values) => {
    const data = {
      title: {
        ru: values.title_ru,
        uz: values.title_uz,
        en: values.title_en,
      },
      color: values.color.value,
      icon: "",
    };

    setSaveLoading(true);
    const selectedAction = params.id
      ? updateV2Tag(params.id, data)
      : postV2Tag(data);
    selectedAction
      .then((res) => {
        history.goBack();
      })
      .finally(() => {
        setSaveLoading(false);
      });
  };

  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
  });

  const { values, handleChange, setFieldValue, setValues, handleSubmit } =
    formik;

  const routes = [
    {
      title: t(`tags`),
      link: true,
      route: `/home/catalog/tags`,
    },
    {
      title: t("create"),
    },
  ];

  const headerButtons = [
    <Button
      icon={CancelIcon}
      size="large"
      shape="outlined"
      color="red"
      borderColor="bordercolor"
      onClick={() => history.goBack()}
    >
      {t("cancel")}
    </Button>,
    <Button icon={SaveIcon} size="large" type="submit" loading={saveLoading}>
      {t("save")}
    </Button>,
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

  return !isLoading ? (
    <form onSubmit={handleSubmit}>
      <Header
        startAdornment={[<Breadcrumb routes={routes} />]}
        endAdornment={headerButtons}
      />

      <Filters>
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
      </Filters>
      <SwipeableViews
        axis={theme.direction === "rtl" ? "x-reverse" : "x"}
        index={value}
        onChangeIndex={handleChangeIndex}
      >
        <TabPanel value={value} index={0} dir={theme.direction}>
          <div className="m-4">
            <div className="grid grid-cols-2 gap-5">
              <Card title={t("general.information")}>
                <div className="grid grid-cols-3 items-baseline">
                  <div className="input-label">{t("name")}</div>
                  <div className="col-span-2">
                    <Form.Item formik={formik} name="title_ru">
                      <Input
                        size="large"
                        value={values.title_ru}
                        onChange={handleChange}
                        name="title_ru"
                      />
                    </Form.Item>
                  </div>

                  <div className="input-label">{t("color")}</div>
                  <div className="col-span-2">
                    <Form.Item formik={formik} name="color">
                      <Select
                        height={40}
                        options={genSelectOption(colors, t)}
                        value={values.color}
                        onChange={(val) => {
                          setFieldValue("color", val);
                        }}
                      />
                    </Form.Item>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </TabPanel>
        <TabPanel value={value} index={1} dir={theme.direction}>
          <div className="m-4">
            <div className="grid grid-cols-2 gap-5">
              <Card title={t("general.information")}>
                <div className="grid grid-cols-3 items-baseline">
                  <div className="input-label">{t("name")}</div>
                  <div className="col-span-2">
                    <Form.Item formik={formik} name="title_en">
                      <Input
                        size="large"
                        value={values.title_en}
                        onChange={handleChange}
                        name="title_en"
                      />
                    </Form.Item>
                  </div>

                  <div className="input-label">{t("color")}</div>
                  <div className="col-span-2">
                    <Form.Item formik={formik} name="color">
                      <Select
                        height={40}
                        options={genSelectOption(colors, t)}
                        value={values.color}
                        onChange={(val) => {
                          setFieldValue("color", val);
                        }}
                      />
                    </Form.Item>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </TabPanel>
        <TabPanel value={value} index={2} dir={theme.direction}>
          <div className="m-4">
            <div className="grid grid-cols-2 gap-5">
              <Card title={t("general.information")}>
                <div className="grid grid-cols-3 items-baseline">
                  <div className="input-label">{t("name")}</div>
                  <div className="col-span-2">
                    <Form.Item formik={formik} name="title_uz">
                      <Input
                        size="large"
                        value={values.title_uz}
                        onChange={handleChange}
                        name="title_uz"
                      />
                    </Form.Item>
                  </div>

                  <div className="input-label">{t("color")}</div>
                  <div className="col-span-2">
                    <Form.Item formik={formik} name="color">
                      <Select
                        height={40}
                        options={genSelectOption(colors, t)}
                        value={values.color}
                        onChange={(val) => {
                          setFieldValue("color", val);
                        }}
                      />
                    </Form.Item>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </TabPanel>
      </SwipeableViews>
    </form>
  ) : (
    <CustomSkeleton />
  );
}
