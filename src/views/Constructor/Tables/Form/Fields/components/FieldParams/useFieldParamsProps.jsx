import { useMenuListQuery } from "@/services/menuService";
import { useTranslation } from "react-i18next";
import { FIELD_TYPES, newFieldTypes } from "@/utils/constants/fieldTypes";
import { useState } from "react";
import { useFieldArray, useWatch } from "react-hook-form";

export const useFieldParamsProps = ({ watch, setValue, control }) => {
  
  const { i18n } = useTranslation();

  const activeType = newFieldTypes?.find(
    (item) => item?.value === watch("type")
  );

  const colors = [
    {
      name: "Gray",
      color: "#EAECF0",
    },
    {
      name: "Orange",
      color: "#FFD6AE",
    },
    {
      name: "Green",
      color: "#AAF0C4",
    },
    {
      name: "Red",
      color: "#FECDCA",
    },
  ]
  
  const mediaTypes = [
    FIELD_TYPES.FILE,
    FIELD_TYPES.VIDEO,
    FIELD_TYPES.PHOTO,
    FIELD_TYPES.CUSTOM_IMAGE,
  ]
  
  const [check, setCheck] = useState(false);
  const [folder, setFolder] = useState("Choose backet");

  const [isCreateOptionOpen, setIsCreateOptionOpen] = useState(false);

  const toggleCreateOptionField = () => setIsCreateOptionOpen(!isCreateOptionOpen)

  const {
    fields: multiSelectFields,
    append: multiSelectAppend,
    remove: multiSelectRemove
  } = useFieldArray({
    control,
    name: "attributes.options",
    keyName: "key",
  });

  const hasIcon = useWatch({
    control,
    name: "attributes.has_icon",
  });

  const hasColor = useWatch({
    control,
    name: "attributes.has_color",
  });

  const addNewOption = (value) => {
    const randomIndex = Math.floor(Math.random() * colors?.length - 1);
    multiSelectAppend({
      value,
      icon: "",
      color: colors[randomIndex].color,
      colorName: colors[randomIndex].name,
    });
  };

  const { data: backetOptions } = useMenuListQuery({
    params: {
      parent_id: "8a6f913a-e3d4-4b73-9fc0-c942f343d0b9",
    },
  });

  const handleSelect = (e, item) => {
    setValue("attributes.path", item);
    setCheck(true);
    setFolder(item);
  };

  return {
    backetOptions: backetOptions?.menus,
    i18n,
    activeType,
    mediaTypes,
    check,
    folder,
    setCheck,
    setFolder,
    handleSelect,
    multiSelectFields,
    hasIcon,
    hasColor,
    addNewOption,
    isCreateOptionOpen,
    toggleCreateOptionField,
  }
}
