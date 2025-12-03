import { useMemo, useState } from "react";

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
import HFModalMap from "@/components/FormElementsOptimization/HFModalMap";
import HFMultiFile from "@/components/FormElementsOptimization/HFMultiFile";
import HFMultiImage from "@/components/FormElementsOptimization/HFMultiImage";
import HFMultipleAutocomplete from "@/components/FormElementsOptimization/HFMultipleAutocomplete";
import HFNumberField from "@/components/FormElementsOptimization/HFNumberField";
import HFPhotoUpload from "@/components/FormElementsOptimization/HFPhotoUpload";
import HFQrFieldComponent from "@/components/FormElementsOptimization/HFQrFieldOptimization";
import HFStatusField from "@/components/FormElementsOptimization/HFStatusField";

import HFTextField from "@/components/FormElementsOptimization/HFTextField";
import HFTextFieldWithMask from "@/components/FormElementsOptimization/HFTextFieldWithMask";
import InventoryBarCode from "@/components/FormElementsOptimization/InventoryBarcode";
import PolygonFieldTable from "./PolygonFieldTableOptimization";
import { HFTimePickerNew } from "@/views/table-redesign/hf-date";
import { HFVideoUpload } from "@/views/table-redesign/hf-video-upload-optimization";
import HFDatePickerNew from "@/views/table-redesign/DatePickerOptimization";

import { HFCustomSwitch } from "@/components/FormElementsOptimization/HFCustomSwitch";

import { ElementLink } from "./ElementLink";
import { ElementText } from "./ElementText";
import { ElementPassword } from "./ElementPassword";
import { ElementFrontendFormula } from "./ElementFrontendFormula";

import { ElementMultiLine } from "./ElementMultiLine";
import { BackendFormulaDisplay } from "./DisplayFields/BackendFormulaDisplay";
import { NumberDisplay } from "./DisplayFields/NumberDisplay";
import { InternationalPhoneDisplay } from "./DisplayFields/InternationalPhoneDisplay";
import { StatusDisplay } from "./DisplayFields/StatusDisplay";
import { DateDisplay } from "./DisplayFields/DateDisplay";
import { MultiSelectDisplay } from "./DisplayFields/MultiSelectDisplay";
import { SingleLineDisplay } from "./DisplayFields/SingleLineDisplay";
import { FloatDisplay } from "./DisplayFields/FloatDisplay";
import formatWithSpaces from "@/utils/formatWithSpace";

