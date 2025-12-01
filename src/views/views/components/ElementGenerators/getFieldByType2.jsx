import styles from "./style.module.scss";

import { useMemo, useState } from "react";

import LaunchIcon from "@mui/icons-material/Launch";

import { FIELD_TYPES } from "@/utils/constants/fieldTypes";
import { numberWithSpaces } from "@/utils/formatNumbers";

import HFCheckbox from "@/views/table-redesign/hf-checkbox-optimization";
import HFButtonField from "@/components/FormElementsOptimization/HFButtonField";
import HFColorPicker from "@/components/FormElementsOptimization/HFColorPicker";
import HFFileUpload from "@/components/FormElementsOptimization/HFFileUpload";
import HFFloatField from "@/components/FormElementsOptimization/HFFloatField";
import HFFormulaField from "@/components/FormElementsOptimization/HFFormulaField";
import HFIconPicker from "@/components/FormElementsOptimization/HFIconPicker";
import HFInternationPhone from "@/components/FormElementsOptimization/HFInternationPhone";
import HFLinkField from "@/components/FormElementsOptimization/HFLinkField";
import HFModalMap from "@/components/FormElementsOptimization/HFModalMap";
import HFMultiFile from "@/components/FormElementsOptimization/HFMultiFile";
import HFMultiImage from "@/components/FormElementsOptimization/HFMultiImage";
import HFMultipleAutocomplete from "@/components/FormElementsOptimization/HFMultipleAutocomplete";
import HFNumberField from "@/components/FormElementsOptimization/HFNumberField";
import HFPassword from "@/components/FormElementsOptimization/HFPassword";
import HFPhotoUpload from "@/components/FormElementsOptimization/HFPhotoUpload";
import HFQrFieldComponent from "@/components/FormElementsOptimization/HFQrFieldOptimization";
import HFStatusField from "@/components/FormElementsOptimization/HFStatusField";
import HFTextComponent from "@/components/FormElementsOptimization/HFTextComponent";
import HFTextField from "@/components/FormElementsOptimization/HFTextField";
import HFTextFieldWithMask from "@/components/FormElementsOptimization/HFTextFieldWithMask";
import InventoryBarCode from "@/components/FormElementsOptimization/InventoryBarcode";
import NewCHFFormulaField from "@/components/FormElementsOptimization/NewCHFormulaField";
import MultiLineCellFormElement from "./MultiLineCellFormElement";
import PolygonFieldTable from "./PolygonFieldTableOptimization";
import {
  HFDateDatePickerWithoutTimeZoneTable,
  HFDatePicker,
  HFDateTimePicker,
  HFTimePickerNew,
} from "@/views/table-redesign/hf-date";
import HFSwitch from "@/views/table-redesign/hf-switch-optimization";
import { HFVideoUpload } from "@/views/table-redesign/hf-video-upload-optimization";
import HFDatePickerNew from "@/views/table-redesign/DatePickerOptimization";
import { useTranslation } from "react-i18next";

