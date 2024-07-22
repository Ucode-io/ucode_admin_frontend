import React, {useMemo} from "react";
import HCTextField from "./HCTextField";
import {useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import FieldLabel from "./FieldLabel";
import HCNumberField from "./HCNumberField";
import HCPassword from "./HCPassword";
import HCMultiLine from "./HCMultiline";

function Form1CElementGenerator({
  field = {},
  control,
  setFormValue,
  formTableSlug,
  checkRequired = true,
  activeLang,
  fieldsList,
  checkPermission = true,
  isMultiLanguage,
  relatedTable,
  valueGenerator,
  errors,
  sectionModal,
  ...props
}) {
  const isUserId = useSelector((state) => state?.auth?.userId);
  const tables = useSelector((state) => state?.auth?.tables);
  const {i18n} = useTranslation();

  const checkRequiredField = !checkRequired ? checkRequired : field?.required;
  let relationTableSlug = "";
  let objectIdFromJWT = "";
  if (field?.id?.includes("#")) {
    relationTableSlug = field?.id?.split("#")[0];
  }

  const slugSplit = (slug) => {
    const parts = slug.split("_");
    return parts[parts.length - 1];
  };

  const label = useMemo(() => {
    if (field?.enable_multilanguage) {
      return field?.attributes?.show_label
        ? `${field?.label} (${activeLang ?? slugSplit(field?.slug)})`
        : field?.attributes?.[`label_${i18n?.language}`];
    } else {
      if (field?.show_label === false) return "";
      else
        return (
          field?.attributes?.[`label_${i18n.language}`] || field?.label || " "
        );
    }
  }, [field, activeLang, i18n?.language]);

  tables?.forEach((table) => {
    if (table?.table_slug === relationTableSlug) {
      objectIdFromJWT = table?.object_id;
    }
  });

  const removeLangFromSlug = (slug) => {
    var lastIndex = slug.lastIndexOf("_");
    if (lastIndex !== -1) {
      var result = slug.substring(0, lastIndex);
      return result;
    } else {
      return false;
    }
  };

  const computedSlug = useMemo(() => {
    if (field?.enable_multilanguage) {
      return `${removeLangFromSlug(field.slug)}_${activeLang}`;
    } else if (field.id?.includes("@")) {
      return `$${field?.id?.split("@")?.[0]}.${field?.slug}`;
    } else if (field?.id?.includes("#")) {
      if (field?.type === "Many2Many") {
        return `${field.id?.split("#")?.[0]}_ids`;
      } else if (field?.type === "Many2One") {
        return `${field.id?.split("#")?.[0]}_id`;
      }
    }

    return field?.slug;
  }, [field?.slug, activeLang, field?.enable_multilanguage]);

  const defaultValue = useMemo(() => {
    if (field?.attributes?.object_id_from_jwt === true) return objectIdFromJWT;
    if (field?.attributes?.is_user_id_default === true) return isUserId;

    const defaultValue =
      field.attributes?.defaultValue ?? field.attributes?.default_values;

    if (!defaultValue) return undefined;
    if (field.relation_type === "Many2One") return defaultValue[0];
    if (
      field?.relation_type !== "Many2One" ||
      field?.relation_type !== "Many2Many"
    )
      return defaultValue;
    if (field.type === "MULTISELECT" || field.id?.includes("#"))
      return defaultValue;
    if (field?.type === "SINGLE_LINE") return defaultValue;
    const {error, result} = parser.parse(defaultValue);
    return error ? undefined : result;
  }, [field.type, field.id, field.relation_type, objectIdFromJWT, isUserId]);

  const isDisabled = useMemo(() => {
    const {attributes} = field;

    if (window.location.pathname.includes("create")) {
      if (attributes?.disabled) return true;
      else return false;
    } else {
      return (
        attributes?.disabled ||
        !attributes?.field_permission?.edit_permission ||
        attributes?.is_editable
      );
    }
  }, [field]);

  if (
    !field.attributes?.field_permission?.view_permission &&
    checkPermission &&
    field?.slug !== "default_values"
  ) {
    return null;
  }
  //   if (field?.id?.includes("#")) {
  //     if (field?.relation_type === "Many2Many") {
  //       return field?.attributes?.multiple_input ? (
  //         <ManyToManyRelationMultipleInput
  //           control={control}
  //           field={field}
  //           setFormValue={setFormValue}
  //           defaultValue={defaultValue}
  //           disabled={isDisabled}
  //           checkRequiredField={checkRequiredField}
  //           name={computedSlug}
  //           {...props}
  //         />
  //       ) : (
  //         <ManyToManyRelationFormElement
  //           control={control}
  //           field={field}
  //           setFormValue={setFormValue}
  //           defaultValue={defaultValue}
  //           disabled={isDisabled}
  //           checkRequiredField={checkRequiredField}
  //           name={computedSlug}
  //           {...props}
  //         />
  //       );
  //     } else if (field?.relation_type === "Many2Dynamic") {
  //       return (
  //         <DynamicRelationFormElement
  //           control={control}
  //           field={field}
  //           setFormValue={setFormValue}
  //           defaultValue={defaultValue}
  //           disabled={isDisabled}
  //           checkRequiredField={checkRequiredField}
  //           {...props}
  //         />
  //       );
  //     } else {
  //       return (
  //         <RelationFormElement
  //           control={control}
  //           field={field}
  //           name={computedSlug}
  //           setFormValue={setFormValue}
  //           formTableSlug={formTableSlug}
  //           defaultValue={defaultValue}
  //           disabled={isDisabled}
  //           key={computedSlug}
  //           activeLang={activeLang}
  //           checkRequiredField={checkRequiredField}
  //           errors={errors}
  //           rules={{
  //             pattern: {
  //               value: new RegExp(field?.attributes?.validation),
  //               message: field?.attributes?.validation_message,
  //             },
  //           }}
  //           {...props}
  //         />
  //       );
  //     }
  //   }

  switch (field?.type) {
    case "SINGLE_LINE":
      return (
        <FieldLabel label={label}>
          <HCTextField
            placeholder={field?.placeholder}
            fullWidth
            control={control}
            field={field}
            name={computedSlug}
            required={true}
            disabled={isDisabled}
            defaultValue={defaultValue}
          />
        </FieldLabel>
      );
    case "NUMBER":
      return (
        <FieldLabel label={label}>
          <HCNumberField
            control={control}
            name={computedSlug}
            withTrim={true}
          />
        </FieldLabel>
      );
    case "PASSWORD":
      return (
        <FieldLabel label={label}>
          <HCPassword
            type="password"
            control={control}
            name={computedSlug}
            withTrim={true}
          />
        </FieldLabel>
      );
    case "MULTI_LINE":
      return (
        <FieldLabel label={label}>
          <HCMultiLine control={control} name={computedSlug} />
        </FieldLabel>
      );
  }
}

export default Form1CElementGenerator;
