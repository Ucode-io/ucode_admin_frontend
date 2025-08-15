import clsx from "clsx";
import cls from "./styles.module.scss";
import SearchIcon from "@mui/icons-material/Search";
import { useFormulaFieldProps } from "./useFormulaFieldProps";
import { Box } from "@mui/material";
import { FIELD_TYPES } from "@/utils/constants/fieldTypes";
import DropdownSelect from "@/components/NewFormElements/DropdownSelect";
import FormulaFilters from "../../Attributes/FormulaFilters";
import HFTextField from "@/components/FormElements/HFTextField";
import { generateLangaugeText } from "@/utils/generateLanguageText";
import { math } from "@/utils/constants/fieldTypes";
import { getColumnIconPath } from "../../../../../../table-redesign/icons";
import { SearchInput } from "../../../components/SearchInput";
import { FormulaEditor } from "../FormulaEditor";

export const FormulaField = ({
  control,
  mainForm,
  fieldType,
  menuItem,
  tableSlug,
  setValue,
  watch = () => {},
}) => {
  const {
    formulaTypes,
    fieldsList,
    computedTables,
    fields,
    selectedTableSlug,
    relation,
    addNewSummary,
    deleteSummary,
    type,
    i18n,
    tableLan,
    mathType,
    handleSearch,
    // search,
    // code,
    // handleChange,
    // showSuggestions,
    // filteredSuggestions,
    // handleSuggestionClick,
    // textareaRef,
    // mirrorRef,
  } = useFormulaFieldProps({ control, mainForm, menuItem, tableSlug, watch });

  return (
    <Box maxWidth="740px" width="100%">
      {fieldType === FIELD_TYPES.FORMULA ? (
        <Box display="flex" flexDirection="column" rowGap="8px">
          <DropdownSelect
            name="attributes.type"
            control={control}
            options={formulaTypes}
            placeholder="Formula type"
          />
          {(type === "SUMM" || type === "MAX" || type === "AVG") && (
            <Box display="flex" flexDirection="column" rowGap="8px">
              <DropdownSelect
                name="attributes.table_from"
                control={control}
                options={computedTables}
                placeholder="Table from"
              />
              <DropdownSelect
                name="attributes.sum_field"
                placeholder="Field from"
                control={control}
                options={fields}
              />
              <HFTextField
                name="attributes.number_of_rounds"
                type="number"
                placeholder="Rounds"
                fullWidth
                control={control}
                options={fields}
              />
              <div className="">
                {relation?.map((summary, index) => (
                  <FormulaFilters
                    summary={summary}
                    selectedTableSlug={selectedTableSlug}
                    index={index}
                    control={control}
                    deleteSummary={deleteSummary}
                  />
                ))}
                <div className={cls.summaryButton} onClick={addNewSummary}>
                  <button type="button">+ Create new</button>
                </div>
              </div>
            </Box>
          )}
        </Box>
      ) : (
        <Box>
          {/* <Box className={cls.formula}>
            <DropdownSelect
              className={cls.input}
              disabledHelperText
              options={fields}
              name="attributes.from_formula"
              control={control}
              fullWidth
              id="variable"
              required
              placeholder={
                generateLangaugeText(
                  tableLan,
                  i18n?.language,
                  "Select variable"
                ) || "Select variable"
              }
            />
            <span
              id={`math_plus`}
              className={clsx(cls.math, cls[`math_${mathType?.label}`])}
              onClick={() => {
                const nextItemIndex = math?.findIndex(
                  (item) => item.value === mathType?.value
                );
                if (nextItemIndex < math.length - 1) {
                  setValue("attributes.math", math[nextItemIndex + 1]);
                } else {
                  setValue("attributes.math", math[0]);
                }
              }}
            >
              <span>{mathType?.value}</span>
            </span>
            <DropdownSelect
              className={cls.input}
              disabledHelperText
              options={fields}
              id="variable_second"
              name="attributes.to_formula"
              control={control}
              fullWidth
              required
              placeholder={
                generateLangaugeText(
                  tableLan,
                  i18n?.language,
                  "Select variable"
                ) || "Select variable"
              }
            />
          </Box> */}
          <Box className={cls.suggestionsContainer}>
            <div
              // ref={mirrorRef}
              style={{
                visibility: "hidden",
                position: "absolute",
                zIndex: -1,
                pointerEvents: "none",
              }}
            />
            <FormulaEditor />

            {/* <textarea
              className={cls.textArea}
              ref={textareaRef}
              disabledHelperText
              id="formula_textarea"
              required
              placeholder={
                generateLangaugeText(
                  tableLan,
                  i18n?.language,
                  "Write or tick  formula"
                ) || "Write or tick  formula"
              }
              value={code}
              onChange={(e) => {
                handleChange(e);
                setValue("attributes.formula", e.target.value);
              }}
            />
            {showSuggestions && (
              <ul
                className={cls.suggestions}
                style={{
                  top: `${Math.ceil(textareaRef.current?.value?.length / 35) * 25}px`,
                }}
              >
                {filteredSuggestions.map((s, i) => (
                  <li
                    key={i}
                    onClick={() => handleSuggestionClick(s?.slug)}
                    className={cls.suggestion}
                  >
                    <img
                      src={getColumnIconPath({ column: s })}
                      width={"12px"}
                      height={"12px"}
                      alt=""
                    />
                    {s?.slug}
                  </li>
                ))}
              </ul>
            )} */}
            {/* <HFTextArea
              className={cls.input}
              disabledHelperText
              name="attributes.formula"
              control={control}
              fullWidth
              id="formula_textarea"
              required
              placeholder={
                generateLangaugeText(
                  tableLan,
                  i18n?.language,
                  "Write or tick  formula"
                ) || "Write or tick  formula"
              }
            /> */}
          </Box>
          {/* <h2 className={cls.fieldHeading}>
            {generateLangaugeText(tableLan, i18n?.language, "Fields list") ||
              "Fields list"}
            :
          </h2> */}
          {/* <Box marginBottom="8px" marginTop="12px">
            <SearchInput onChange={handleSearch} />
          </Box>
          <Box display="flex" gap="8px" flexWrap="wrap">
            {fieldsList.map((field) => (
              <Box
                className={cls.fieldChip}
                key={field.slug}
                onClick={() => {
                  const newValue = watch("attributes.formula") + field.slug;
                  // handleChange({ target: { value: newValue } });
                  setValue(newValue);
                }}
              >
                <img
                  src={getColumnIconPath({ column: field })}
                  width={"16px"}
                  height={"16px"}
                  alt=""
                />
                <span>{field.label}</span>
              </Box>
            ))}
          </Box> */}
          {/* {fieldsList.map((field) => (
          <div>
            {field.label} - <strong>{field.slug}</strong>{" "}
          </div>
        ))} */}
        </Box>
      )}
    </Box>
  );
};
