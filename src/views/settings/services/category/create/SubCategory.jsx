import { useMemo, useState, useEffect } from "react";
import Card from "components/Card";
import { useTranslation } from "react-i18next";

import Button from "components/Button";

import { TabPanel } from "components/Tab/TabBody";
import Filters from "components/Filters";
import { StyledTabs,StyledTab } from "components/StyledTabs";
import  FlagEngIcon from "assets/icons/eng.svg"
import FlagRuIcon  from "assets/icons/rus.svg"
// import { ReactComponent as FlagUzIcon } from "assets/icons/uz.svg"
import  FlagUzIcon  from "assets/icons/uz.svg"
import { Add, KeyboardArrowRight } from "@material-ui/icons";
import edit_icon from "assets/icons/edit.svg"
import delete_icon from "assets/icons/delete.svg"
import SwipeableViews from "react-swipeable-views";
import Modal from "components/Modal";
import { Input } from "alisa-ui";
import Form from "components/Form/Index";

export default function SubCategoryForm({formik, subCategory, id}){
    const { t } = useTranslation();
    const [saveLoading, setSaveLoading] = useState(false);
    const [subCategoryTab, setSubCategoryTab] = useState(0)
    
    
    const [modal, setModal] = useState()

const subCategoriesProps = (index) => {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
};

const tabLabel = (text, isActive = false) => {
  return <span className="px-1">{text}</span>;
};

    return (
      <Card title={t("subcategories")}>
        {subCategory?.map((item, index) => (
          <div className="flex items-center w-full justify-between border-b pb-2 mb-2">
            <span>
              <KeyboardArrowRight />
              {item.name.ru}
            </span>

            <div className="flex">
              {/* <img
                  className="border rounded p-1.5 "
                  src={add_icon}
                  alt="add"
                /> */}
              <img
                className="border rounded p-1.5 ml-2"
                onClick={() => setModal(true)}
                src={edit_icon}
                alt="edit"
              />
              <img
                className="border rounded p-1.5 ml-2"
                src={delete_icon}
                alt="delete"
              />
            </div>
          </div>
        ))}
        <div className="w-full items-baseline">
          <div
            className="mt-4 cursor-pointer border border-dashed border-blue-800 text-primary text-sm  p-2 rounded-md flex justify-center items-center gap-2.5"
            onClick={() => setModal(true)}
            // ref={productRef}
          >
            <Add />
            <div className="text-black-1 text-primary">Добавить продукт</div>
          </div>
        </div>

        <Modal open={modal} title="category" footer={null} isWarning={false}>
          <div>
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
                      <img src={FlagEngIcon} alt="eng" />{" "}
                      {tabLabel(t("english"))}
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

            {formik.values.subcategory?.subcategories.map((items, index) => (
              <>
                <TabPanel
                  value={subCategoryTab}
                  index={0}
                  //   dir={theme.direction}
                >
                  <Form.Item
                    formik={formik}
                    name={ !id ? `subcategory.subcategories[${index}].name.ru` : `subcategories[${index}].name.ru`}
                  >
                    <Input
                      name={ !id ? `subcategory.subcategories[${index}].name.ru` : `subcategories[${index}].name.ru`}
                      size="large"
                      value={
                        !id
                          ? formik?.values?.subcategory.subcategories[index]
                              .name.ru
                          : formik?.values?.subcategories[index].name.ru
                      }
                      onChange={formik.handleChange}
                    />
                  </Form.Item>
                </TabPanel>

                <TabPanel
                  value={subCategoryTab}
                  index={1}
                  //   dir={theme.direction}
                >
                  <Form.Item
                    formik={formik}
                    name={ !id ? `subcategory.subcategories[${index}].name.en` : `subcategories[${index}].name.en`}
                  >
                    <Input
                      name={ !id ? `subcategory.subcategories[${index}].name.en` : `subcategories[${index}].name.en`}
                      size="large"
                      value={
                        !id
                          ? formik?.values?.subcategory.subcategories[index]
                              .name.en
                          : formik?.values?.subcategories[index].name.en
                      }
                      onChange={formik.handleChange}
                    />
                  </Form.Item>
                </TabPanel>

                <TabPanel
                  value={subCategoryTab}
                  index={2}
                  //   dir={theme.direction}
                >
                  <Form.Item
                    formik={formik}
                    name={ !id ? `subcategory.subcategories[${index}].name.uz` : `subcategories[${index}].name.uz`}
                  >
                    <Input
                      name={ !id ? `subcategory.subcategories[${index}].name.uz` : `subcategories[${index}].name.uz`}
                      size="large"
                      value={
                        !id
                          ? formik?.values?.subcategory.subcategories[index]
                              .name.uz
                          : formik?.values?.subcategories[index].name.uz
                      }
                      onChange={formik.handleChange}
                    />
                  </Form.Item>
                </TabPanel>
              </>
            ))}

            <div className="flex">
              <Button
                type="submit"
                onClick={formik.handleSubmit}
                loading={saveLoading}
              >
                {t("add")}
              </Button>
              <Button type="button" onClick={() => setModal(false)}>
                {t("cancel")}
              </Button>
            </div>
          </div>
        </Modal>
      </Card>
    );
}