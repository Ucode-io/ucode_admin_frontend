import React, {useEffect, useMemo, useState} from "react";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import useTabRouter from "../../../hooks/useTabRouter";
import {useQueryClient} from "react-query";
import {useDispatch, useSelector} from "react-redux";
import {store} from "../../../store";
import {useTranslation} from "react-i18next";
import layoutService from "../../../services/layoutService";
import constructorObjectService from "../../../services/constructorObjectService";
import {Controller, useForm, useWatch} from "react-hook-form";
import {sortSections} from "../../../utils/sectionsOrderNumber";
import {
  Box,
  IconButton,
  InputAdornment,
  Popover,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import {Tab, TabList, TabPanel, Tabs} from "react-tabs";
import {Input} from "@chakra-ui/react";
import {getColumnIcon} from "../../table-redesign/icons";
import RelationField from "./ElementGenerator/RelationField";
import HFTextEditor from "../../../components/FormElements/HFTextEditor";
import {
  HFDateDatePickerWithoutTimeZoneTableField,
  HFDatePickerField,
  HFDateTimePickerField,
  HFTimePickerField,
} from "./ElementGenerator/hf-datePickers";
import HFSwitch from "../../table-redesign/hf-switch";
import {HFVideoUpload} from "./ElementGenerator/hf-videoUploadField";
import HFCheckbox from "./ElementGenerator/hf-checkboxField";
import HFStatusField from "./ElementGenerator/hf-statusField";
import HFMultipleAutocomplete from "./ElementGenerator/hf-multiselectField";
import HFPhotoUpload from "../../../components/FormElements/HFPhotoUpload";
import HFMultiImage from "../../../components/FormElements/HFMultiImage";
import HFLinkField from "../../../components/FormElements/HFLinkField";
import {NumericFormat} from "react-number-format";
import HFFileUpload from "../../../components/FormElements/HFFileUpload";
import HFMoneyField from "./ElementGenerator/hf-moneyField";
import HFModalMap from "../../../components/FormElements/HFModalMap";
import PolygonFieldTable from "../../../components/ElementGenerators/PolygonFieldTable";
import HFIconPicker from "./ElementGenerator/hf-iconPicker";
import HFColorPicker from "./ElementGenerator/hf-colorPicker";
import useDebouncedWatch from "../../../hooks/useDebouncedWatch";
import {numberWithSpaces} from "../../../utils/formatNumbers";
import FunctionsIcon from "@mui/icons-material/Functions";
import {Parser} from "hot-formula-parser";

function DrawerFormDetailPage({
  tableSlugFromProps,
  selectedRow,
  control,
  watch,
  reset,
}) {
  const {id: idFromParam, tableSlug: tableSlugFromParam, appId} = useParams();

  const id = useMemo(() => {
    return idFromParam ?? selectedRow?.guid;
  }, [idFromParam, selectedRow]);

  const tableSlug = useMemo(() => {
    return tableSlugFromProps || tableSlugFromParam;
  }, [tableSlugFromParam, tableSlugFromProps]);

  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const [loader, setLoader] = useState(true);
  const [sections, setSections] = useState([]);
  const [tableRelations, setTableRelations] = useState([]);
  const [summary, setSummary] = useState([]);
  const [selectedTab, setSelectTab] = useState();
  const {i18n} = useTranslation();
  const [layout, setLayout] = useState({});
  const [data, setData] = useState({});
  const [searchParams, setSearchParams] = useSearchParams();
  const menuId = searchParams.get("menuId");

  const getAllData = async () => {
    setLoader(true);
    const getLayout = layoutService.getLayout(tableSlug, menuId, {
      "table-slug": tableSlug,
      language_setting: i18n?.language,
    });
    const getFormData = constructorObjectService.getById(tableSlug, id);

    try {
      const [{data = {}}, layout] = await Promise.all([getFormData, getLayout]);

      const layout1 = {
        ...layout,
        tabs: layout?.tabs?.filter(
          (tab) =>
            tab?.relation?.permission?.view_permission === true ||
            tab?.type === "section"
        ),
      };
      const layout2 = {
        ...layout1,
        tabs: layout1?.tabs?.map((tab) => {
          return {
            ...tab,
            sections: tab?.sections?.map((section) => {
              return {
                ...section,
                fields: section?.fields?.map((field) => {
                  if (field?.is_visible_layout === undefined) {
                    return {
                      ...field,
                      is_visible_layout: true,
                    };
                  } else {
                    return field;
                  }
                }),
              };
            }),
          };
        }),
      };
      setData(layout2);
      setSections(sortSections(sections));
      setSummary(layout?.summary_fields ?? []);

      setLayout(layout);

      const relations =
        layout?.tabs?.map((el) => ({
          ...el,
          ...el.relation,
        })) ?? [];

      setTableRelations(
        relations.map((relation) => ({
          ...relation,
          relatedTable:
            relation.table_from?.slug === tableSlug
              ? relation.table_to?.slug
              : relation.table_from?.slug,
        }))
      );
      if (!selectedTab?.relation_id) {
        reset(data?.response ?? {});
      }
      setSelectTab(relations[selectedTabIndex]);

      setLoader(false);
    } catch (error) {
      console.error(error);
    }
  };

  const getFields = async () => {
    const getLayout = layoutService.getLayout(tableSlug, menuId, {
      "table-slug": tableSlug,
      language_setting: i18n?.language,
    });

    try {
      const [layout] = await Promise.all([getLayout]);

      const layout1 = {
        ...layout,
        tabs: layout?.tabs?.filter(
          (tab) =>
            tab?.relation?.permission?.view_permission === true ||
            tab?.type === "section"
        ),
      };
      const layout2 = {
        ...layout1,
        tabs: layout1?.tabs?.map((tab) => {
          return {
            ...tab,
            sections: tab?.sections?.map((section) => {
              return {
                ...section,
                fields: section?.fields?.map((field) => {
                  if (field?.is_visible_layout === undefined) {
                    return {
                      ...field,
                      is_visible_layout: true,
                    };
                  } else {
                    return field;
                  }
                }),
              };
            }),
          };
        }),
      };
      setData(layout2);
      setLayout(layout);
      setSections(sortSections(sections));

      const relations =
        layout?.tabs?.map((el) => ({
          ...el,
          ...el.relation,
        })) ?? [];

      setTableRelations(
        relations.map((relation) => ({
          ...relation,
          relatedTable:
            relation.table_from?.slug === tableSlug
              ? relation.table_to?.slug
              : relation.table_from?.slug,
        }))
      );
      if (!id) {
        setLoader(false);
      }
      setSelectTab(relations[selectedTabIndex]);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (id) getAllData();
    else getFields();
  }, [id]);

  return (
    <>
      <Box>
        <Tabs>
          <TabList style={{borderBottom: "none"}}>
            {data?.tabs
              ?.filter((item) => item?.type === "section")
              .map((el, index) => (
                <Tab
                  key={index}
                  style={{
                    height: "30px",
                    padding: "0 10px",
                    fontSize: "14px",
                    fontWeight: "500",
                  }}>
                  {el?.label}
                </Tab>
              ))}
          </TabList>

          <TabPanel>
            <Box mt="10px">
              {data?.tabs?.[0]?.sections?.map((section, secIndex) => (
                <Box key={secIndex}>
                  {section?.fields?.map((field, fieldIndex) => {
                    return (
                      <Box
                        key={fieldIndex}
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                        {...(Boolean(field?.type === "MULTISELECT")
                          ? {minHeight: "30px"}
                          : {height: "34px"})}
                        py="8px">
                        <Box
                          display="flex"
                          alignItems="center"
                          justifyContent={"space-between"}
                          // padding="5px"
                          borderRadius={"4px"}
                          sx={{
                            "&:hover": {
                              backgroundColor: "#F7F7F7",
                            },
                          }}>
                          <Box
                            width="14px"
                            height="16px"
                            mr="8px"
                            display="flex"
                            alignItems="center"
                            justifyContent="center">
                            {getColumnIcon({
                              column: {
                                type: field?.type ?? field?.relation_type,
                                table_slug: field?.table_slug ?? field?.slug,
                              },
                            })}
                          </Box>
                          <Box
                            fontSize="12px"
                            color="#787774"
                            fontWeight="500"
                            minWidth="150px">
                            {field?.attributes?.[`label_${i18n?.language}`] ||
                              field?.label}
                          </Box>
                        </Box>
                        {field?.relation_type === "Many2One" ? (
                          <RelationField
                            field={field}
                            control={control}
                            name={field?.slug}
                          />
                        ) : field?.type === "MULTI_LINE" ? (
                          <MultiLineInput
                            placeholder={"Empty"}
                            control={control}
                            name={field?.slug}
                            field={field}
                            watch={watch}
                          />
                        ) : field?.type === "DATE" ? (
                          <HFDatePickerField
                            field={field}
                            control={control}
                            name={field?.slug}
                            drawerDetail={true}
                          />
                        ) : field?.type === "DATE_TIME" ? (
                          <HFDateTimePickerField
                            field={field}
                            control={control}
                            name={field?.slug}
                            drawerDetail={true}
                          />
                        ) : field?.type === "DATE_TIME_WITHOUT_TIME_ZONE" ? (
                          <HFDateDatePickerWithoutTimeZoneTableField
                            field={field}
                            control={control}
                            name={field?.slug}
                            drawerDetail={true}
                          />
                        ) : field?.type === "TIME" ? (
                          <HFTimePickerField
                            control={control}
                            name={field?.slug}
                            field={field}
                            drawerDetail={true}
                          />
                        ) : field?.type === "PASSWORD" ? (
                          <InputField
                            type="password"
                            control={control}
                            name={field?.slug}
                          />
                        ) : field?.type === "SWITCH" ? (
                          <HFSwitch
                            drawer={true}
                            control={control}
                            name={field?.slug}
                          />
                        ) : field?.type === "VIDEO" ? (
                          <HFVideoUpload
                            drawerDetail={true}
                            control={control}
                            name={field?.slug}
                          />
                        ) : field?.type === "CHECKBOX" ? (
                          <HFCheckbox control={control} name={field?.slug} />
                        ) : field?.type === "STATUS" ? (
                          <HFStatusField
                            drawerDetail={true}
                            control={control}
                            name={field?.slug}
                            field={field}
                          />
                        ) : field?.type === "MULTISELECT" ? (
                          <HFMultipleAutocomplete
                            control={control}
                            name={field?.slug}
                            field={field}
                            placeholder={"Empty"}
                          />
                        ) : field?.type === "PHOTO" ? (
                          <HFPhotoUpload
                            drawerDetail={true}
                            control={control}
                            name={field?.slug}
                            field={field}
                          />
                        ) : field?.type === "MULTI_IMAGE" ? (
                          <HFMultiImage
                            drawerDetail={true}
                            isTableView={true}
                            control={control}
                            name={field?.slug}
                            field={field}
                          />
                        ) : field?.type === "LINK" ? (
                          <HFLinkField
                            drawerDetail={true}
                            control={control}
                            name={field?.slug}
                            field={field}
                            placeholder={"Empty"}
                          />
                        ) : field?.type === "NUMBER" ||
                          field?.type === "FLOAT" ? (
                          <NumberField
                            control={control}
                            name={field?.slug}
                            field={field}
                            placeholder="Empty"
                          />
                        ) : field?.type === "FILE" ? (
                          <HFFileUpload
                            drawerDetail={true}
                            control={control}
                            name={field?.slug}
                            field={field}
                          />
                        ) : field?.type === "MONEY" ? (
                          <HFMoneyField
                            control={control}
                            name={field?.slug}
                            field={field}
                            watch={watch}
                          />
                        ) : field?.type === "MAP" ? (
                          <HFModalMap
                            drawerDetail={true}
                            control={control}
                            name={field?.slug}
                            field={field}
                            placeholder="Empty"
                          />
                        ) : field?.type === "POLYGON" ? (
                          <PolygonFieldTable
                            drawerDetail={true}
                            control={control}
                            computedSlug={field?.slug}
                            field={field}
                          />
                        ) : field?.type === "ICON" ? (
                          <HFIconPicker
                            control={control}
                            name={field?.slug}
                            field={field}
                          />
                        ) : field?.type === "COLOR" ? (
                          <HFColorPicker
                            control={control}
                            name={field?.slug}
                            field={field}
                          />
                        ) : field?.type === "FORMULA_FRONTEND" ? (
                          <FormulaField
                            control={control}
                            name={field?.slug}
                            field={field}
                          />
                        ) : (
                          <InputField control={control} name={field?.slug} />
                        )}
                      </Box>
                    );
                  })}
                </Box>
              ))}
            </Box>
          </TabPanel>
        </Tabs>
      </Box>
    </>
  );
}

const InputField = ({control, name = "", type = "text"}) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({field: {onChange, value}}) => {
        return (
          <Input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Empty"
            height="30px"
            fontSize="11px"
            px={3}
            width="60%"
            border="none"
            borderRadius={"4px"}
            _hover={{
              bg: "#F7F7F7",
            }}
            _focus={{
              backgroundColor: "#F7F7F7",
              border: "none",
              outline: "none",
            }}
          />
        );
      }}
    />
  );
};

