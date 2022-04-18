import Button from "components/Button";
import { TabPanel } from "components/Tab/TabBody";
import Filters from "components/Filters";
import { StyledTabs, StyledTab } from "components/StyledTabs";
import FlagEngIcon from "assets/icons/eng.svg";
import FlagRuIcon from "assets/icons/rus.svg";
import FlagUzIcon from "assets/icons/uz.svg";
import Modal from "components/Modal";
import { Input } from "alisa-ui";
import Form from "components/Form/Index";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import CancelIcon from "@material-ui/icons/Cancel";
import { Add } from "@material-ui/icons";

export default function PostSubCategory({
  postModal,
  showText,
  tabLabel,
  subCategoriesProps,
  formik,
  index,
  setPostModal,
  setShowText,
  setAllcategory
}) {

  const [subCategoryTab, setSubCategoryTab] = useState(0);
  const { t } = useTranslation();

  const Submittion = () => {
    if (
      formik?.values?.subcategory?.subcategories[0].name.ru === "" ||
      formik?.values?.subcategory?.subcategories[0].name.en === "" ||
      formik?.values?.subcategory?.subcategories[0].name.uz === ""
    ) {
      setShowText(true);
    } else {
      setShowText(false);
      setPostModal(false);
      setAllcategory((prev) => {
        return [...prev, ...formik?.values?.subcategory?.subcategories];
      });
      formik.setFieldValue("subcategory.subcategories[0].name", {
        uz: "",
        ru: "",
        en: "",
      });
    }
  };

  return (
    <Modal
      open={postModal}
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
        <Filters className="mb-6">
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
            <Form.Item
              formik={formik}
              name={`subcategory.subcategories[0].name.ru`}
            >
              <Input
                name={`subcategory.subcategories[0].name.ru`}
                size="large"
                value={
                  formik?.values?.subcategory?.subcategories[index]?.name.ru || ""
                }
                onChange={formik.handleChange}
              />
            </Form.Item>
          </TabPanel>

          <TabPanel value={subCategoryTab} index={1}>
            <Form.Item
              formik={formik}
              name={`subcategory.subcategories[0].name.en`}
            >
              <Input
                name={`subcategory.subcategories[0].name.en`}
                size="large"
                value={
                  formik?.values?.subcategory?.subcategories[index]?.name.en || "" }
                onChange={formik.handleChange}
              />
            </Form.Item>
          </TabPanel>

          <TabPanel value={subCategoryTab} index={2}>
            <Form.Item
              formik={formik}
              name={`subcategory.subcategories[0].name.uz`}
            >
              <Input
                name={`subcategory.subcategories[0].name.uz`}
                size="large"
                value={formik?.values?.subcategory?.subcategories[index]?.name.uz || ""}
                onChange={formik.handleChange}
              />
            </Form.Item>
          </TabPanel>
        </>

        <div className="flex w-full justify-center gap-5">
          <Button type="button" size="large" onClick={Submittion} icon={Add}>
            {t("add")}
          </Button>

          <Button
            icon={CancelIcon}
            shape="outlined"
            color="red"
            borderColor="bordercolor"
            type="button"
            size="large"
            onClick={() => setPostModal(false)}
          >
            {t("cancel")}
          </Button>
        </div>
      </div>
    </Modal>
  );
}