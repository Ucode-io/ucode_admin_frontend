import "./style.scss";
import {useEffect, useMemo, useState} from "react";
import {useTranslation} from "react-i18next";
import {store} from "../../store";
import styles from "./style.module.scss";
import {Controller} from "react-hook-form";
import {Check} from "@mui/icons-material";
import {applyDrag} from "../../utils/applyDrag";
import {getColumnIcon} from "../table-redesign/icons";
import {Container, Draggable} from "react-smooth-dnd";
import PageFallback from "../../components/PageFallback";
import KeyboardTabIcon from "@mui/icons-material/KeyboardTab";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import SpaceDashboardIcon from "@mui/icons-material/SpaceDashboard";
import {useProjectGetByIdQuery} from "../../services/projectService";
import {Box, Button, Menu, MenuItem, TextField, Tooltip} from "@mui/material";
import DrawerFieldGenerator from "./DrawerDetailPage/ElementGenerator/DrawerFieldGenerator";
import {useNavigate, useParams} from "react-router-dom";
import {Flex, Text} from "@chakra-ui/react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import layoutService from "../../services/layoutService";

const FullpagePeekMaininfo = ({
  control,
  loader,
  relation,
  watch,
  selectedTab,
  isMultiLanguage,
  getValues = () => {},
  computedSections = [],
  updateCurrentLayout = () => {},
}) => {
  const {tableSlug, appId, id} = useParams();
  const test = useParams();
  const {i18n} = useTranslation();
  const navigate = useNavigate();
  const [isShow, setIsShow] = useState(true);
  const [activeLang, setActiveLang] = useState();
  const [dragAction, setDragAction] = useState(false);
  const projectId = store.getState().company.projectId;
  const [sections, setSections] = useState(computedSections ?? []);
  const rowData = watch();

  const fieldsList = useMemo(() => {
    const fields = [];

    relation?.tabs?.forEach((tab) => {
      tab?.sections?.forEach((section) => {
        section?.fields?.forEach((field) => {
          fields.push(field);
        });
      });
    });
    return fields;
  }, [relation]);

  const {data: projectInfo} = useProjectGetByIdQuery({projectId});

  useEffect(() => {
    if (isMultiLanguage) {
      setActiveLang(projectInfo?.language?.[0]?.short_name);
    }
  }, [isMultiLanguage, projectInfo]);

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

  if (loader) return <PageFallback />;

  return (
    <div className={styles.newcontainer}>
      {isShow ? (
        <div className={styles.newmainCardSide}>
          {isMultiLanguage && (
            <div className={styles.language}>
              {projectInfo?.language?.map((lang) => (
                <Button
                  className={activeLang === lang?.short_name && styles.active}
                  onClick={() => setActiveLang(lang?.short_name)}>
                  {lang?.name}
                </Button>
              ))}
            </div>
          )}

          <Box
            sx={{
              padding: "10px 15px 10px 40px",
            }}>
            <Box
              sx={{
                height: "32px",
                margin: "5px 5px 0",
                "&:hover": {
                  button: {
                    display: "flex",
                  },
                },
              }}>
              <Button
                onClick={() =>
                  navigate(
                    `/main/${appId}/layout-settings/${tableSlug}/${id}`,
                    {
                      state: {
                        ...rowData,
                      },
                    }
                  )
                }
                sx={{
                  display: "none",
                  alignItems: "center",
                  gap: "5px",
                  paddingLeft: "3px",
                  color: "rgba(55, 53, 47, 0.5)",
                  "&:hover": {
                    background: "rgba(55, 53, 47, 0.06)",
                  },
                }}>
                <SpaceDashboardIcon /> Customize layout
              </Button>
            </Box>
            <HeadingOptions
              control={control}
              watch={watch}
              fields={fieldsList}
              selectedTab={selectedTab}
              layoutData={relation}
            />
          </Box>

          <div
            style={{padding: "0 40px"}}
            className={styles.newMainInfoSectionsFullpage}>
            {sections?.map((section, secIndex) => (
              <Box sx={{margin: "8px 0 0 0"}} key={secIndex}>
                <Container
                  key={section?.id}
                  behaviour="contain"
                  style={{width: "100%"}}
                  onDragStart={() => setDragAction(true)}
                  onDragEnd={() => setDragAction(false)}
                  dragHandleSelector=".drag-handle-item"
                  dragClass="dragging_preview"
                  lockAxis="y"
                  onDrop={(dropResult) => onDrop(secIndex, dropResult)}>
                  {section?.fields
                    ?.filter(
                      (el) => el?.slug !== watch("attributes.layout_heading")
                    )
                    .map((field, fieldIndex) => (
                      <Draggable className="drag-handle-item" key={field?.id}>
                        <Box
                          className={dragAction ? "rowColumnDrag" : "rowColumn"}
                          key={fieldIndex}
                          display="flex"
                          alignItems="center"
                          {...(Boolean(field?.type === "MULTISELECT")
                            ? {minHeight: "30px"}
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
                                    table_slug:
                                      field?.table_slug ?? field?.slug,
                                  },
                                })}
                              </span>
                            </Box>
                            <Box
                              fontSize="14px"
                              color="#787774"
                              fontWeight="500"
                              width="100%">
                              {field?.attributes?.[`label_${i18n?.language}`] ||
                                field?.label}
                            </Box>
                          </Box>
                          <Box sx={{width: "70%"}}>
                            <DrawerFieldGenerator
                              drawerDetail={true}
                              control={control}
                              field={field}
                              watch={watch}
                            />
                          </Box>
                        </Box>
                      </Draggable>
                    ))}
                </Container>
              </Box>
            ))}
          </div>
        </div>
      ) : (
        <div className={styles.hideSideCard}>
          <Tooltip title="Открыть полю ввода" placement="right" followCursor>
            <button onClick={() => setIsShow(true)}>
              <KeyboardTabIcon style={{color: "#000"}} />
            </button>
          </Tooltip>
        </div>
      )}
    </div>
  );
};