const NumberField = ({
  control,
  name,
  field,
  disabled = false,
  placeholder = "",
}) => {
  const handleChange = (event, onChange = () => {}) => {
    const inputValue = event.target.value.replace(/\s+/g, "");
    const parsedValue = inputValue ? parseFloat(inputValue) : "";

    if (parsedValue || parsedValue === 0) {
      onChange(parsedValue);
    } else {
      onChange("");
    }
  };
  return (
    <>
      <Controller
        control={control}
        name={name}
        render={({field: {onChange, value}}) => {
          return (
            <NumericFormat
              maxLength={19}
              placeholder={placeholder}
              format="#### #### #### ####"
              mask="_"
              thousandsGroupStyle="thousand"
              thousandSeparator=" "
              decimalSeparator="."
              displayType="input"
              isNumericString={true}
              autoComplete="off"
              id={"numberField"}
              allowNegative
              style={{
                width: "320px",
                padding: "0 0px",
                outline: "none",
                color: "#787774",
                fontSize: "11px",
              }}
              value={typeof value === "number" ? value : ""}
              onChange={(e) => handleChange(e, onChange)}
              className={"custom_textfield"}
              name={name}
              readOnly={disabled}
            />
          );
        }}
      />
    </>
  );
};

const MultiLineInput = ({
  control,
  name,
  isDisabled = false,
  field,
  isWrapField = false,
  watch,
  props,
  placeholder = "",
}) => {
  const value = useWatch({
    control,
    name: name,
  });
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const stripHtmlTags = (input) => {
    return input.replace(/<[^>]*>/g, "");
  };
  return (
    <>
      <Box
        sx={{
          display: "flex",
          width: "325px",
          color: "#787774",
          padding: "5px",
          borderRadius: "4px",
          "&:hover": {
            backgroundColor: "#F7F7F7",
          },
        }}>
        <Box
          id="textAreaInput"
          onClick={(e) => {
            !isDisabled && handleClick(e);
          }}
          style={{fontSize: "11px"}}>
          {stripHtmlTags(
            value
              ? `${value?.slice(0, 200)}${value?.length > 200 ? "..." : ""}`
              : "Empty"
          )}
        </Box>

        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}>
          <HFTextEditor
            id="multi_line"
            control={control}
            name={name}
            tabIndex={field?.tabIndex}
            fullWidth
            multiline
            rows={4}
            defaultValue={field.defaultValue}
            disabled={isDisabled}
            key={name}
            isTransparent={true}
            {...props}
          />
        </Popover>
      </Box>
    </>
  );
};

