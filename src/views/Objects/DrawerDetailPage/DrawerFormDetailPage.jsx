import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import {Box, Button} from "@mui/material";
import {isEqual} from "lodash";
import React, {useEffect, useMemo, useState} from "react";
import {useTranslation} from "react-i18next";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate, useParams} from "react-router-dom";
import {Container, Draggable} from "react-smooth-dnd";
import MaterialUIProvider from "../../../providers/MaterialUIProvider";
import layoutService from "../../../services/layoutService";
import {store} from "../../../store";
import {applyDrag} from "../../../utils/applyDrag";
import {FIELD_TYPES} from "../../../utils/constants/fieldTypes";
import {getColumnIcon} from "../../table-redesign/icons";
import FormCustomActionButton from "../components/CustomActionsButton/FormCustomActionButtons";
import DrawerFieldGenerator from "./ElementGenerator/DrawerFieldGenerator";
import HeadingOptions from "./HeadingOptions";
import "./style.scss";
import constructorObjectService from "../../../services/constructorObjectService";
import {showAlert} from "../../../store/alert/alert.thunk";
import {useQueryClient} from "react-query";

function DrawerFormDetailPage({
  view,
  data,
  layout,
  fieldsMap,
  selectedTab = {},
  selectedRow,
  selectedTabIndex = 0,
  handleMouseDown,
  projectInfo,
  rootForm,
  updateLayout = () => {},
}) {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const {i18n} = useTranslation();
  const {tableSlug: tableSlugParam, menuId} = useParams();
  const tableSlug = tableSlugParam || view?.table_slug;
  const [dragAction, setDragAction] = useState(false);
  const [activeLang, setActiveLang] = useState();
  const auth = store.getState().auth;
  const defaultAdmin = auth?.roleInfo?.name === "DEFAULT ADMIN";
  const languages = useSelector((state) => state.languages.list)?.map(
    (el) => el.slug
  );

  const query = new URLSearchParams(window.location.search);
  const itemId = query.get("p");

  const slugSplit = (slug) => {
    const parts = slug.split("_");
    return parts[parts.length - 1];
  };

  const [sections, setSections] = useState(
    data?.tabs?.[selectedTabIndex]?.sections || []
  );

  useEffect(() => {
    setSections(data?.tabs?.[0]?.sections || []);
  }, [data]);

  const onDrop = (secIndex, dropResult) => {
    if (!dropResult.removedIndex && !dropResult.addedIndex) return;

    const newSections = [...sections];
    newSections[secIndex].fields = applyDrag(
      newSections[secIndex].fields,
      dropResult
    );

    setSections(newSections);
    updateCurrentLayout(newSections);
  };

  const updateCurrentLayout = (newSections) => {
    const updatedTabs = layout.tabs.map((tab, index) =>
      index === selectedTabIndex
        ? {
            ...tab,
            sections: newSections,
            attributes: {
              ...tab?.attributes,
            },
          }
        : tab
    );

    const currentUpdatedLayout = {
      ...layout,
      tabs: updatedTabs,
    };

    layoutService.update(currentUpdatedLayout, tableSlug);
  };

  useEffect(() => {
    if (selectedRow?.IS_NO_DATE || selectedRow?.IS_NEW) {
      rootForm.setValue(
        selectedRow?.FROM_DATE_SLUG,
        selectedRow?.[selectedRow?.FROM_DATE_SLUG]
      );
      rootForm.setValue(
        selectedRow?.TO_DATE_SLUG,
        selectedRow?.[selectedRow?.TO_DATE_SLUG]
      );
    }

    rootForm.setValue(
      "attributes.layout_heading",
      selectedTab?.attributes?.layout_heading
    );
  }, [selectedRow]);

  useEffect(() => {
    if (!data?.tabs?.[0]?.sections) return;

    const updatedSections = data.tabs[0].sections.map((section) => ({
      ...section,
      fields: section?.fields?.filter(
        (el) =>
          el?.slug !== rootForm.watch("attributes.layout_heading") && el?.id
      ),
    }));

    setSections((prevSections) =>
      isEqual(prevSections, updatedSections) ? prevSections : updatedSections
    );
  }, [data, rootForm.watch("attributes.layout_heading")]);

  const getFieldLanguageLabel = (el) => {
    if (el?.type === FIELD_TYPES.LOOKUP || el?.type === FIELD_TYPES.LOOKUPS) {
      return el?.attributes?.[`label_${i18n?.language}`];
    }
    if (el?.enable_multilanguage) {
      return el?.attributes?.show_label
        ? `${el?.label} (${activeLang ?? slugSplit(el?.slug)})`
        : el?.attributes?.[`label_${i18n?.language}`];
    } else {
      if (el?.show_label === false) return "";
      else
        return el?.attributes?.[`label_${i18n.language}`] || el?.label || " ";
    }
  };

  const isMultiLanguage = useMemo(() => {
    const allFields = [];
    selectedTab?.sections?.map((section) => {
      return section?.fields?.map((field) => {
        return allFields.push(field);
      });
    });
    return !!allFields.find((field) =>
      field?.enable_multilanguage || field?.enable_multi_language
        ? field?.enable_multilanguage || field?.enable_multi_language
        : (field?.attributes?.enable_multilanguage ||
            field?.attributes?.enable_multi_language) === true
    );
  }, [selectedTab]);

  useEffect(() => {
    if (isMultiLanguage) {
      setActiveLang(projectInfo?.language?.[0]?.short_name);
    }
  }, [isMultiLanguage, projectInfo]);

  const filterFields = (field) => {
    const slugParts = field?.slug?.split("_");
    const lastPart = slugParts?.[slugParts.length - 1];

    const isLangSpecific = languages.includes(lastPart);

    if (!isLangSpecific) {
      return true;
    }
    const lang = activeLang ?? i18n?.language;

    return lastPart === lang;
  };

  const getAllData = () => {};

  const handleNavigateToMicroFrontend = (id) => {
    navigate(`/microfrontend/${id}?itemId=${selectedRow?.guid}`);
  };

  const updateObject = () => {
    if (Boolean(!itemId)) return;
    const computedData = rootForm.watch();
    delete computedData.invite;

    constructorObjectService
      .update(tableSlug, {data: {...computedData, guid: itemId}})
      .then((res) => {
        queryClient.refetchQueries("GET_OBJECTS_LIST", tableSlug, {
          table_slug: tableSlug,
        });
      })
      .catch((e) => console.log("ERROR: ", e))
      .finally(() => {});
  };

  return (
    <MaterialUIProvider>
      <Box
        mt="10px"
        sx={{height: "calc(100vh - 94px)"}}
        pb={"10px"}
        overflow={"auto"}
        display="flex"
        flexDirection="column">
        {isMultiLanguage && (
          <div className={"language"}>
            {projectInfo?.language?.map((lang) => (
              <Button
                className={activeLang === lang?.short_name && "active"}
                onClick={() => setActiveLang(lang?.short_name)}>
                {lang?.name}
              </Button>
            ))}
          </div>
        )}

        <HeadingOptions
          updateObject={updateObject}
          updateLayout={updateLayout}
          selectedRow={selectedRow}
          watch={rootForm.watch}
          control={rootForm.control}
          fieldsMap={fieldsMap}
          selectedTab={selectedTab}
          setFormValue={rootForm.setValue}
          activeLang={activeLang}
          isMultiLanguage={isMultiLanguage}
          langs={projectInfo?.language}
        />

        <Box
          sx={{
            overflow: "auto",
            height: "calc(100vh - 94px)",
          }}>
          {sections?.map((section, secIndex) => (
            <Box
              sx={{
                margin: "8px 0 0 0",
              }}
              key={secIndex}>
              <Container
                behaviour="contain"
                style={{
                  width: "100%",
                }}
                onDragStart={() => setDragAction(true)}
                onDragEnd={() => setDragAction(false)}
                dragHandleSelector=".drag-handle"
                dragClass="drag-item"
                lockAxis="y"
                onDrop={(dropResult) => onDrop(secIndex, dropResult)}>
                {section?.fields
                  ?.filter((el) => filterFields(el))
                  .map((field, fieldIndex) => (
                    <Draggable
                      className={Boolean(defaultAdmin) ? "drag-handle" : ""}
                      key={field?.id ?? fieldIndex}>
                      <Box
                        className={dragAction ? "rowColumnDrag" : "rowColumn"}
                        display="flex"
                        alignItems={
                          Boolean(field?.type === FIELD_TYPES.SINGLE_LINE)
                            ? "flex-start"
                            : "center"
                        }
                        {...(Boolean(field?.type === "MULTISELECT")
                          ? {minHeight: "30px"}
                          : Boolean(field?.type === FIELD_TYPES.SINGLE_LINE)
                            ? {height: "auto !important"}
                            : {height: "34px"})}
                        py="8px">
                        <Box
                          display="flex"
                          alignItems="center"
                          justifyContent={"space-between"}
                          padding="5px"
                          borderRadius={"4px"}
                          width="170px"
                          sx={{
                            "&:hover": {
                              backgroundColor: "#F7F7F7",
                            },
                          }}>
                          <Box
                            width="18px"
                            height="16px"
                            mr="8px"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            sx={{color: "#787774"}}>
                            <span className="drag">
                              <DragIndicatorIcon
                                style={{width: "16px", height: "16px"}}
                              />
                            </span>
                            <span style={{color: "#787774"}} className="icon">
                              {getColumnIcon({
                                column: {
                                  type: field?.type ?? field?.relation_type,
                                  table_slug: field?.table_slug ?? field?.slug,
                                },
                              })}
                            </span>
                          </Box>
                          <Box
                            fontSize="14px"
                            color="#787774"
                            fontWeight="500"
                            width="100%"
                            overflow="hidden"
                            textOverflow="ellipsis"
                            whiteSpace="nowrap">
                            {getFieldLanguageLabel(field)}
                          </Box>
                        </Box>
                        <Box sx={{width: "60%"}}>
                          <DrawerFieldGenerator
                            updateObject={updateObject}
                            activeLang={activeLang}
                            drawerDetail={true}
                            control={rootForm.control}
                            field={field}
                            watch={rootForm.watch}
                            isRequired={field?.attributes?.required}
                            isDisabled={
                              field?.attributes?.disabled ||
                              !field?.attributes?.field_permission
                                ?.edit_permission
                            }
                            setFormValue={rootForm.setValue}
                            errors={rootForm.errors}
                          />
                        </Box>
                      </Box>
                    </Draggable>
                  ))}
              </Container>
            </Box>
          ))}
        </Box>
        <Box
          display="flex"
          justifyContent="flex-end"
          marginTop="auto"
          marginBottom="12px"
          gap={"8px"}>
          <FormCustomActionButton
            control={rootForm?.control?._formValues}
            tableSlug={tableSlug}
            id={selectedRow?.guid}
            getAllData={getAllData}
            microFrontendCallback={handleNavigateToMicroFrontend}
          />
        </Box>
      </Box>

      <Box
        onMouseDown={handleMouseDown}
        sx={{
          position: "absolute",
          height: "calc(100vh - 50px)",
          width: "3px",
          left: 0,
          top: 0,
          cursor: "col-resize",
        }}
      />
    </MaterialUIProvider>
  );
}

export const getColumnFieldIcon = (column) => {
  if (column === "SidePeek") {
    return (
      <img
        src="/img/drawerPeek.svg"
        width={"18px"}
        height={"18px"}
        alt="drawer svg"
      />
    );
  } else if (column === "CenterPeek") {
    return (
      <img
        src="/img/centerPeek.svg"
        width={"18px"}
        height={"18px"}
        alt="drawer svg"
      />
    );
  } else
    return (
      <img
        src="/img/fullpagePeek.svg"
        width={"18px"}
        height={"18px"}
        alt="drawer svg"
      />
    );
};

export default DrawerFormDetailPage;
