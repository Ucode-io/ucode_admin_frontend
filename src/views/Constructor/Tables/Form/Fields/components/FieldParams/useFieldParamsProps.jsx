import { useMenuListQuery } from "@/services/menuService";
import { useTranslation } from "react-i18next";
import { FIELD_TYPES, newFieldTypes } from "@/utils/constants/fieldTypes";
import { useState } from "react";
import { useFieldArray, useWatch } from "react-hook-form";
import { applyDrag } from "../../../../../../../utils/applyDrag";

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
  ];

  const mediaTypes = [
    FIELD_TYPES.FILE,
    FIELD_TYPES.VIDEO,
    FIELD_TYPES.PHOTO,
    FIELD_TYPES.CUSTOM_IMAGE,
  ];

  const [check, setCheck] = useState(false);
  const [folder, setFolder] = useState("Choose backet");

  const [isCreateOptionOpen, setIsCreateOptionOpen] = useState(true);
  const [isTodoOptionOpen, setIsTodoOptionOpen] = useState(false);
  const [isProgressOptionOpen, setIsProgressOptionOpen] = useState(false);
  const [isCompleteOptionOpen, setIsCompleteOptionOpen] = useState(false);

  const toggleCreateOptionField = () =>
    setIsCreateOptionOpen(!isCreateOptionOpen);
  const toggleTodoOptionField = () => setIsTodoOptionOpen(!isTodoOptionOpen);
  const toggleProgressOptionField = () =>
    setIsProgressOptionOpen(!isProgressOptionOpen);
  const toggleCompleteOptionField = () =>
    setIsCompleteOptionOpen(!isCompleteOptionOpen);

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

  const addTodo = (value) => {
    const randomIndex = Math.floor(Math.random() * colors?.length);
    todoAppend({
      label: value,
      color: colors[randomIndex].color,
      colorName: colors[randomIndex].name,
    });
  };

  const addProgress = (value) => {
    const randomIndex = Math.floor(Math.random() * colors?.length);
    progressAppend({
      label: value,
      color: colors[randomIndex].color,
      colorName: colors[randomIndex].name,
    });
  };

  const addComplete = (value) => {
    const randomIndex = Math.floor(Math.random() * colors?.length);
    completeAppend({
      label: value,
      color: colors[randomIndex].color,
      colorName: colors[randomIndex].name,
    });
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

  const hasIcon = useWatch({
    control,
    name: "attributes.has_icon",
  });

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
    }
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
    toggleTodoOptionField,
    toggleProgressOptionField,
    toggleCompleteOptionField,
    multiSelectRemove,
    colors,
    todoFields,
    todoAppend,
    todoRemove,
    progressFields,
    progressAppend,
    progressRemove,
    completeFields,
    completeAppend,
    completeRemove,
    isTodoOptionOpen,
    isProgressOptionOpen,
    isCompleteOptionOpen,
    addTodo,
    addProgress,
    addComplete,
    onDrop,
  };
};
