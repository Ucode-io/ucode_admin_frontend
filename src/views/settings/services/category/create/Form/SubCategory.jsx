import { useState, useEffect } from "react";
import Card from "components/Card";
import { useTranslation } from "react-i18next";
import { Add, KeyboardArrowRight } from "@material-ui/icons";
import edit_icon from "assets/icons/edit.svg";
import delete_icon from "assets/icons/delete.svg";
import PostSubCategory from "./Subcategory/PostSubCategory";
import UpdateSubCategory from "./Subcategory/UpdateSubCategory";


export default function SubCategoryForm({ formik, subCategory, id, setAllcategory, allCategory, lang}) {
  const { t } = useTranslation();
  const [saveLoading, setSaveLoading] = useState(false);
  const [index, setIndex] = useState(0);
  const [postModal, setPostModal] = useState();
  const [updateModal, setUpdateModal] = useState();
  const [showText, setShowText] = useState(false)


  console.log("ALL =>", [...new Set(allCategory)])

  const subCategoriesProps = (index) => {
    return {
      id: `full-width-tab-${index}`,
      "aria-controls": `full-width-tabpanel-${index}`,
    };
  };

  const tabLabel = (text, isActive = false) => {
    return <span className="px-1">{text}</span>;
  };

  const deleteSub = (subId) => {
    setAllcategory((prev)=>{
      return [...prev.filter(prev =>prev.id !== subId)]
    })
  }

  useEffect(() => {
    if (!subCategory) return null;
    setAllcategory((prev) => [...prev, ...subCategory]);
  }, [subCategory]);

  let removeDuplicate = [...new Set(allCategory)]

  return (
    <Card title={t("subcategories")}>
      {removeDuplicate?.map((item, index) => (
        <div key={item.id} className="flex items-center w-full justify-between border-b pb-2 mb-2">
          <span>
            <KeyboardArrowRight />
            {item.name[lang]}
          </span>

          <div className="flex">
            <img
              className="border rounded p-1.5 ml-2"
              onClick={() => {
                setUpdateModal(true);
                setIndex(index);
              }}
              src={edit_icon}
              alt="edit"
            />
            <img
              className="border rounded p-1.5 ml-2"
              src={delete_icon}
              alt="delete"
              onClick={() => deleteSub(item.id)}
            />
          </div>
        </div>
         ))} 
      <div className="w-full items-baseline">
        <div
          className="mt-4 cursor-pointer border border-dashed border-blue-800 text-primary text-sm  p-2 rounded-md flex justify-center items-center gap-2.5"
          onClick={() => setPostModal(true)}
        >
          <Add />
          <div className="text-black-1 text-primary">Добавить продукт</div>
        </div>
      </div>

      {id ? (
        <UpdateSubCategory
          updateModal={updateModal}
          showText={showText}
          tabLabel={tabLabel}
          subCategoriesProps={subCategoriesProps}
          formik={formik}
          index={index}
          setUpdateModal={setUpdateModal}
          setAllcategory={setAllcategory}
          setShowText={setShowText}
        />
      ) : (
        " "
      )}
      <PostSubCategory
        postModal={postModal}
        showText={showText}
        tabLabel={tabLabel}
        subCategoriesProps={subCategoriesProps}
        formik={formik}
        index={index}
        setPostModal={setPostModal}
        setShowText={setShowText}
        setAllcategory={setAllcategory}
      />
    </Card>
  );
}