export const getFieldByType = ({
  control,
  updateObject,
  computedSlug,
  defaultValue,
  row,
  newUi,
  newColumn,
  isTableView = false,
  fields,
  isDisabled,
  handleChange: handleChangeFieldValue,
  rowData,
  errors,
  setErrors,
  handleOpenTextEditor,
}) => {
  const [isEditing, setIsEditing] = useState(false);

  const type = row?.type;

  const required = row.attributes?.required;

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

  const backDisplay = () => {
    setIsEditing(false);
  };

  const handleBlur = (e) => {
    const value = e.target.value;

    backDisplay();

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

    const data = {
      value: typeof value === "number" ? numberWithSpaces(value) : value,
      name: row?.slug,
      rowId: row?.guid,
    };

    if (row?.type === FIELD_TYPES.FLOAT) {
      if (value === formatWithSpaces(row?.value)) return;

      const val = value;
      const valueWithoutSpaces = val.replaceAll(" ", "");

      if (!valueWithoutSpaces) data.value = null;
      else {
        if (valueWithoutSpaces.at(-1) === ".")
          data.value = parseFloat(valueWithoutSpaces);
        else
          data.value = !isNaN(valueWithoutSpaces)
            ? parseFloat(valueWithoutSpaces)
            : valueWithoutSpaces;
      }
    }

    handleChange(data);
  };

  const handleChange = (data) => {
    const rule =
      required && typeof data?.value === "string"
        ? !data?.value?.trim()
        : data?.value == null;

    if (rule) {
      setErrors((prev) => ({
        ...prev,
        [row?.slug]: {
          message: "This field is required",
        },
      }));
      return;
    } else {
      const newErrors = { ...errors };
      delete newErrors[row?.slug];
      setErrors(newErrors);
      handleChangeFieldValue(data);
    }
  };

  const handleClickField = () => {
    if (!isDisabled) {
      setIsEditing(true);
    }
  };

  const FIELD_RENDERERS = useMemo(() => {
    return {
      SINGLE_LINE: isEditing ? (
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
          handleBlur={handleBlur}
          autoFocus
        />
      ) : (
        <SingleLineDisplay value={row?.value} onClick={handleClickField} />
      ),
      LINK: (
        <ElementLink
          value={row?.value}
          required={required}
          disabled={isDisabled}
          onBlur={handleBlur}
        />
      ),
      TEXT: <ElementText row={row} />,
      BUTTON: <HFButtonField row={row} isTableView={true} />,
      STATUS: isEditing ? (
        <HFStatusField
          row={row}
          newUi={newUi}
          disabled={row?.attributes?.disabled}
          handleChange={handleChange}
          onClose={backDisplay}
          defaultOpen
        />
      ) : (
        <StatusDisplay row={row} onClick={handleClickField} />
      ),
      PASSWORD: <ElementPassword value={row?.value} onBlur={handleBlur} />,
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
      FORMULA: isEditing ? (
        <HFFormulaField
          fieldsList={fields}
          disabled={isDisabled}
          isTableView={true}
          name={computedSlug}
          row={row}
        />
      ) : (
        <BackendFormulaDisplay
          value={row?.value}
          formula={row?.attributes?.formula}
        />
      ),
      FORMULA_FRONTEND: (
        <ElementFrontendFormula
          row={row}
          rowData={rowData}
          fieldsList={fields}
        />
      ),
      MULTISELECT: isEditing ? (
        <HFMultipleAutocomplete
          disabled={isDisabled}
          isFormEdit
          isNewTableView={true}
          width="100%"
          required={required}
          placeholder={row.attributes?.placeholder}
          newUi={newUi}
          handleChange={handleChange}
          onClose={backDisplay}
          row={row}
          defaultOpen
        />
      ) : (
        <MultiSelectDisplay row={row} onClick={handleClickField} />
      ),
      NUMBER: isEditing ? (
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
          onBlur={backDisplay}
          autoFocus
        />
      ) : (
        <NumberDisplay value={row?.value} onClick={handleClickField} />
      ),
      FLOAT: isEditing ? (
        <HFFloatField
          disabled={isDisabled}
          isFormEdit
          fullWidth
          isTransparent={true}
          row={row}
          handleChange={handleChange}
          onBlur={handleBlur}
          autoFocus
        />
      ) : (
        <FloatDisplay value={row?.value} onClick={handleClickField} />
      ),
      CHECKBOX: (
        <HFCheckbox
          disabled={isDisabled}
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
        <ElementMultiLine
          row={row}
          onClick={(e) => handleOpenTextEditor(e, row)}
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
      INTERNATION_PHONE: isEditing ? (
        <HFInternationPhone
          isTableView={isTableView}
          name={computedSlug}
          disabled={isDisabled}
          newUi={newUi}
          row={row}
          onBlur={handleBlur}
          autoFocus
        />
      ) : (
        <InternationalPhoneDisplay
          value={row?.value}
          onClick={() => setIsEditing(true)}
        />
      ),
      DATE: isEditing ? (
        <HFDatePickerNew
          disabled={isDisabled}
          handleChange={handleChange}
          onClose={backDisplay}
          row={row}
          defaultOpen
        />
      ) : (
        <DateDisplay
          value={row.value}
          type={row.type}
          onClick={handleClickField}
          placeholder={row.attributes?.placeholder}
        />
      ),
      DATE_TIME: isEditing ? (
        <HFDatePickerNew
          disabled={isDisabled}
          handleChange={handleChange}
          onClose={backDisplay}
          row={row}
          withTime={true}
          defaultOpen
        />
      ) : (
        <DateDisplay
          value={row.value}
          type={row.type}
          onClick={handleClickField}
          placeholder={row.attributes?.placeholder}
        />
      ),
      DATE_TIME_WITHOUT_TIME_ZONE: isEditing ? (
        <HFDatePickerNew
          disabled={isDisabled}
          handleChange={handleChange}
          onClose={backDisplay}
          row={row}
          withTime={true}
          defaultOpen
        />
      ) : (
        <DateDisplay
          value={row.value}
          type={row.type}
          onClick={handleClickField}
          placeholder={row.attributes?.placeholder}
        />
      ),
      TIME: isEditing ? (
        <HFTimePickerNew
          disabled={isDisabled}
          row={row}
          handleChange={handleChange}
          onBlur={backDisplay}
          defaultOpen
          autoFocus
        />
      ) : (
        <DateDisplay
          value={row.value}
          type={row.type}
          onClick={handleClickField}
          placeholder={row.attributes?.placeholder}
        />
      ),
      SWITCH: (
        <HFCustomSwitch
          newColumn={newColumn}
          value={row?.value}
          disabled={isDisabled}
          handleChange={(value) => {
            handleChange({ value, rowId: row?.guid, name: row?.slug });
          }}
        />
      ),
      DYNAMIC: <div style={{ padding: "0 4px" }}>{row?.value}</div>,
      MONEY: <div style={{ padding: "0 4px" }}>{row?.value}</div>,
      default: (
        <div style={{ padding: "0 4px" }} onClick={handleClickField}>
          {row?.value}
        </div>
      ),
    };
  }, [row?.value, isDisabled, isEditing]);

  return FIELD_RENDERERS[type] || FIELD_RENDERERS.default;
};


// const DEFAULT_FIELD_RENDERERS = useMemo(() => {
//   return {
//     STATUS: <StatusDisplay row={row} onClick={handleClickField} />,
//     INTERNATION_PHONE: (
//       <InternationalPhoneDisplay
//         value={row?.value}
//         onClick={() => setIsEditing(true)}
//       />
//     ),
//     FORMULA: (
//       <BackendFormulaDisplay
//         value={row?.value}
//         formula={row?.attributes?.formula}
//       />
//     ),
//     MULTISELECT: <MultiSelectDisplay row={row} onClick={handleClickField} />,
//     DATE: (
//       <DateDisplay
//         value={row.value}
//         type={row.type}
//         onClick={handleClickField}
//         placeholder={row.attributes?.placeholder}
//       />
//     ),
//     DATE_TIME: (
//       <DateDisplay
//         value={row.value}
//         type={row.type}
//         onClick={handleClickField}
//         placeholder={row.attributes?.placeholder}
//       />
//     ),
//     DATE_TIME_WITHOUT_TIME_ZONE: (
//       <DateDisplay
//         value={row.value}
//         type={row.type}
//         onClick={handleClickField}
//         placeholder={row.attributes?.placeholder}
//       />
//     ),
//     TIME: (
//       <DateDisplay
//         value={row.value}
//         type={row.type}
//         onClick={handleClickField}
//         placeholder={row.attributes?.placeholder}
//       />
//     ),
//     NUMBER: <NumberDisplay value={row?.value} onClick={handleClickField} />,
//     MULTI_LINE: (
//       <ElementMultiLine
//         row={row}
//         onClick={(e) => handleOpenTextEditor(e, row)}
//       />
//     ),
//     default: (
//       <div style={{ padding: "0 4px" }} onClick={() => setIsEditing(true)}>
//         {row?.value}
//       </div>
//     ),
//   };
// }, [row?.value]);