const FormulaField = ({
  control,
  name,
  isTableView = false,
  tabIndex,
  rules = {},
  setFormValue = () => {},
  required,
  disabledHelperText,
  fieldsList,
  isNewTableView = false,
  disabled,
  defaultValue,
  field,
  ...props
}) => {
  const parser = new Parser();
  const [formulaIsVisible, setFormulaIsVisible] = useState(false);
  const formula = field?.attributes?.formula ?? "";
  const values = useWatch({
    control,
  });

  const updateValue = () => {
    let computedFormula = formula;
    const fieldsListSorted = fieldsList
      ? [...fieldsList]?.sort((a, b) => b.slug?.length - a.slug?.length)
      : [];
    fieldsListSorted?.forEach((field) => {
      let value = values[field.slug] ?? 0;

      if (typeof value === "string") value = `'${value}'`;
      if (typeof value === "object") value = `"${value}"`;
      if (typeof value === "boolean")
        value = JSON.stringify(value).toUpperCase();
      computedFormula = computedFormula.replaceAll(`${field.slug}`, value);
    });

    const {error, result} = parser.parse(computedFormula);

    let newValue = error ?? result;
    const prevValue = values[name];
    if (newValue !== prevValue) setFormValue(name, newValue);
  };

  useDebouncedWatch(updateValue, [values], 300);

  useEffect(() => {
    updateValue();
  }, []);
  return (
    <Controller
      control={control}
      name={name}
      disabled={disabled}
      defaultValue={defaultValue}
      rules={{
        required: required ? "This is required field" : false,
        ...rules,
      }}
      render={({field: {onChange, value}, fieldState: {error}}) => (
        <TextField
          className="formulaField"
          size="small"
          value={
            formulaIsVisible
              ? formula
              : typeof value === "number"
                ? numberWithSpaces(parseFloat(value).toFixed(2))
                : value
          }
          name={name}
          onChange={(e) => {
            const val = e.target.value;
            const valueWithoutSpaces = val.replaceAll(" ", "");

            if (!valueWithoutSpaces) onChange("");
            else
              onChange(
                !isNaN(Number(valueWithoutSpaces))
                  ? Number(valueWithoutSpaces)
                  : ""
              );
          }}
          error={error}
          fullWidth
          disabled={disabled}
          autoFocus={tabIndex === 1}
          helperText={!disabledHelperText && error?.message}
          InputProps={{
            inputProps: {tabIndex},
            readOnly: disabled,

            endAdornment: (
              <InputAdornment position="end">
                <Box
                  style={{display: "flex", alignItems: "center", gap: "10px"}}>
                  <Tooltip
                    title={formulaIsVisible ? "Hide formula" : "Show formula"}>
                    <IconButton
                      edge="end"
                      color={formulaIsVisible ? "primary" : "default"}
                      onClick={() => setFormulaIsVisible((prev) => !prev)}>
                      <FunctionsIcon />
                    </IconButton>
                  </Tooltip>
                  {disabled && (
                    <Tooltip title="This field is disabled for this role!">
                      <InputAdornment position="start">
                        <Lock style={{fontSize: "20px"}} />
                      </InputAdornment>
                    </Tooltip>
                  )}
                </Box>
              </InputAdornment>
            ),
          }}
          {...props}
        />
      )}></Controller>
  );
};

export default DrawerFormDetailPage;
