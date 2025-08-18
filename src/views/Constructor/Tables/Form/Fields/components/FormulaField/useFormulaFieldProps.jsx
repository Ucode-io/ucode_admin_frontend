import { useMemo, useRef, useState } from "react";
import { useFieldArray, useWatch } from "react-hook-form";
import { useFieldsListQuery } from "@/services/constructorFieldService";
import { useGetLang } from "@/hooks/useGetLang";
import { useTranslation } from "react-i18next";
import { FIELD_TYPES } from "../../../../../../../utils/constants/fieldTypes";
import { SUPPORTED_FORMULAS } from "hot-formula-parser";
import { getColumnIconPath } from "../../../../../../table-redesign/icons";
import { getFieldIcon } from "./formulaFieldIcons";

export const useFormulaFieldProps = ({
  mainForm,
  menuItem,
  tableSlug,
  control,
  watch,
  setValue = () => {},
}) => {
  const { i18n } = useTranslation();
  const tableLan = useGetLang("Table");

  const [editorValue, setEditorValue] = useState("");
  const [editorSearchText, setEditorSearchText] = useState("");
  const [exampleType, setExampleType] = useState("");
  const [search, setSearch] = useState("");

  const [fields, setFields] = useState([]);

  const mirrorRef = useRef(null);
  const editorRef = useRef(null);
  const textareaRef = useRef(null);

  const mathType = watch("attributes.math");

  const suggestionsFields =
    mainForm
      .getValues("fields")
      ?.filter((item) => item?.type !== FIELD_TYPES.UUID) ?? [];

  const fieldsList = useMemo(() => {
    // if (search) {
    //   return suggestionsFields.filter((item) =>
    //     item.label?.toLowerCase()?.includes(search?.toLowerCase())
    //   );
    // }
    return suggestionsFields?.filter(
      (item) => !item?.type?.includes("FRONTEND") && item?.label
    );
  }, [search]);

  const menuList = getFieldIcon({ fieldsList });

  const [code, setCode] = useState(watch("attributes.formula") ?? "");
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const updateMirrorStyle = (el) => {
    const div = mirrorRef.current;
    const style = getComputedStyle(textareaRef.current || el);

    div.style.position = "absolute";
    div.style.visibility = "hidden";
    div.style.whiteSpace = "pre-wrap";
    div.style.wordWrap = "break-word";
    div.style.overflow = "hidden";
    div.style.padding = style.padding;
    div.style.border = style.border;
    div.style.font = style.font;
    div.style.lineHeight = style.lineHeight;
    div.style.letterSpacing = style.letterSpacing;
    div.style.width = el.offsetWidth + "px";
    div.style.zIndex = -1;
  };

  const onEditorChange = (value) => {
    setEditorValue(value);
    setValue("attributes.formula", value);
  };

  const onItemMouseEnter = (type) => setExampleType(type);
  const onItemMouseLeave = () => setExampleType(null);

  const handleFilterFields = (value) => {
    // if (value?.includes(" ")) {
    //   setEditorSearchText("");
    // } else {
    //   setEditorSearchText(value);
    // }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setCode(value);

    updateMirrorStyle(e.target);

    const words = value.split(/\s|\n/);
    const lastWord = words[words.length - 1];

    if (lastWord.length > 0) {
      const filtered = suggestionsFields.filter((s) =>
        s?.slug?.startsWith(lastWord)
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    const words = code.split(/\s|\n/);
    words[words.length - 1] = suggestion;
    const updated = words.join(" ").replace(/\s+/g, " ");
    setCode(updated);
    setShowSuggestions(false);
    textareaRef.current.focus();
  };

  const formulaTypes = [
    { label: "Сумма", value: "SUMM" },
    { label: "Максимум", value: "MAX" },
    { label: "Среднее", value: "AVG" },
  ];

  const {
    fields: relation,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "attributes.formula_filters",
  });

  const handleSearch = (e) => setSearch(e.target.value);

  const deleteSummary = (index) => {
    remove(index);
  };

  const addNewSummary = () => {
    append({
      key: "",
      value: "",
    });
  };

  const tableRelations = useWatch({
    control: mainForm.control,
    name: "tableRelations",
  });

  const selectedTableSlug = useWatch({
    control,
    name: "attributes.table_from",
  });

  const type = useWatch({
    control,
    name: "attributes.type",
  });

  const computedTables = useMemo(() => {
    return tableRelations?.map((relation) => {
      const relatedTable = relation[relation.relatedTableSlug];

      return {
        label: relatedTable?.label,
        value: `${relatedTable?.slug}#${relation?.id}`,
      };
    });
  }, [tableRelations]);

  const { isLoading: fieldLoading } = useFieldsListQuery({
    params: {
      table_id: menuItem?.table_id,
      tableSlug: tableSlug,
      table_slug: tableSlug,
    },
    tableSlug,
    queryParams: {
      enabled: Boolean(menuItem?.table_id),
      onSuccess: (res) => {
        setFields(
          res?.fields?.map((item) => {
            return { value: item.slug, label: item.label };
          })
        );
      },
    },
  });

  return {
    formulaTypes,
    computedTables,
    fields,
    selectedTableSlug,
    relation,
    addNewSummary,
    deleteSummary,
    type,
    onEditorChange,
    editorValue,
    handleFilterFields,
    editorRef,
    menuList,
    onItemMouseEnter,
    onItemMouseLeave,
    exampleType,
    i18n,
  };
};
