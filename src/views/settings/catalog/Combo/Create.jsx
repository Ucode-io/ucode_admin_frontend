import { useState, useEffect, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Formik } from "formik";
import { getV2Combo, postV2Combo, updateV2Combo, getV2Tags } from "services";
import { useParams } from "react-router-dom";
import Header from "components/Header";
import Breadcrumb from "components/Breadcrumb";
import Button from "components/Button";
import CancelIcon from "@material-ui/icons/Cancel";
import SaveIcon from "@material-ui/icons/Save";
import { useHistory } from "react-router-dom";
import FullScreenLoader from "components/FullScreenLoader";
import * as Yup from "yup";
import Filters from "components/Filters";
import { StyledTabs, StyledTab } from "components/StyledTabs";
import SwipeableViews from "react-swipeable-views";
import { TabPanel } from "components/Tab/TabBody";
import { useTheme } from "@material-ui/core/styles";
import Combo from "./tabs/Combo";
import ConnectedGoods from "./tabs/ConnectedGoods";
import formFields from "./api.js";
import validate from "helpers/validateField";
import genSelectOption from "helpers/genSelectOption";

export default function ComboCreate() {
  const { t } = useTranslation();
  const history = useHistory();
  const { id } = useParams();
  const theme = useTheme();

  const [tags, setTags] = useState([]);
  const [initialValues, setInitialValues] = useState(formFields);
  const [btnDisabled, setBtnDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [value, setValue] = useState(0);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      var [tags] = await Promise.all([getV2Tags({ page: 1, limit: 10 })]);
      tags = tags.tags?.map((tag) => ({
        label: tag.title.ru,
        value: tag.id,
      }));

      setTags(tags);
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchProductData = useCallback(async () => {
    if (id && tags.length) {
      var res = await getV2Combo(id, {});

      return {
        ...res,
        description_ru: res.description.ru,
        description_uz: res.description.uz,
        description_en: res.description.en,
        in_price: res.in_price,
        out_price: res.out_price,
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
        code: res.code,
      };
    }
    return null;
  }, [id, tags]);

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
        description: {
          ru: values.description_ru,
          uz: values.description_uz,
          en: values.description_en,
        },
        image: values.images[0],
        gallery: values.images.slice(1, values.images.length),
        in_price: values.in_price,
        out_price: values.out_price,
        title: {
          ru: values.title_ru,
          uz: values.title_uz,
          en: values.title_en,
        },
        tag_ids: values.tag_ids.map((tag_id) => tag_id.value),
        variant_ids: values?.variant_ids.map((variant_id) => variant_id.id),
        currency: "UZS", // values.currency.value,
        code: values.code,
        favorite_ids: values?.favorite_ids.map((favorite_id) => favorite_id.id),
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
                      label={tabLabel(t("combo"))}
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
                    <Combo
                      formik={formik}
                      tags={tags}
                      initialValues={initialValues}
                    />
                  </TabPanel>
                  <TabPanel value={value} index={1} dir={theme.direction}>
                    <ConnectedGoods formik={formik} />
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
