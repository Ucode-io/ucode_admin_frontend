import clsx from "clsx";
import cls from "./styles.module.scss";
import { useFormulaFieldProps } from "./useFormulaFieldProps";
import { Box } from "@mui/material";
import { FIELD_TYPES } from "@/utils/constants/fieldTypes";
import DropdownSelect from "@/components/NewFormElements/DropdownSelect";
import FormulaFilters from "../../Attributes/FormulaFilters";
import HFTextField from "@/components/FormElements/HFTextField";
import { FormulaEditor } from "../FormulaEditor";
import { Examples } from "../Examples";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

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
    menuList,
    editorRef,
    onItemMouseEnter,
    exampleType,
    i18n,
    fieldsList,
    editorSearchText,
    setEditorSearchText,
    lastField,
    handleToggleFields,
    openedMenus,
  } = useFormulaFieldProps({
    control,
    mainForm,
    menuItem,
    tableSlug,
    watch,
    setValue,
    fieldType,
  });

  return (
    <Box width="740px">
      {fieldType === FIELD_TYPES.FORMULA ? (
        <Box display="flex" flexDirection="column" rowGap="8px" padding="8px">
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
              />
              <div className="">
                {relation?.map((summary, index) => (
                  <FormulaFilters
                    key={index}
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
            <Box
              paddingX="12px"
              paddingBottom="12px"
              borderBottom="1px solid rgba(84, 72, 49, 0.15)"
            >
              <FormulaEditor
                onChange={(value) => {
                  onEditorChange(value);
                  handleFilterFields(value);
                }}
                ref={editorRef}
                value={editorValue}
                fields={fieldsList}
              />
            </Box>
          </Box>
          <Box display="grid" gridTemplateColumns="230px 1fr" gap="8px">
            <Box
              display="flex"
              flexDirection="column"
              rowGap="4px"
              height="237px"
              overflow="auto"
              padding="6px 4px 2px"
              borderRight="1px solid rgba(84, 72, 49, 0.15)"
            >
              {menuList?.map((menuItem) => (
                <Box key={menuItem?.name}>
                  {menuItem?.list?.filter((item) => {
                    const label =
                      item?.attributes?.[`label_${i18n.language}`] ||
                      item?.label;
                    return label
                      ?.toLowerCase()
                      ?.includes(editorSearchText?.toLowerCase());
                  })?.length ? (
                    <p
                      className={cls.menuTitle}
                      onClick={() => handleToggleFields(menuItem.name)}
                    >
                      <span>{menuItem?.name}</span>
                      <>
                        {openedMenus[menuItem.name] ? (
                          <ExpandLessIcon />
                        ) : (
                          <ExpandMoreIcon />
                        )}
                      </>
                    </p>
                  ) : (
                    ""
                  )}
                  {openedMenus[menuItem.name] && (
                    <Box>
                      {menuItem?.list
                        ?.filter((item) => {
                          const label =
                            item?.attributes?.[`label_${i18n.language}`] ||
                            item?.label;

                          return label
                            ?.toLowerCase()
                            ?.includes(editorSearchText?.toLowerCase());
                        })
                        ?.map((item, index) => (
                          <Box
                            className={clsx(cls.fieldChip, {
                              [cls.active]: item.label === exampleType.label,
                            })}
                            key={item.key + index}
                            onMouseEnter={() => onItemMouseEnter(item)}
                            onClick={() => {
                              let value = editorValue;
                              if (editorSearchText) {
                                value = editorValue?.replace(
                                  editorSearchText,
                                  "",
                                );
                              }
                              if (menuItem.key === "formula") {
                                if (menuItem.name === "Operators") {
                                  onEditorChange(value + " " + item.key + " ");
                                } else if (lastField) {
                                  onEditorChange(value + " " + item.key + "()");
                                } else {
                                  onEditorChange(value + item.key + "()");
                                }
                              } else {
                                onEditorChange(
                                  value +
                                    (item?.attributes?.[
                                      `label_${i18n.language}`
                                    ] || item.label),
                                );
                              }
                              setEditorSearchText("");
                              editorRef.current?.focus();
                            }}
                          >
                            {typeof item.icon === "string" ? (
                              <img
                                src={item.icon}
                                width={"16px"}
                                height={"16px"}
                                alt=""
                              />
                            ) : (
                              <span className={cls.fieldIcon}>{item.icon}</span>
                            )}
                            <span className={cls.fieldName}>
                              {item?.attributes?.[`label_${i18n.language}`] ||
                                item.label}
                            </span>
                          </Box>
                        ))}
                    </Box>
                  )}
                </Box>
              ))}
            </Box>
            <Box maxHeight="237px" overflow="auto">
              <Examples item={exampleType} />
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};
