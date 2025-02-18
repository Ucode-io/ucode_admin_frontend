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
import {Box, Popover, TextField, Typography} from "@mui/material";
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

function DrawerFormDetailPage({
  tableSlugFromProps,
  handleClose,
  fieldsMap,
  modal = false,
  refetch = () => {},
  selectedRow,
  dateInfo,
  fullScreen,
  menuItem,
  setFullScreen = () => {},
}) {
  const {id: idFromParam, tableSlug: tableSlugFromParam, appId} = useParams();

  const id = useMemo(() => {
    return idFromParam ?? selectedRow?.guid;
  }, [idFromParam, selectedRow]);

  const tableSlug = useMemo(() => {
    return tableSlugFromProps || tableSlugFromParam;
  }, [tableSlugFromParam, tableSlugFromProps]);

  const [editAcces, setEditAccess] = useState(false);
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const {state = {}} = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {navigateToForm} = useTabRouter();
  const queryClient = useQueryClient();
  const isUserId = useSelector((state) => state?.auth?.userId);
  const [loader, setLoader] = useState(true);
  const [btnLoader, setBtnLoader] = useState(false);
  const [sections, setSections] = useState([]);
  const [tableRelations, setTableRelations] = useState([]);
  const [summary, setSummary] = useState([]);
  const [selectedTab, setSelectTab] = useState();
  const menu = store.getState().menu;
  const isInvite = menu.invite;
  const {i18n} = useTranslation();
  const [layout, setLayout] = useState({});
  const [data, setData] = useState({});
  const [searchParams, setSearchParams] = useSearchParams();
  const menuId = searchParams.get("menuId");

  const {
    handleSubmit,
    control,
    reset,
    setValue: setFormValue,
    watch,
    formState: {errors},
  } = useForm({
    defaultValues: {
      ...state,
      ...dateInfo,
      invite: isInvite ? menuItem?.data?.table?.is_login_table : false,
    },
  });

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

  const update = (data) => {
    delete data.invite;
    setBtnLoader(true);
    constructorObjectService
      .update(tableSlug, {data})
      .then(() => {
        queryClient.invalidateQueries(["GET_OBJECT_LIST", tableSlug]);
        queryClient.refetchQueries(
          "GET_OBJECTS_LIST_WITH_RELATIONS",
          tableSlug,
          {
            table_slug: tableSlug,
            user_id: isUserId,
          }
        );
        dispatch(showAlert("Successfully updated", "success"));
        if (modal) {
          handleClose();
          queryClient.refetchQueries(["GET_OBJECT_LIST_ALL"]);
        } else {
          navigate(-1);
        }
      })
      .catch((e) => console.log("ERROR: ", e))
      .finally(() => {
        setBtnLoader(false);
        refetch();
      });
  };
  const create = (data) => {
    setBtnLoader(true);

    constructorObjectService
      .create(tableSlug, {data})
      .then((res) => {
        queryClient.invalidateQueries(["GET_OBJECT_LIST", tableSlug]);
        queryClient.refetchQueries(
          "GET_OBJECTS_LIST_WITH_RELATIONS",
          tableSlug,
          {
            table_slug: tableSlug,
          }
        );
        queryClient.refetchQueries("GET_NOTIFICATION_LIST", tableSlug, {
          table_slug: tableSlug,
          user_id: isUserId,
        });
        if (modal) {
          handleClose();
          queryClient.refetchQueries(
            "GET_OBJECTS_LIST_WITH_RELATIONS",
            tableSlug,
            {
              table_slug: tableSlug,
            }
          );
          queryClient.refetchQueries(["GET_OBJECT_LIST_ALL"]);
        } else {
          navigate(-1);
          handleClose();
          if (!state) navigateToForm(tableSlug, "EDIT", res.data?.data);
        }

        dispatch(showAlert("Successfully updated!", "success"));
      })
      .catch((e) => console.log("ERROR: ", e))
      .finally(() => {
        setBtnLoader(false);
        refetch();
      });
  };

  const onSubmit = (data) => {
    if (id) {
      update(data);
    } else {
      create(data);
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
                  {section?.fields?.map((field, fieldIndex) => (
                    <Box
                      key={fieldIndex}
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                      height={"32px"}
                      py="8px">
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent={"space-between"}
                        padding="5px"
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
                        />
                      ) : field?.type === "DATE_TIME" ? (
                        <HFDateTimePickerField
                          field={field}
                          control={control}
                          name={field?.slug}
                        />
                      ) : field?.type === "DATE_TIME_WITHOUT_TIME_ZONE" ? (
                        <HFDateDatePickerWithoutTimeZoneTableField
                          field={field}
                          control={control}
                          name={field?.slug}
                        />
                      ) : field?.type === "TIME" ? (
                        <HFTimePickerField
                          control={control}
                          name={field?.slug}
                          field={field}
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
                        <HFVideoUpload control={control} name={field?.slug} />
                      ) : field?.type === "CHECKBOX" ? (
                        <HFCheckbox control={control} name={field?.slug} />
                      ) : field?.type === "STATUS" ? (
                        <HFStatusField
                          control={control}
                          name={field?.slug}
                          field={field}
                        />
                      ) : field?.type === "MULTISELECT" ? (
                        <HFMultipleAutocomplete
                          control={control}
                          name={field?.slug}
                          field={field}
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
                          control={control}
                          name={field?.slug}
                          field={field}
                        />
                      ) : (
                        <InputField control={control} name={field?.slug} />
                      )}
                    </Box>
                  ))}
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

const MultiLineInput = ({
  control,
  name,
  isDisabled = false,
  field,
  isWrapField = false,
  watch,
  props,
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
          width: "328px",
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
          styles={{}}>
          {stripHtmlTags(
            value
              ? `${value?.slice(0, 200)}${value?.length > 200 ? "..." : ""}`
              : ""
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

export default DrawerFormDetailPage;
