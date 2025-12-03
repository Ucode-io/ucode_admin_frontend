import CellElementGeneratorForRelation from "@/views/views/components/ElementGenerators/CellElementGeneratorForRelation";
import { useState } from "react"
import { useTranslation } from "react-i18next";

import cls from "./styles.module.scss"
import { getRelationFieldTabsLabel, getRelationFieldTabsLabelLang } from "@/utils/getRelationFieldLabel";
import { useSelector } from "react-redux";

export const RelationElementContainer = ({field, index, control, isTableView, updateObject, setFormValue, relationView, handleChange}) => {

  const languages = useSelector((state) => state.languages.list)?.map(
    (el) => el.slug,
  );

  const { i18n } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);


  return isEditing 
    ? <CellElementGeneratorForRelation
        row={field}
        field={field}
        index={index}
        control={control}
        isTableView={isTableView}
        updateObject={updateObject}
        setFormValue={setFormValue}
        relationView={relationView}
        newUi={true}
        handleChange={handleChange}
        handleOnClose={() => setIsEditing(false)}
        defaultMenuIsOpen
        autoFocus
      />
    : <div className={cls.relationDisplay} onClick={() => setIsEditing(true)}>
      {
        field?.attributes?.enable_multi_language
        ? getRelationFieldTabsLabelLang(
            field,
            field?.[`${field?.slug}_data`],
            i18n?.language,
            languages,
          )
        : `${getRelationFieldTabsLabel(field, field?.[`${field?.slug}_data`], i18n?.language)}`
      }
    </div>
}