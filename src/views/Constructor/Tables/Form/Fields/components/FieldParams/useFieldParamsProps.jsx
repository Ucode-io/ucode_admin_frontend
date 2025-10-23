import { useMenuListQuery } from "@/services/menuService";
import { useTranslation } from "react-i18next";
import { FIELD_TYPES, newFieldTypes } from "@/utils/constants/fieldTypes";
import { useState } from "react";
import { useFieldArray, useWatch } from "react-hook-form";
import { applyDrag } from "../../../../../../../utils/applyDrag";
import { useQuery } from "react-query";
import constructorFunctionService from "../../../../../../../services/constructorFunctionService";
import listToOptions from "../../../../../../../utils/listToOptions";
import { useSelector } from "react-redux";

export const useFieldParamsProps = ({ watch, setValue, control }) => {
  const { i18n } = useTranslation();

  const activeType = newFieldTypes?.find(
    (item) => item?.value === watch("type"),
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
  ];

  const mediaTypes = [
    FIELD_TYPES.FILE,
    FIELD_TYPES.VIDEO,
    FIELD_TYPES.PHOTO,
    FIELD_TYPES.CUSTOM_IMAGE,
  ];

  const languages = useSelector((state) => state.languages.list);

  const [check, setCheck] = useState(false);
  const [folder, setFolder] = useState("Choose backet");

  const [isCreateOptionOpen, setIsCreateOptionOpen] = useState(true);
  const [isTodoOptionOpen, setIsTodoOptionOpen] = useState(false);
  const [isProgressOptionOpen, setIsProgressOptionOpen] = useState(false);
  const [isCompleteOptionOpen, setIsCompleteOptionOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(
    languages?.[0]?.slug,
  );
  const [labelValue, setLabelValue] = useState({ label_en: "" });

  const closeAllOptions = () => {
    setIsCreateOptionOpen(false);
    setIsTodoOptionOpen(false);
    setIsProgressOptionOpen(false);
    setIsCompleteOptionOpen(false);
  };

  const toggleCreateOptionField = () => {
    if (isCreateOptionOpen) {
      setIsCreateOptionOpen(false);
    } else {
      closeAllOptions();
      setIsCreateOptionOpen(true);
    }
  };

  const toggleTodoOptionField = () => {
    if (isTodoOptionOpen) {
      setIsTodoOptionOpen(false);
    } else {
      closeAllOptions();
      setIsTodoOptionOpen(true);
    }
  };

  const toggleProgressOptionField = () => {
    if (isProgressOptionOpen) {
      setIsProgressOptionOpen(false);
    } else {
      closeAllOptions();
      setIsProgressOptionOpen(true);
    }
  };

  const toggleCompleteOptionField = () => {
    if (isCompleteOptionOpen) {
      setIsCompleteOptionOpen(false);
    } else {
      closeAllOptions();
      setIsCompleteOptionOpen(true);
    }
  };

  const handleClickLanguage = (value) => {
    const activeLanguageIndex = languages?.findIndex(
      (language) => language.slug === selectedLanguage,
    );

    setLabelValue((prev) => ({
      ...prev,
      [`label_${selectedLanguage}`]: value,
    }));

    if (activeLanguageIndex === languages?.length - 1)
      setSelectedLanguage(languages[0]?.slug);
    else setSelectedLanguage(languages[activeLanguageIndex + 1]?.slug);
  };

  const {
    fields: multiSelectFields,
    append: multiSelectAppend,
    remove: multiSelectRemove,
  } = useFieldArray({
    control,
    name: "attributes.options",
    keyName: "key",
  });

  const {
    fields: todoFields,
    append: todoAppend,
    remove: todoRemove,
  } = useFieldArray({
    control,
    name: "attributes.todo.options",
    keyName: "key",
  });

  const {
    fields: progressFields,
    append: progressAppend,
    remove: progressRemove,
  } = useFieldArray({
    control,
    name: "attributes.progress.options",
    keyName: "key",
  });

  const {
    fields: completeFields,
    append: completeAppend,
    remove: completeRemove,
  } = useFieldArray({
    control,
    name: "attributes.complete.options",
    keyName: "key",
  });

  const addStatusOption = (value, type) => {
    const randomIndex = Math.floor(Math.random() * colors?.length);
    if (type === "todo") {
      todoAppend({
        ...labelValue,
        [`label_${selectedLanguage}`]: value,
        color: colors[randomIndex].color,
        colorName: colors[randomIndex].name,
        value: value + "_slug",
      });
    } else if (type === "progress") {
      progressAppend({
        ...labelValue,
        [`label_${selectedLanguage}`]: value,
        color: colors[randomIndex].color,
        colorName: colors[randomIndex].name,
        value: value + "_slug",
      });
    } else if (type === "complete") {
      completeAppend({
        ...labelValue,
        [`label_${selectedLanguage}`]: value,
        color: colors[randomIndex].color,
        colorName: colors[randomIndex].name,
        value: value + "_slug",
      });
    }
  };

  const addNewOption = (value) => {
    const randomIndex = Math.floor(Math.random() * colors?.length);
    multiSelectAppend({
      value,
      icon: "",
      color: colors[randomIndex].color,
      colorName: colors[randomIndex].name,
    });
  };

  const hasColor = useWatch({
    control,
    name: "attributes.has_color",
  });
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

  const onDrop = (dropResult, name) => {
    const result = applyDrag(watch(name), dropResult);
    if (result) {
      setValue(name, result);
      // handleUpdateField(fieldData)
    }
  };

  const { data: functions = [] } = useQuery(
    ["GET_FUNCTIONS_LIST"],
    () => {
      return constructorFunctionService.getListV2({});
    },
    {
      enabled: watch("type") === FIELD_TYPES.BUTTON,
      onError: (err) => {
        console.log("ERR =>", err);
      },
      select: (res) => {
        return listToOptions(res.functions, "name", "id");
      },
    },
  );

  return {
    i18n,
    mediaTypes,
    activeType,
    backetOptions: backetOptions?.menus,
    check,
    folder,
    setCheck,
    handleSelect,
    addNewOption,
    multiSelectFields,
    hasColor,
    isCreateOptionOpen,
    toggleCreateOptionField,
    toggleTodoOptionField,
    toggleProgressOptionField,
    toggleCompleteOptionField,
    multiSelectRemove,
    colors,
    todoFields,
    todoRemove,
    progressFields,
    progressRemove,
    completeFields,
    completeRemove,
    isTodoOptionOpen,
    isProgressOptionOpen,
    isCompleteOptionOpen,
    onDrop,
    functions,
    handleClickLanguage,
    selectedLanguage,
    labelValue,
    addStatusOption,
  };
};