const HeadingOptions = ({
  watch,
  control,
  fields,
  selectedTab,
  layoutData,
  setFormValue = () => {},
}) => {
  const {tableSlug} = useParams();
  const {i18n} = useTranslation();
  const [anchorEl, setAnchorEl] = useState(null);

  const [selectedFieldSlug, setSelectedFieldSlug] = useState(
    selectedTab?.attributes?.layout_heading
  );

  const selectedField = fields.find(
    (field) => field?.slug === selectedFieldSlug
  );

  const fieldValue = selectedField
    ? (layoutData?.[selectedField.slug] ?? "")
    : "";

  const fieldsList = fields.map((field) => ({
    label: field?.attributes?.[`label_${i18n?.language}`] ?? field?.label,
    value: field?.slug,
    type: field?.type,
    table_slug: field?.slug,
  }));

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (option) => {
    if (option) {
      updateLayout(option?.value);
      setSelectedFieldSlug(option.table_slug);
    }
    setAnchorEl(null);
  };

  function updateLayout(fieldSlug) {
    const updatedTabs = layoutData.tabs.map((tab, index) =>
      index === 0
        ? {
            ...tab,
            attributes: {
              ...tab?.attributes,
              layout_heading: fieldSlug,
            },
          }
        : tab
    );

    const currentUpdatedLayout = {
      ...layoutData,
      tabs: updatedTabs,
    };

    layoutService.update(currentUpdatedLayout, tableSlug);
  }

  useEffect(() => {
    setSelectedFieldSlug(selectedTab?.attributes?.layout_heading);
  }, [selectedTab, layoutData]);

  return (
    <>
      <Box
        className="layoutHeading"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingLeft: "3px",
          gap: "10px",
        }}>
        <CHTextField
          placeholder={selectedFieldSlug?.slug ? "" : "Select field"}
          control={control}
          name={selectedField?.slug || ""}
          defaultValue={fieldValue}
          key={selectedField?.slug}
        />

        <Box sx={{cursor: "pointer"}}>
          <Flex
            p={"5px"}
            borderRadius={6}
            onClick={handleClick}
            gap={2}
            alignItems={"center"}>
            <Text>
              {
                fieldsList?.find((field) => field?.value === selectedFieldSlug)
                  ?.label
              }
            </Text>
            {anchorEl ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </Flex>
        </Box>
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => handleClose(null)}>
        <Box sx={{width: "220px", padding: "4px 0"}}>
          {fieldsList
            .filter(
              (field) => field?.type === "SINGLE_LINE" || field?.type === "TEXT"
            )
            .map((option) => (
              <MenuItem
                style={{
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  gap: "6px",
                  color: "#37352f",
                }}
                key={option.label}
                onClick={() => handleClose(option)}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                  }}>
                  <span>
                    {getColumnIcon({
                      column: {
                        type: option?.type ?? option?.relation_type,
                        table_slug: "field",
                      },
                    })}
                  </span>
                  {option.label}
                </Box>

                <Box>
                  {option.table_slug === selectedFieldSlug ? <Check /> : ""}
                </Box>
              </MenuItem>
            ))}
        </Box>
      </Menu>
    </>
  );
};

const CHTextField = ({
  control,
  name = "",
  defaultValue = "",
  placeholder = "",
}) => {
  return (
    <Controller
      control={control}
      name={name}
      defaultValue={defaultValue}
      render={({field: {onChange, value}, fieldState: {error}}) => (
        <TextField
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="headingText"
          value={value ?? ""}
        />
      )}
    />
  );
};

export default FullpagePeekMaininfo;
