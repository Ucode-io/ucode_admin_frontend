import cls from "./styles.module.scss";
import HFTextField from "@/components/FormElements/HFTextField";
import { fieldTypeIcons } from "@/utils/constants/icons";
import { CloseButton } from "../CloseButton";
import { FieldMenuItem } from "../FieldMenuItem";
import { MultiLangField } from "../MultiLangField";
import { Box, Button, Chip } from "@mui/material";
import { FieldCheckbox } from "../FieldCheckbox";
import { useFieldParamsProps } from "./useFieldParamsProps";
import FieldTreeView from "../../FieldTreeView";
import { TreeView } from "@mui/x-tree-view";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { FIELD_TYPES } from "../../../../../../../utils/constants/fieldTypes";
import { AddOption } from "../AddOption";
import { FieldChip } from "../FieldChip";
import { StatusFieldSettings } from "../StatusFieldSettings";
import { useState } from "react";

export const FieldParams = ({
  tableName = "",
  control = {},
  languages = [],
  SETTING_TYPES = {},
  formType,
  onClose = () => {},
  watch = () => {},
  setValue = () => {},
  register = () => {},
  handleSelectSetting = () => {},
  handleSubmit = () => {},
  onSubmit = () => {},
}) => {
  const {
    i18n,
    mediaTypes,
    activeType,
    backetOptions,
    check,
    folder,
    setCheck,
    handleSelect,
    addNewOption,
    multiSelectFields,
    hasColor,
    hasIcon,
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
  } = useFieldParamsProps({ watch, setValue, control });

  const [activeId, setActiveId] = useState(null);

  console.log(activeId);

  return (
    <Box>
      <Box className={cls.header}>
        <p className={cls.title}>
          {formType === "CREATE" ? "Create field" : "Edit fields"}
        </p>
        <CloseButton onClick={onClose} />
      </Box>
      <Box className={cls.body}>
        <Box display="flex" flexDirection="column" rowGap="8px">
          <Box display="flex" columnGap="6px" paddingX="8px">
            <Box className={cls.iconBox}>{fieldTypeIcons[watch("type")]}</Box>
            <MultiLangField
              control={control}
              name="attributes.label"
              fullWidth
              placeholder="Name"
              defaultValue={tableName}
              languages={languages}
              id={"field_label"}
            />
          </Box>
          <Box display="flex" columnGap="6px" paddingX="8px">
            <Box className={cls.iconBox}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11.3333 5.99996C11.3333 5.65874 11.2031 5.31753 10.9428 5.05719C10.6825 4.79684 10.3412 4.66667 10 4.66667M10 10C12.2091 10 14 8.20914 14 6C14 3.79086 12.2091 2 10 2C7.79086 2 6 3.79086 6 6C6 6.18245 6.01222 6.36205 6.03587 6.53802C6.07478 6.82745 6.09424 6.97217 6.08114 7.06373C6.0675 7.1591 6.05013 7.2105 6.00313 7.2946C5.958 7.37533 5.87847 7.45486 5.71942 7.61391L2.31242 11.0209C2.19712 11.1362 2.13947 11.1939 2.09824 11.2611C2.06169 11.3208 2.03475 11.3858 2.01842 11.4538C2 11.5306 2 11.6121 2 11.7752V12.9333C2 13.3067 2 13.4934 2.07266 13.636C2.13658 13.7614 2.23856 13.8634 2.36401 13.9273C2.50661 14 2.6933 14 3.06667 14H4.66667V12.6667H6V11.3333H7.33333L8.38609 10.2806C8.54514 10.1215 8.62467 10.042 8.7054 9.99687C8.7895 9.94987 8.8409 9.9325 8.93627 9.91886C9.02783 9.90576 9.17255 9.92522 9.46198 9.96413C9.63795 9.98778 9.81755 10 10 10Z"
                  stroke="#101828"
                  stroke-width="1.2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </Box>
            <HFTextField
              className={cls.input}
              disabledHelperText
              fullWidth
              name="slug"
              control={control}
              placeholder="Field SLUG"
              required
              withTrim
              id={"field_key"}
            />
          </Box>
          {mediaTypes.includes(watch("type")) && (
            <Box paddingX="8px">
              <TreeView
                className={cls.treeView}
                defaultCollapseIcon={<ExpandMoreIcon />}
                defaultExpandIcon={<ChevronRightIcon />}
                defaultSelected={folder}
                onNodeSelect={handleSelect}
              >
                {backetOptions?.map((item) => (
                  <FieldTreeView
                    element={item}
                    setCheck={setCheck}
                    check={check}
                    folder={folder}
                    collapseIcon={
                      <svg
                        width="10"
                        height="6"
                        viewBox="0 0 10 6"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M1 1L5 5L9 1"
                          stroke="#D0D5DD"
                          stroke-width="1.3"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    }
                    expandIcon={
                      <svg
                        width="10"
                        height="6"
                        viewBox="0 0 10 6"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M1 1L5 5L9 1"
                          stroke="#D0D5DD"
                          stroke-width="1.3"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    }
                    itemStyles={{
                      "& .MuiTreeItem-content.Mui-selected": {
                        backgroundColor: "#fff",
                        color: "#101828",
                        padding: "8.5px 14px",
                        "&:hover": {
                          backgroundColor: "rgba(243, 243, 243, 0.5)",
                        },
                      },
                      "& .MuiTreeItem-content": {
                        // color: "#EAECF0",
                        padding: "8.5px 14px",
                        flexDirection: "row-reverse",
                      },
                    }}
                  />
                ))}
              </TreeView>
            </Box>
          )}
          <Box>
            <Box>
              <FieldMenuItem
                title="Type"
                icon={
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1.33325 9.66687L7.7614 12.8809C7.84886 12.9247 7.89259 12.9465 7.93845 12.9551C7.97908 12.9628 8.02076 12.9628 8.06139 12.9551C8.10725 12.9465 8.15098 12.9247 8.23843 12.8809L14.6666 9.66687M1.33325 6.33354L7.7614 3.11946C7.84886 3.07574 7.89259 3.05387 7.93845 3.04527C7.97908 3.03765 8.02076 3.03765 8.06139 3.04527C8.10725 3.05387 8.15098 3.07574 8.23843 3.11946L14.6666 6.33354L8.23843 9.54762C8.15098 9.59134 8.10725 9.61321 8.06139 9.62181C8.02076 9.62943 7.97908 9.62943 7.93845 9.62181C7.89259 9.61321 7.84886 9.59134 7.7614 9.54762L1.33325 6.33354Z"
                      stroke="#101828"
                      stroke-width="1.2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                }
                value={
                  activeType?.[`label_${i18n.language}`] || activeType?.label
                }
                onClick={() => handleSelectSetting(SETTING_TYPES.TYPE)}
              />
            </Box>
            {activeType?.value === FIELD_TYPES.MULTISELECT && (
              <Box>
                <AddOption onClick={() => toggleCreateOptionField()} />
                {multiSelectFields?.map((item, index) => (
                  <FieldMenuItem
                    key={item?.key}
                    id={index}
                    isOpen={activeId === index}
                    setActiveId={setActiveId}
                    title={
                      hasColor ? (
                        <FieldChip
                          value={watch(`attributes.options.${index}.value`)}
                          color={watch(`attributes.options.${index}.color`)}
                        />
                      ) : (
                        item?.value
                      )
                    }
                    value={hasColor ? item?.colorName : ""}
                    content={
                      <StatusFieldSettings
                        item={item}
                        index={index}
                        type={activeType?.value}
                        remove={multiSelectRemove}
                        control={control}
                        name={`attributes.options.${index}`}
                        setValue={setValue}
                        colors={colors}
                        hasColor={hasColor}
                        watch={watch}
                        setActiveId={setActiveId}
                      />
                    }
                  />
                ))}
                {isCreateOptionOpen && (
                  <Box marginTop="8px">
                    <input
                      className={cls.addInput}
                      onKeyDown={(e) => {
                        const value = e.target.value;
                        if (e.key === "Enter" && value?.trim()) {
                          addNewOption(value);
                          e.target.value = "";
                        }
                      }}
                      type="text"
                      autoFocus
                    />
                  </Box>
                )}
              </Box>
            )}
            {activeType?.value === FIELD_TYPES.STATUS && (
              <>
                <Box marginTop="8px">
                  <AddOption
                    label="Todo"
                    onClick={() => toggleTodoOptionField()}
                  />
                  {isTodoOptionOpen && (
                    <Box marginTop="8px">
                      <input
                        className={cls.addInput}
                        onKeyDown={(e) => {
                          const value = e.target.value;
                          if (e.key === "Enter" && value?.trim()) {
                            addTodo(value);
                            e.target.value = "";
                          }
                        }}
                        type="text"
                        autoFocus
                      />
                    </Box>
                  )}
                  <Box paddingY="8px">
                    {todoFields?.map((item, index) => (
                      <FieldMenuItem
                        key={item?.key}
                        id={item?.key}
                        isOpen={activeId === item?.key}
                        setActiveId={setActiveId}
                        title={
                          <FieldChip
                            value={watch(
                              `attributes.todo.options.${index}.label`
                            )}
                            color={watch(
                              `attributes.todo.options.${index}.color`
                            )}
                          />
                        }
                        value={item?.colorName}
                        content={
                          <StatusFieldSettings
                            item={item}
                            index={index}
                            type={activeType?.value}
                            remove={todoRemove}
                            control={control}
                            name={`attributes.todo.options.${index}`}
                            optionName={"label"}
                            setValue={setValue}
                            colors={colors}
                            hasColor={true}
                            watch={watch}
                            setActiveId={setActiveId}
                            group="Todo"
                          />
                        }
                      />
                    ))}
                  </Box>
                </Box>
                <Box>
                  <AddOption
                    label="Progress"
                    onClick={() => toggleProgressOptionField()}
                  />
                  {isProgressOptionOpen && (
                    <Box marginTop="8px">
                      <input
                        className={cls.addInput}
                        onKeyDown={(e) => {
                          const value = e.target.value;
                          if (e.key === "Enter" && value?.trim()) {
                            addProgress(value);
                            e.target.value = "";
                          }
                        }}
                        type="text"
                        autoFocus
                      />
                    </Box>
                  )}
                  <Box paddingY="8px">
                    {progressFields?.map((item, index) => (
                      <FieldMenuItem
                        key={item?.key}
                        id={item?.key}
                        isOpen={activeId === item?.key}
                        setActiveId={setActiveId}
                        title={
                          <FieldChip
                            value={watch(
                              `attributes.progress.options.${index}.label`
                            )}
                            color={watch(
                              `attributes.progress.options.${index}.color`
                            )}
                          />
                        }
                        value={item?.colorName}
                        content={
                          <StatusFieldSettings
                            item={item}
                            index={index}
                            type={activeType?.value}
                            remove={progressRemove}
                            control={control}
                            name={`attributes.progress.options.${index}`}
                            optionName={"label"}
                            setValue={setValue}
                            colors={colors}
                            hasColor={true}
                            watch={watch}
                            setActiveId={setActiveId}
                            group="Progress"
                          />
                        }
                      />
                    ))}
                  </Box>
                </Box>
                <Box>
                  <AddOption
                    label="Complete"
                    onClick={() => toggleCompleteOptionField()}
                  />
                  {isCompleteOptionOpen && (
                    <Box marginTop="8px">
                      <input
                        className={cls.addInput}
                        onKeyDown={(e) => {
                          const value = e.target.value;
                          if (e.key === "Enter" && value?.trim()) {
                            addComplete(value);
                            e.target.value = "";
                          }
                        }}
                        type="text"
                        autoFocus
                      />
                    </Box>
                  )}
                  <Box paddingY="8px">
                    {completeFields?.map((item, index) => (
                      <FieldMenuItem
                        key={item?.key}
                        id={item?.key}
                        isOpen={activeId === item?.key}
                        setActiveId={setActiveId}
                        title={
                          <FieldChip
                            value={watch(
                              `attributes.complete.options.${index}.label`
                            )}
                            color={watch(
                              `attributes.complete.options.${index}.color`
                            )}
                          />
                        }
                        value={item?.colorName}
                        content={
                          <StatusFieldSettings
                            item={item}
                            index={index}
                            type={activeType?.value}
                            remove={completeRemove}
                            control={control}
                            name={`attributes.complete.options.${index}`}
                            optionName={"label"}
                            setValue={setValue}
                            colors={colors}
                            hasColor={true}
                            watch={watch}
                            setActiveId={setActiveId}
                            group="Complete"
                          />
                        }
                      />
                    ))}
                  </Box>
                </Box>
              </>
            )}
            <Box display="flex" flexDirection="column">
              {activeType?.value === FIELD_TYPES.MULTISELECT && (
                <>
                  <Box>
                    <FieldCheckbox
                      watch={watch}
                      setValue={setValue}
                      register={register}
                      name={"attributes.has_color"}
                      label={"Color"}
                    />
                  </Box>
                  <Box>
                    <FieldCheckbox
                      watch={watch}
                      setValue={setValue}
                      register={register}
                      name={"attributes.is_multiselect"}
                      label={"Multiselect"}
                    />
                  </Box>
                </>
              )}
              <Box>
                <FieldCheckbox
                  watch={watch}
                  setValue={setValue}
                  register={register}
                  name={"attributes.enable_multilanguage"}
                  label={"Multiple language"}
                />
              </Box>
            </Box>
            <Box>
              <FieldMenuItem
                onClick={() => handleSelectSetting(SETTING_TYPES.VALIDATION)}
                title="Validation"
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="none"
                  >
                    <g clip-path="url(#a)">
                      <path
                        stroke="#101828"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="1.2"
                        d="M14.667 7.39v.614a6.667 6.667 0 1 1-3.954-6.093m3.954.756L8 9.34l-2-2"
                      />
                    </g>
                    <defs>
                      <clipPath id="a">
                        <path fill="#fff" d="M0 0h16v16H0z" />
                      </clipPath>
                    </defs>
                  </svg>
                }
              />
            </Box>
            <Box>
              <FieldMenuItem
                onClick={() => handleSelectSetting(SETTING_TYPES.AUTO_FILL)}
                title="Autofill"
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="none"
                  >
                    <path
                      stroke="#101828"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="1.2"
                      d="M13.333 8.334v-3.8c0-1.12 0-1.68-.218-2.108a2 2 0 0 0-.874-.875c-.427-.218-.987-.218-2.108-.218H5.867c-1.12 0-1.68 0-2.108.218a2 2 0 0 0-.874.875c-.218.427-.218.987-.218 2.107v6.934c0 1.12 0 1.68.218 2.108a2 2 0 0 0 .874.874c.428.218.988.218 2.108.218H8m1.333-7.333h-4M6.667 10H5.333m5.334-5.333H5.333m4.334 8L11 14l3-3"
                    />
                  </svg>
                }
              />
            </Box>
            <Box>
              <FieldMenuItem
                onClick={() => handleSelectSetting(SETTING_TYPES.AUTO_FILTER)}
                title="Auto Filter"
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="none"
                  >
                    <path
                      stroke="#101828"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="1.2"
                      d="M2.257 3.778c-.504-.564-.756-.845-.766-1.085a.667.667 0 0 1 .242-.54C1.918 2 2.296 2 3.053 2h9.895c.756 0 1.134 0 1.319.153.16.132.25.332.241.54-.01.24-.261.521-.765 1.085L9.938 8.03c-.1.112-.15.168-.186.232a.667.667 0 0 0-.07.181c-.015.072-.015.147-.015.298v3.565c0 .13 0 .195-.021.252a.334.334 0 0 1-.089.13c-.044.04-.105.064-.226.113l-2.266.906c-.245.098-.368.147-.466.127a.334.334 0 0 1-.21-.142c-.056-.084-.056-.216-.056-.48V8.741c0-.15 0-.226-.016-.298a.667.667 0 0 0-.069-.18c-.036-.065-.086-.121-.187-.233L2.257 3.778Z"
                    />
                  </svg>
                }
              />
            </Box>
            <Box>
              <FieldMenuItem
                onClick={() => handleSelectSetting(SETTING_TYPES.FIELD_HIDE)}
                title="Field Hide"
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="none"
                  >
                    <path
                      stroke="#101828"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="1.2"
                      d="M7.162 3.395c.27-.04.55-.062.838-.062 3.404 0 5.637 3.004 6.387 4.192.09.143.136.215.162.326a.784.784 0 0 1 0 .298c-.026.11-.071.183-.163.328-.2.316-.505.761-.908 1.243M4.483 4.477c-1.441.977-2.42 2.336-2.869 3.047-.091.144-.137.216-.162.327a.782.782 0 0 0 0 .298c.025.11.07.183.161.326.75 1.188 2.984 4.192 6.387 4.192 1.373 0 2.555-.489 3.526-1.15M2 2l12 12M6.586 6.586a2 2 0 0 0 2.828 2.828"
                    />
                  </svg>
                }
              />
            </Box>
          </Box>
        </Box>
      </Box>
      <Button
        fullWidth
        sx={{ marginTop: "8px", lineHeight: "20px", height: "36px" }}
        size="medium"
        variant="contained"
        onClick={handleSubmit(onSubmit)}
      >
        Save
      </Button>
    </Box>
  );
};
