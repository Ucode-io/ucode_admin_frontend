import cls from "./styles.module.scss";
import HFTextField from "@/components/FormElements/HFTextField";
import { fieldTypeIcons, TranslateIcon } from "@/utils/constants/icons";
import { MultiLangField } from "../MultiLangField";
import { Box, Button } from "@mui/material";
import { useFieldParamsProps } from "./useFieldParamsProps";
import FieldTreeView from "../../FieldTreeView";
import { TreeView } from "@mui/x-tree-view";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import { FIELD_TYPES } from "../../../../../../../utils/constants/fieldTypes";
import { AddOption } from "../AddOption";
import { FieldChip } from "../FieldChip";
import { StatusFieldSettings } from "../StatusFieldSettings";
import { useRef, useState } from "react";
import { Container, Draggable } from "react-smooth-dnd";
import { ParamsHeader } from "../../../components/ParamsHeader";
import { FieldMenuItem } from "../../../components/FieldMenuItem";
import { FieldCheckbox } from "../../../components/FieldCheckbox/FieldCheckbox";
import HFIconPicker from "../../../../../../../components/FormElements/HFIconPicker";
import HFSelect from "../../../../../../../components/FormElements/HFSelect";
import TextFieldWithMultiLanguage from "../../../../../../../components/NewFormElements/TextFieldWithMultiLanguage/TextFieldWithMultiLanguage";
import {
  AutofillIcon,
  ClipboardCheckIcon,
  SettingsIcon,
  TypeIcon,
} from "../../../../../../../utils/constants/icons";
import {
  getColumnIconPath,
  iconsComponents,
} from "../../../../../../table-redesign/icons";
import SVG from "react-inlinesvg";
import { NButton } from "../../../../../../../components/NButton";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/react";

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
  handleUpdateField = () => {},
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
    onDrop,
    functions,
    handleClickLanguage,
    selectedLanguage,
    labelValue,
  } = useFieldParamsProps({ watch, setValue, control, handleUpdateField });

  const [activeId, setActiveId] = useState(null);
  const containerRef = useRef(null);

  console.log(watch(`attributes.todo.options`));

  return (
    <Box ref={containerRef}>
      <ParamsHeader onClose={onClose} formType={formType} />
      <Box className={cls.body}>
        <Box display="flex" flexDirection="column" rowGap="6px">
          <Box display="flex" flexDirection="column" rowGap="8px">
            <Box paddingX="8px">
              <FieldMenuItem
                title="Type"
                icon={<TypeIcon />}
                value={
                  activeType?.[`label_${i18n.language}`] || activeType?.label
                }
                onClick={() => handleSelectSetting(SETTING_TYPES.TYPE)}
              />
            </Box>
            <Box display="flex" columnGap="6px" paddingX="8px">
              {/* <Box className={cls.iconBox}>{fieldTypeIcons[watch("type")]}</Box> */}
              <TextFieldWithMultiLanguage
                control={control}
                name="attributes.label"
                placeholder="Name"
                defaultValue={tableName}
                languages={languages}
                id={"field_label"}
                watch={watch}
                leftContent={
                  <Box className={cls.iconBox}>
                    {/* {iconsComponents[watch("type")]} */}
                    <SVG
                      width="16"
                      height="16"
                      src={getColumnIconPath({
                        column: { type: watch("type") },
                      })}
                    />
                  </Box>
                }
                required
              />
              {/* <MultiLangField
                control={control}
                name="attributes.label"
                fullWidth
                placeholder="Name"
                defaultValue={tableName}
                languages={languages}
                id={"field_label"}
                watch={watch}
                required
              /> */}
            </Box>
            <Box display="flex" columnGap="6px" paddingX="8px">
              {/* <Box className={cls.iconBox}>
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
              </Box> */}
              <HFTextField
                inputStyles={{
                  padding: "6px 14px 6px 32px",
                }}
                wrapperStyles={
                  {
                    // border: "1px solid #EAECF0",
                  }
                }
                className={cls.fieldInput}
                disabledHelperText
                fullWidth
                name="slug"
                control={control}
                placeholder="Field SLUG"
                required
                withTrim
                id={"field_key"}
                startAdornment={
                  <Box position={"absolute"} left={"10px"}>
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
                }
              />
            </Box>
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
          <Box paddingX="8px">
            {activeType?.value === FIELD_TYPES.MULTISELECT && (
              <Box>
                <AddOption onClick={() => toggleCreateOptionField()} />
                <Container
                  lockAxis="y"
                  orientation="vertical"
                  onDrop={(dropResult) =>
                    onDrop(dropResult, "attributes.options")
                  }
                >
                  {multiSelectFields?.map((item, index) => (
                    <Draggable key={item?.key}>
                      <FieldMenuItem
                        containerRef={containerRef}
                        icon={
                          <DragIndicatorIcon
                            htmlColor="#101828"
                            sx={{
                              cursor: "grab",
                              ":active": { cursor: "grabbing" },
                            }}
                          />
                        }
                        isDraggable={true}
                        key={item?.key}
                        id={item?.key}
                        isOpen={activeId === item?.key}
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
                    </Draggable>
                  ))}
                </Container>
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
                      <MultiLangInput
                        key={selectedLanguage}
                        handleClickLanguage={handleClickLanguage}
                        selectedLanguage={selectedLanguage}
                        callback={addTodo}
                        value={labelValue[`label_${selectedLanguage}`]}
                      />
                      {/* <input
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
                      /> */}
                    </Box>
                  )}
                  <Box paddingY="8px">
                    <Container
                      lockAxis="y"
                      orientation="vertical"
                      onDrop={(dropResult) =>
                        onDrop(dropResult, "attributes.todo.options")
                      }
                    >
                      {todoFields?.map((item, index) => (
                        <Draggable key={item?.key}>
                          <FieldMenuItem
                            containerRef={containerRef}
                            icon={
                              <DragIndicatorIcon
                                htmlColor="#101828"
                                sx={{
                                  cursor: "grab",
                                  ":active": { cursor: "grabbing" },
                                }}
                              />
                            }
                            isDraggable={true}
                            key={item?.key}
                            id={item?.key}
                            isOpen={activeId === item?.key}
                            setActiveId={setActiveId}
                            title={
                              <FieldChip
                                value={
                                  watch(
                                    `attributes.todo.options.${index}.label_${i18n.language}`
                                  ) ||
                                  watch(
                                    `attributes.todo.options.${index}.label`
                                  )
                                }
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
                                isMultiLanguage
                                languages={languages}
                              />
                            }
                          />
                        </Draggable>
                      ))}
                    </Container>
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
                    <Container
                      lockAxis="y"
                      orientation="vertical"
                      onDrop={(dropResult) =>
                        onDrop(dropResult, "attributes.progress.options")
                      }
                    >
                      {progressFields?.map((item, index) => (
                        <Draggable key={item?.key}>
                          <FieldMenuItem
                            containerRef={containerRef}
                            icon={
                              <DragIndicatorIcon
                                htmlColor="#101828"
                                sx={{
                                  cursor: "grab",
                                  ":active": { cursor: "grabbing" },
                                }}
                              />
                            }
                            isDraggable={true}
                            key={item?.key}
                            id={item?.key}
                            isOpen={activeId === item?.key}
                            setActiveId={setActiveId}
                            title={
                              <FieldChip
                                value={
                                  watch(
                                    `attributes.progress.options.${index}.label_${i18n.language}`
                                  ) ||
                                  watch(
                                    `attributes.progress.options.${index}.label`
                                  )
                                }
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
                                isMultiLanguage
                                languages={languages}
                              />
                            }
                          />
                        </Draggable>
                      ))}
                    </Container>
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
                    <Container
                      lockAxis="y"
                      orientation="vertical"
                      onDrop={(dropResult) =>
                        onDrop(dropResult, "attributes.complete.options")
                      }
                    >
                      {completeFields?.map((item, index) => (
                        <Draggable key={item?.key}>
                          <FieldMenuItem
                            containerRef={containerRef}
                            icon={
                              <DragIndicatorIcon
                                htmlColor="#101828"
                                sx={{
                                  cursor: "grab",
                                  ":active": { cursor: "grabbing" },
                                }}
                              />
                            }
                            isDraggable={true}
                            key={item?.key}
                            id={item?.key}
                            isOpen={activeId === item?.key}
                            setActiveId={setActiveId}
                            title={
                              <FieldChip
                                value={
                                  watch(
                                    `attributes.complete.options.${index}.label_${i18n.language}`
                                  ) ||
                                  watch(
                                    `attributes.complete.options.${index}.label`
                                  )
                                }
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
                                isMultiLanguage
                                languages={languages}
                              />
                            }
                          />
                        </Draggable>
                      ))}
                    </Container>
                  </Box>
                </Box>
              </>
            )}
            {activeType?.value === FIELD_TYPES.BUTTON && (
              <Box
                display="flex"
                flexDirection="column"
                paddingX="8px"
                gap="8px"
              >
                <HFSelect
                  placeholder="Function"
                  required={true}
                  options={functions}
                  control={control}
                  name="attributes.function"
                />
                <HFIconPicker
                  required={true}
                  control={control}
                  name="attributes.icon"
                  placeholder="Icon"
                />
              </Box>
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
              {(activeType?.value === FIELD_TYPES.SINGLE_LINE ||
                activeType?.value === FIELD_TYPES.MULTI_LINE) &&
                formType === "CREATE" && (
                  <Box>
                    <FieldCheckbox
                      watch={watch}
                      setValue={setValue}
                      register={register}
                      name={"enable_multilanguage"}
                      label={"Multiple language"}
                    />
                  </Box>
                )}
            </Box>
            <FieldMenuItem
              onClick={() => handleSelectSetting(SETTING_TYPES.VALIDATION)}
              title="Validation"
              icon={
                <ClipboardCheckIcon />
                // <svg
                //   xmlns="http://www.w3.org/2000/svg"
                //   width="16"
                //   height="16"
                //   fill="none"
                // >
                //   <g clip-path="url(#a)">
                //     <path
                //       stroke="#101828"
                //       stroke-linecap="round"
                //       stroke-linejoin="round"
                //       stroke-width="1.2"
                //       d="M14.667 7.39v.614a6.667 6.667 0 1 1-3.954-6.093m3.954.756L8 9.34l-2-2"
                //     />
                //   </g>
                //   <defs>
                //     <clipPath id="a">
                //       <path fill="#fff" d="M0 0h16v16H0z" />
                //     </clipPath>
                //   </defs>
                // </svg>
              }
            />
            <FieldMenuItem
              onClick={() => handleSelectSetting(SETTING_TYPES.AUTO_FILL)}
              title="Autofill"
              icon={
                <AutofillIcon />
                // <svg
                //   xmlns="http://www.w3.org/2000/svg"
                //   width="16"
                //   height="16"
                //   fill="none"
                // >
                //   <path
                //     stroke="#101828"
                //     stroke-linecap="round"
                //     stroke-linejoin="round"
                //     stroke-width="1.2"
                //     d="M13.333 8.334v-3.8c0-1.12 0-1.68-.218-2.108a2 2 0 0 0-.874-.875c-.427-.218-.987-.218-2.108-.218H5.867c-1.12 0-1.68 0-2.108.218a2 2 0 0 0-.874.875c-.218.427-.218.987-.218 2.107v6.934c0 1.12 0 1.68.218 2.108a2 2 0 0 0 .874.874c.428.218.988.218 2.108.218H8m1.333-7.333h-4M6.667 10H5.333m5.334-5.333H5.333m4.334 8L11 14l3-3"
                //   />
                // </svg>
              }
            />
            {/* <FieldMenuItem
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
            /> */}
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
            {(activeType?.value === FIELD_TYPES.MAP ||
              activeType?.value === FIELD_TYPES.POLYGON ||
              activeType?.value === FIELD_TYPES.FORMULA ||
              activeType?.value === FIELD_TYPES.FORMULA_FRONTEND ||
              activeType?.value === FIELD_TYPES.INCREMENT_ID) && (
              <FieldMenuItem
                title="Field"
                icon={
                  <SettingsIcon />
                  // <svg
                  //   xmlns="http://www.w3.org/2000/svg"
                  //   width="16"
                  //   height="16"
                  //   viewBox="0 0 24 24"
                  // >
                  //   <path
                  //     fill="#101828"
                  //     d="M14.25 21.95q-.475.125-.862-.162T13 21v-5q0-.5.388-.788t.887-.162q.925.25 1.85.35t1.875.1 1.888-.1 1.862-.35q.475-.125.863.163T23 16v5q0 .5-.387.788t-.863.162q-.925-.25-1.862-.35T18 21.5t-1.888.1-1.862.35M11 22h-.875q-.375 0-.65-.25t-.325-.625l-.3-2.275q-.325-.125-.612-.3t-.563-.375l-1.55.65q-.625.275-1.25.05t-.975-.8l-1.175-2.05q-.35-.575-.2-1.225t.675-1.075l1.325-1q-.025-.175-.025-.337v-.676q0-.162.025-.337l-1.325-1Q2.675 9.95 2.525 9.3t.2-1.225L3.9 6.025q.35-.575.975-.8t1.25.05l1.55.65q.275-.2.575-.375t.6-.3l.2-1.65q.075-.675.575-1.113T10.8 2.05h2.4q.675 0 1.175.438T14.95 3.6l.2 1.65q.325.125.613.3t.562.375l1.5-.65q.625-.275 1.263-.05t.987.8l1.175 2.05q.35.575.213 1.225t-.663 1.075l-1.325.95q.025.175.025.325v.325q0 .425-.312.725t-.763.3q-.4 0-.663-.3t-.262-.725q0-.375-.05-.75t-.175-.75l2.15-1.625-.975-1.7-2.475 1.05q-.55-.575-1.213-.962t-1.437-.588L13 4h-1.975l-.35 2.65q-.775.2-1.437.588t-1.213.937L5.55 7.15l-.975 1.7 2.15 1.6q-.125.375-.175.75t-.05.8q0 .4.05.775t.175.75l-2.15 1.625.975 1.7 2.475-1.05q.6.625 1.35 1.05T11 17.4zm1.05-13.5q1.4 0 2.4.95t1.1 2.35q.05.5-.238.888t-.787.412q-.425.025-.737-.262t-.263-.713q.1-.65-.35-1.137T12.05 10.5q-.625 0-1.062.438T10.55 12q0 .35.138.638t.387.487q.275.25.25.638t-.325.662q-.35.3-.812.263T9.4 14.3q-.45-.45-.65-1.05T8.55 12q0-1.475 1.025-2.488T12.05 8.5"
                  //   />
                  // </svg>
                }
                onClick={() => handleSelectSetting(SETTING_TYPES.FIELD)}
              />
            )}
          </Box>
        </Box>
      </Box>
      <Box padding="8px" display="flex" justifyContent="flex-end">
        <NButton primary onClick={handleSubmit(onSubmit)}>
          Save
        </NButton>
      </Box>
    </Box>
  );
};

const MultiLangInput = ({
  handleClickLanguage,
  selectedLanguage,
  callback,
  value,
}) => {
  const [innerValue, setInnerValue] = useState("");
  return (
    <InputGroup>
      <Input
        className={cls.addInput}
        onChange={(e) => setInnerValue(e.target.value)}
        onKeyDown={(e) => {
          const value = e.target.value;
          if (e.key === "Enter" && value?.trim()) {
            callback(value);
            e.target.value = "";
          }
        }}
        type="text"
        defaultValue={value}
        autoFocus
      />
      <InputRightElement
        sx={{
          right: "10px",
          top: "50%",
          transform: "translateY(-50%)",
        }}
      >
        <button
          className={cls.languageBtn}
          type="button"
          onClick={() => {
            handleClickLanguage(innerValue);
          }}
        >
          <span className={cls.languageBtnInner}>
            <TranslateIcon />
            <span>{selectedLanguage}</span>
          </span>
        </button>
      </InputRightElement>
    </InputGroup>
  );
};
