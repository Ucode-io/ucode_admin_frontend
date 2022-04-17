import {  useState } from "react";
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

export default function UpdateSubCategory({
  updateModal,
  showText,
  tabLabel,
  subCategoriesProps,
  formik,
  index,
  setAllcategory,
  setUpdateModal,
  setShowText
}) {
  const { t } = useTranslation();
  const [subCategoryTab, setSubCategoryTab] = useState(0);

  const Submittion = () => {
    setShowText(false);
    setUpdateModal(false);
    setAllcategory(formik?.values?.subcategories);
  };

  return (
    <Modal
      open={updateModal}
      title={t("add.subcategory")}
      footer={null}
      isWarning={false}
    >
      <div>
        {/* {showText ? <div> {t("fill.all.languages")} </div> : ""} */}
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
          <TabPanel
            value={subCategoryTab}
            index={0}
          >
            <Form.Item formik={formik} name={`subcategories[${index}].name.ru`}>
              <Input
                name={`subcategories[${index}].name.ru`}
                size="large"
                value={
                  formik?.values?.subcategories
                    ? formik?.values?.subcategories[index]?.name.ru
                    : ""
                }
                onChange={formik.handleChange}
              />
            </Form.Item>
          </TabPanel>

          <TabPanel
            value={subCategoryTab}
            index={1}
          >
            <Form.Item formik={formik} name={`subcategories[${index}].name.en`}>
              <Input
                name={`subcategories[${index}].name.en`}
                size="large"
                value={
                  formik?.values?.subcategories
                    ? formik?.values?.subcategories[index]?.name.en
                    : ""
                }
                onChange={formik.handleChange}
              />
            </Form.Item>
          </TabPanel>

          <TabPanel
            value={subCategoryTab}
            index={2}
          >
            <Form.Item formik={formik} name={`subcategories[${index}].name.uz`}>
              <Input
                name={`subcategories[${index}].name.uz`}
                size="large"
                value={
                  formik?.values?.subcategories
                    ? formik?.values?.subcategories[index]?.name.uz
                    : ""
                }
                onChange={formik.handleChange}
              />
            </Form.Item>
          </TabPanel>
        </>

        <div className="flex w-full justify-center gap-5">
          <Button type="submit" onClick={Submittion} icon={Add} size="large">
            {t("add")}
          </Button>
          <Button
            type="button"
            onClick={() => setUpdateModal(false)}
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