export const getFieldByType = ({
  control,
  updateObject,
  computedSlug,
  field,
  defaultValue,
  row,
  newUi,
  newColumn,
  isTableView = false,
  fields,
  isWrapField,
  handleChange,
  isDisabled,
}) => {
  const { i18n } = useTranslation();

  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  const type = row?.type;
  const required = row.attributes?.required;

  function formatPhone(val) {
    if (!val || typeof val !== "string") return "";
    const digits = val.replace(/\D/g, "").slice(0, 9);
    const parts = [
      digits.slice(0, 2),
      digits.slice(2, 5),
      digits.slice(5, 7),
      digits.slice(7, 9),
    ];
    return `(${parts[0]}) ${parts[1]}-${parts[2]}-${parts[3]}`;
  }

  const rules = {
    pattern:
      row?.type === FIELD_TYPES.EMAIL
        ? {
            value: /\S+@\S+\.\S+/,
            message: "Incorrect email format",
          }
        : {
            value: new RegExp(row?.attributes?.validation),
            message: row?.attributes?.validation_message,
          },
  };

  const onBlur = () => {
    setIsEditing(false);
  };

  const handleBlur = (e) => {
    const value = e.target.value;

    onBlur();

    if (required && !value?.trim()) {
      setErrors((prev) => ({
        ...prev,
        [row?.slug]: {
          message: "This field is required",
        },
      }));
      return;
    }

    if (value === row?.value) {
      const newErrors = { ...errors };
      delete newErrors[row?.slug];
      setErrors(newErrors);
      return;
    }

    if (rules?.pattern?.value) {
      const regex = rules.pattern.value;

      if (!regex.test(value)) {
        setErrors((prev) => ({
          ...prev,
          [row?.slug]: {
            message: rules.pattern.message,
          },
        }));
        return;
      }
    }

    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[row?.slug];
      return newErrors;
    });

    handleChange({
      value: typeof value === "number" ? numberWithSpaces(value) : value,
      name: row?.slug,
      rowId: row?.guid,
    });
  };

  const FIELD_RENDERERS = useMemo(() => {
    return {
      SINGLE_LINE: (
        <HFTextField
          disabled={isDisabled}
          isFormEdit
          isNewTableView={true}
          name={computedSlug}
          fullWidth
          inputHeight={20}
          required={required}
          placeholder={row.attributes?.placeholder}
          row={row}
          handleChange={handleChange}
          rules={rules}
          handleBlur={handleBlur}
          error={errors[row?.slug]}
          autoFocus
        />
      ),
      LINK: (
        <HFLinkField
          disabled={isDisabled}
          isNewTableView={true}
          name={computedSlug}
          fullWidth
          required={required}
          placeholder={row.attributes?.placeholder}
          row={row}
          handleChange={handleChange}
          handleBlur={handleBlur}
          error={errors[row?.slug]}
        />
      ),
      TEXT: <HFTextComponent row={row} />,
      BUTTON: <HFButtonField row={row} isTableView={true} />,
      STATUS: (
        <HFStatusField
          row={row}
          newUi={newUi}
          disabled={row?.attributes?.disabled}
          handleChange={handleChange}
        />
      ),
      PASSWORD: (
        <HFPassword
          isNewTableView={true}
          name={computedSlug}
          isTransparent={true}
          newUi={newUi}
          row={row}
          handleBlur={handleBlur}
          required={required}
          error={errors[row?.slug]}
          rules={rules}
        />
      ),
      SCAN_BARCODE: (
        <InventoryBarCode
          name={computedSlug}
          fullWidth
          disabled={isDisabled}
          row={row}
        />
      ),
      PHONE: (
        <HFTextFieldWithMask
          disabled={isDisabled}
          isFormEdit
          name={computedSlug}
          fullWidth
          isTransparent={true}
          required={required}
          placeholder={row.attributes?.placeholder}
          mask={"(99) 999-99-99"}
          row={row}
          error={errors[row?.slug]}
          handleBlur={handleBlur}
        />
      ),
      PHOTO: (
        <HFPhotoUpload
          disabled={isDisabled}
          isNewTableView={true}
          name={computedSlug}
          handleChange={handleChange}
          row={row}
        />
      ),
      MULTI_IMAGE: (
        <HFMultiImage
          disabled={isDisabled}
          isTableView={true}
          updateObject={updateObject}
          name={computedSlug}
          newUi={newUi}
          handleChange={handleChange}
          row={row}
        />
      ),
      MULTI_FILE: (
        <HFMultiFile
          disabled={isDisabled}
          isTableView={true}
          updateObject={updateObject}
          name={computedSlug}
          newUi={newUi}
          handleChange={handleChange}
          row={row}
        />
      ),
      FORMULA: (
        <HFFormulaField
          disabled={isDisabled}
          isTableView={true}
          name={computedSlug}
          row={row}
        />
      ),
      FORMULA_FRONTEND: (
        <NewCHFFormulaField
          isTableView={true}
          name={computedSlug}
          fieldsList={fields}
          disabled={!isDisabled}
          isTransparent={true}
          newUi={newUi}
          row={row}
        />
      ),
      INTERNATION_PHONE: (
        <HFInternationPhone
          isTableView={isTableView}
          name={computedSlug}
          disabled={isDisabled}
          newUi={newUi}
          row={row}
          handleChange={handleChange}
        />
      ),
      MULTISELECT: (
        <HFMultipleAutocomplete
          disabled={isDisabled}
          isFormEdit
          isNewTableView={true}
          width="100%"
          required={required}
          placeholder={row.attributes?.placeholder}
          newUi={newUi}
          handleChange={handleChange}
          row={row}
        />
      ),
      DATE: newUi ? (
        <HFDatePickerNew
          placeholder={row.attributes?.placeholder}
          disabled={isDisabled}
          handleChange={handleChange}
          row={row}
        />
      ) : (
        <HFDatePicker
          control={control}
          name={computedSlug}
          fullWidth
          updateObject={updateObject}
          isNewTableView={true}
          width={"100%"}
          mask={"99.99.9999"}
          isFormEdit
          required={required}
          placeholder={row.attributes?.placeholder}
          defaultValue={defaultValue}
          disabled={isDisabled}
          isTransparent={true}
        />
      ),
      DATE_TIME: newUi ? (
        <HFDatePickerNew
          placeholder={row.attributes?.placeholder}
          disabled={isDisabled}
          handleChange={handleChange}
          row={row}
          withTime={true}
        />
      ) : (
        <HFDateTimePicker
          disabled={isDisabled}
          isFormEdit
          updateObject={updateObject}
          isNewTableView={true}
          showCopyBtn={false}
          control={control}
          name={computedSlug}
          required={required}
          placeholder={row.attributes?.placeholder}
          defaultValue={defaultValue}
          isTransparent={true}
        />
      ),
      DATE_TIME_WITHOUT_TIME_ZONE: newUi ? (
        <HFDatePickerNew
          placeholder={row.attributes?.placeholder}
          disabled={isDisabled}
          handleChange={handleChange}
          row={row}
          withTime={true}
        />
      ) : (
        <HFDateDatePickerWithoutTimeZoneTable
          control={control}
          name={computedSlug}
          tabIndex={field?.tabIndex}
          updateObject={updateObject}
          isTableView={isTableView}
          mask={"99.99.9999"}
          required={field?.required}
          placeholder={row.attributes?.placeholder}
          defaultValue={defaultValue}
          disabled={isDisabled}
          isNewTableView={true}
          field={field}
        />
      ),
      TIME: (
        <HFTimePickerNew
          disabled={isDisabled}
          row={row}
          handleChange={handleChange}
        />
      ),
      NUMBER: (
        <HFNumberField
          disabled={isDisabled}
          isNewTableView={true}
          name={computedSlug}
          fullWidth
          isTransparent={true}
          newColumn={newColumn}
          newUi={newUi}
          row={row}
          handleChange={handleChange}
        />
      ),
      FLOAT: (
        <HFFloatField
          disabled={isDisabled}
          isFormEdit
          fullWidth
          isTransparent={true}
          row={row}
          handleChange={handleChange}
          onBlur={onBlur}
          autoFocus
        />
      ),
      CHECKBOX: (
        <HFCheckbox
          disabled={isDisabled}
          handleChange={handleChange}
          row={row}
        />
      ),
      SWITCH: (
        <HFSwitch
          newColumn={newColumn}
          disabled={isDisabled}
          required={required}
          handleChange={handleChange}
          row={row}
        />
      ),
      EMAIL: (
        <HFTextField
          disabled={isDisabled}
          isFormEdit
          updateObject={updateObject}
          isNewTableView={true}
          control={control}
          name={computedSlug}
          rules={rules}
          fullWidth
          required={required}
          placeholder={row.attributes?.placeholder}
          defaultValue={defaultValue}
          row={row}
        />
      ),
      ICON: (
        <HFIconPicker
          disabled={isDisabled}
          handleChange={handleChange}
          row={row}
        />
      ),
      MAP: (
        <HFModalMap
          isTransparent={true}
          defaultValue={defaultValue}
          handleChange={handleChange}
          row={row}
        />
      ),
      QR: (
        <HFQrFieldComponent
          disabled={isDisabled}
          isTableView={isTableView}
          required={row?.required}
          newColumn={newColumn}
          row={row}
        />
      ),
      POLYGON: (
        <PolygonFieldTable
          computedSlug={computedSlug}
          isDisabled={isDisabled}
          isNewTableView={true}
          row={row}
          handleChange={handleChange}
          disabled={isDisabled}
        />
      ),
      MULTI_LINE: (
        <MultiLineCellFormElement
          isWrapField={isWrapField}
          isNewTableView={true}
          isDisabled={isDisabled}
          row={row}
          handleChange={handleChange}
        />
      ),
      CUSTOM_IMAGE: <HFFileUpload handleChange={handleChange} row={row} />,
      VIDEO: <HFVideoUpload row={row} handleChange={handleChange} />,
      FILE: (
        <HFFileUpload
          row={row}
          isNewTableView={true}
          name={computedSlug}
          defaultValue={defaultValue}
          isFormEdit
          required={required}
          placeholder={row.attributes?.placeholder}
          isTransparent={true}
          handleChange={handleChange}
        />
      ),
      COLOR: (
        <HFColorPicker
          row={row}
          handleChange={handleChange}
          disabled={isDisabled}
        />
      ),
      DYNAMIC: <div style={{ padding: "0 4px" }}>{row?.value}</div>,
      MONEY: <div style={{ padding: "0 4px" }}>{row?.value}</div>,
      default: (
        <div style={{ padding: "0 4px" }} onClick={() => setIsEditing(true)}>
          {row?.value}
        </div>
      ),
    };
  }, []);

  const DEFAULT_FIELD_RENDERERS = useMemo(() => {
    return {
      LINK: (
        <div>
          <a
            href={row?.value}
            disabled={Boolean(!row?.value)}
            className={styles.linkBtn}
            style={{ pointerEvents: Boolean(!row?.value) ? "none" : "auto" }}
          >
            <LaunchIcon style={{ fontSize: "20px" }} />
          </a>
        </div>
      ),

      // loo
      TEXT: <HFTextComponent row={row} />,
      // BUTTON: <HFButtonField row={row} isTableView={true} />,
      // STATUS: () => <StatusView row={row} />,
      // PASSWORD: () => <div>{"*".repeat(row?.value?.length)}</div>,

      // SCAN_BARCODE: (
      //   <InventoryBarCode
      //     name={computedSlug}
      //     fullWidth
      //     disabled={isDisabled}
      //     row={row}
      //   />
      // ),

      PHONE: <div>{formatPhone(row?.value)}</div>,

      //loo
      // PHOTO: (
      //   <HFPhotoUpload
      //     disabled={isDisabled}
      //     isNewTableView={true}
      //     name={computedSlug}
      //     handleChange={handleChange}
      //     row={row}
      //   />
      // ),
      // MULTI_IMAGE: (
      //   <HFMultiImage
      //     disabled={isDisabled}
      //     isTableView={true}
      //     updateObject={updateObject}
      //     name={computedSlug}
      //     newUi={newUi}
      //     handleChange={handleChange}
      //     row={row}
      //   />
      // ),
      // MULTI_FILE: (
      //   <HFMultiFile
      //     disabled={isDisabled}
      //     isTableView={true}
      //     updateObject={updateObject}
      //     name={computedSlug}
      //     newUi={newUi}
      //     handleChange={handleChange}
      //     row={row}
      //   />
      // ),
      // FORMULA: (
      //   <HFFormulaField
      //     disabled={isDisabled}
      //     isTableView={true}
      //     name={computedSlug}
      //     row={row}
      //   />
      // ),
      // FORMULA_FRONTEND: (
      //   <NewCHFFormulaField
      //     isTableView={true}
      //     name={computedSlug}
      //     fieldsList={fields}
      //     disabled={!isDisabled}
      //     isTransparent={true}
      //     newUi={newUi}
      //     row={row}
      //   />
      // ),

      // MULTISELECT: <MultiSelectView row={row} />,
      // DATE: <DateView row={row} />,
      // DATE_TIME: () => <DateView row={row} />,
      // DATE_TIME_WITHOUT_TIME_ZONE: <DateView row={row} />,
      // TIME: <DateView row={row} />,
      // NUMBER: <div>{formatWithMask(row?.value, "#### #### #### ####")}</div>,
      // CHECKBOX: (
      //   <HFCheckbox
      //     disabled={isDisabled}
      //     handleChange={handleChange}
      //     row={row}
      //   />
      // ),
      // SWITCH: (
      //   <HFSwitch
      //     newColumn={newColumn}
      //     disabled={isDisabled}
      //     required={required}
      //     handleChange={handleChange}
      //     row={row}
      //   />
      // ),

      // ICON: (
      //   <HFIconPicker
      //     disabled={isDisabled}
      //     handleChange={handleChange}
      //     row={row}
      //   />
      // ),
      // MAP: (
      //   <HFModalMap
      //     isTransparent={true}
      //     defaultValue={defaultValue}
      //     handleChange={handleChange}
      //     row={row}
      //   />
      // ),
      // QR: (
      //   <HFQrFieldComponent
      //     disabled={isDisabled}
      //     isTableView={isTableView}
      //     required={row?.required}
      //     newColumn={newColumn}
      //     row={row}
      //   />
      // ),
      // POLYGON: (
      //   <PolygonFieldTable
      //     computedSlug={computedSlug}
      //     isDisabled={isDisabled}
      //     isNewTableView={true}
      //     row={row}
      //     handleChange={handleChange}
      //     disabled={isDisabled}
      //   />
      // ),
      // MULTI_LINE: (
      //   <MultiLineCellFormElement
      //     isWrapField={isWrapField}
      //     isNewTableView={true}
      //     isDisabled={isDisabled}
      //     row={row}
      //     handleChange={handleChange}
      //   />
      // ),
      // CUSTOM_IMAGE: <HFFileUpload handleChange={handleChange} row={row} />,
      // VIDEO: <HFVideoUpload row={row} handleChange={handleChange} />,
      // FILE: (
      //   <HFFileUpload
      //     row={row}
      //     isNewTableView={true}
      //     name={computedSlug}
      //     defaultValue={defaultValue}
      //     isFormEdit
      //     required={required}
      //     placeholder={row.attributes?.placeholder}
      //     isTransparent={true}
      //     handleChange={handleChange}
      //   />
      // ),
      // COLOR: (
      //   <HFColorPicker
      //     row={row}
      //     handleChange={handleChange}
      //     disabled={isDisabled}
      //   />
      // ),

      DYNAMIC: <div style={{ padding: "0 4px" }}>{row?.value}</div>,
      MONEY: <div style={{ padding: "0 4px" }}>{row?.value}</div>,
      default: (
        <div style={{ padding: "0 4px" }} onClick={() => setIsEditing(true)}>
          {row?.value}
        </div>
      ),
    };
  }, []);

  return isEditing
    ? FIELD_RENDERERS[type] || FIELD_RENDERERS.default
    : DEFAULT_FIELD_RENDERERS[type] || DEFAULT_FIELD_RENDERERS.default;
};
