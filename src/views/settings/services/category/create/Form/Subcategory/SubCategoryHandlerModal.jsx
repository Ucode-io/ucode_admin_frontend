import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Button from "components/Button";
import { TabPanel } from "components/Tab/TabBody";
import Filters from "components/Filters";
import { StyledTabs, StyledTab } from "components/StyledTabs";
import FlagEngIcon from "assets/icons/eng.svg";
import FlagRuIcon from "assets/icons/rus.svg";
import FlagUzIcon from "assets/icons/uz.svg";
import { Add } from "@material-ui/icons";
import Modal from "components/Modal";
import { Input } from "alisa-ui";
import Form from "components/Form/Index";
import CancelIcon from "@material-ui/icons/Cancel";
const initialValues = {
  name: {
    ru: "",
    uz: "",
    en: "",
  },
};
export default function SubCategoryHandlerModal({
  allCategory,
  newSubCat,
  subCatHandlerModalShow,
  showText,
  tabLabel,
  subCategoriesProps,
  formik,
  index,
  setAllcategory,
  setsubCatHandlerModalShow,
  setShowText,
}) {
  const { t } = useTranslation();
  const [subCategoryTab, setSubCategoryTab] = useState(0);
  const [subCatData, setSubCatData] = useState(initialValues);

  const Submittion = () => {
    if (
      subCatData?.name.uz === "" ||
      subCatData?.name.ru === "" ||
      subCatData?.name.en === ""
    ) {
      setShowText(true);
    } else {
      setShowText(false);
      setsubCatHandlerModalShow(false);
      setAllcategory((prev) => {
        if (newSubCat) {
          return [...prev, subCatData];
        } else {
          let clone = prev.map((el, i) => {
            if (i === index) {
              return subCatData;
            } else {
              return el;
            }
          });
          return [...clone];
        }
      });
      setSubCategoryTab(0)
    }
  };
  useEffect(() => {
    if (!newSubCat) {
      setSubCatData(allCategory[index]);
    } else {
      setSubCatData(initialValues);
    }
  }, [newSubCat, index, allCategory, setSubCatData]);
  function handleChange(lang, e) {
    setSubCatData((prev) => {
      return {
        name: {
          ...prev.name,
          [lang]: e.target.value,
        },
      };
    });
  }
  console.log("data", newSubCat);
  return (
    <Modal
      open={subCatHandlerModalShow}
      title={t("add.subcategory")}
      footer={null}
      isWarning={false}
    >
      <div>
        {showText ? (
          <div className="text-red-600 text-center">
            {" "}
            {t("fill.all.languages")}{" "}
          </div>
        ) : (
          ""
        )}
        <Filters>
          <StyledTabs
            value={subCategoryTab}
            onChange={(_, value) => setSubCategoryTab(value)}
            indicatorColor="primary"
            textColor="primary"
            centered={false}
            aria-label="full width tabs example"
            TabIndicatorProps={{
              children: <span className="w-2" />,
            }}
          >
            <StyledTab
              label={
                <span className="flex">
                  <img src={FlagRuIcon} alt="ru" /> {tabLabel(t("russian"))}
                </span>
              }
              {...subCategoriesProps(0)}
            />

            <StyledTab
              label={
                <span className="flex">
                  <img src={FlagEngIcon} alt="eng" /> {tabLabel(t("english"))}
                </span>
              }
              {...subCategoriesProps(1)}
            />

            <StyledTab
              label={
                <span className="flex">
                  <img src={FlagUzIcon} alt="uz" /> {tabLabel(t("uzbek"))}
                </span>
              }
              {...subCategoriesProps(2)}
            />
          </StyledTabs>
        </Filters>

        <>
          <TabPanel value={subCategoryTab} index={0}>
            <Input
              size="large"
              value={subCatData.name.ru}
              onChange={(e) => {
                handleChange("ru", e);
              }}
            />
          </TabPanel>

          <TabPanel value={subCategoryTab} index={1}>
            <Input
              size="large"
              value={subCatData.name.en}
              onChange={(e) => {
                handleChange("en", e);
              }}
            />
          </TabPanel>

          <TabPanel value={subCategoryTab} index={2}>
            <Input
              size="large"
              value={subCatData.name.uz}
              onChange={(e) => {
                handleChange("uz", e);
              }}
            />
          </TabPanel>
        </>

        <div className="flex w-full justify-center gap-5 mt-2">
          <Button type="submit" onClick={Submittion} icon={Add} size="large">
            {t("add")}
          </Button>
          <Button
            type="button"
            onClick={() => {setsubCatHandlerModalShow(false);setSubCatData(initialValues);setSubCategoryTab(0)}}
            icon={CancelIcon}
            shape="outlined"
            color="red"
            borderColor="bordercolor"
          >
            {t("cancel")}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
