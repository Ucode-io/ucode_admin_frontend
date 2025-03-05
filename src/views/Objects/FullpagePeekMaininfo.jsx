import KeyboardTabIcon from "@mui/icons-material/KeyboardTab";
import {Box, Button, Menu, MenuItem, TextField, Tooltip} from "@mui/material";
import {useEffect, useMemo, useState} from "react";
import {useTranslation} from "react-i18next";
import {useParams} from "react-router-dom";
import {Container, Draggable} from "react-smooth-dnd";
import PageFallback from "../../components/PageFallback";
import {useProjectGetByIdQuery} from "../../services/projectService";
import {store} from "../../store";
import {getColumnIcon} from "../table-redesign/icons";
import DrawerFieldGenerator from "./DrawerDetailPage/ElementGenerator/DrawerFieldGenerator";
import styles from "./style.module.scss";
import {Controller} from "react-hook-form";
import {Check} from "@mui/icons-material";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";

const FullpagePeekMaininfo = ({
  computedSections,
  control,
  loader,
  relation,
  isMultiLanguage,
  watch,
  fieldsMap = {},
  selectedTab,
  setFormValue = () => {},
}) => {
  const {tableSlug} = useParams();
  const [isShow, setIsShow] = useState(true);
  const projectId = store.getState().company.projectId;
  const [activeLang, setActiveLang] = useState();

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

  const filterFields = (element, control, watch) => {
    if (element?.attributes?.hide_path_field) {
      if (Array.isArray(element?.attributes?.hide_path)) {
        const hidePathArray = element?.attributes?.hide_path;
        const watchArray = watch(element?.attributes?.hide_path_field, control);

        if (hidePathArray?.length !== watchArray?.length) {
          return false;
        }
        return hidePathArray?.every((el, index) => el === watchArray?.[index]);
      }
      if (element?.attributes?.type) {
        const hidePathArray = element?.attributes?.hide_path;
        const watchArray = watch(element?.attributes?.hide_path_field, control);
        if (element?.attributes?.type === "min") {
          if (watchArray > Number(hidePathArray)) {
            return true;
          } else return false;
        } else if (element?.attributes?.type === "max") {
          if (watchArray < Number(hidePathArray)) {
            return true;
          } else return false;
        }
      }

      const isHidden =
        element?.attributes?.hide_path ===
        watch(element?.attributes?.hide_path_field, control);

      return isHidden;
    }

    return true;
  };

  useEffect(() => {
    if (isMultiLanguage) {
      setActiveLang(projectInfo?.language?.[0]?.short_name);
    }
  }, [isMultiLanguage, projectInfo]);
  const {i18n} = useTranslation();

  const onDrop = () => {
    console.log("sss");
  };

  if (loader) return <PageFallback />;
  console.log("selectedTabselectedTab", selectedTab);
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

          <Box sx={{padding: "0 15px 0 40px"}}>
            <HeadingOptions
              control={control}
              watch={watch}
              fields={fieldsList}
              selectedTab={selectedTab}
              selectedRow={relation}
            />
          </Box>

          <div
            style={{padding: "0 40px"}}
            className={styles.newMainInfoSections}>
            {computedSections?.map((section, secIndex) => (
              <Box
                sx={{margin: "8px 0 0 0", overflow: "hidden"}}
                key={secIndex}>
                <Container
                  behaviour="contain"
                  style={{width: "100%"}}
                  // onDragStart={() => setDragAction(true)}
                  // onDragEnd={() => setDragAction(false)}
                  dragHandleSelector=".drag-handle"
                  dragClass="drag-item"
                  lockAxis="y"
                  onDrop={(dropResult) => onDrop(secIndex, dropResult)}>
                  {section?.fields
                    ?.filter(
                      (el) => el?.slug !== watch("attributes.layout_heading")
                    )
                    .map((field, fieldIndex) => (
                      <Draggable className="drag-handle" key={field?.id}>
                        <Box
                          // className={dragAction ? "rowColumnDrag" : "rowColumn"}
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
                                {/* <DragIndicatorIcon
                                  style={{width: "16px", height: "16px"}}
                                /> */}
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
                          <Box sx={{width: "60%"}}>
                            <DrawerFieldGenerator
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
  selectedRow,
  setFormValue = () => {},
}) => {
  const {i18n} = useTranslation();
  const [anchorEl, setAnchorEl] = useState(null);

  const selectedFieldSlug =
    watch("attributes.layout_heading") ||
    selectedTab?.attributes?.layout_heading;

  const selectedField = fields.find(
    (field) => field?.slug === selectedFieldSlug
  );

  const fieldValue = selectedField
    ? (selectedRow?.[selectedField.slug] ?? "")
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
      setFormValue("attributes.layout_heading", option.table_slug);
    }
    setAnchorEl(null);
  };

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
          control={control}
          name={selectedField?.slug || ""}
          defaultValue={fieldValue}
          key={selectedField?.slug}
        />

        <Box
          className="fieldChoose"
          sx={{cursor: "pointer"}}
          onClick={handleClick}>
          <img
            src="/img/text-column.svg"
            width={"22px"}
            height={"22px"}
            alt="heading text"
          />
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

const CHTextField = ({control, name = "", defaultValue = ""}) => {
  return (
    <Controller
      control={control}
      name={name}
      defaultValue={defaultValue}
      render={({field: {onChange, value}, fieldState: {error}}) => (
        <TextField
          onChange={(e) => onChange(e.target.value)}
          className="headingText"
          value={value ?? ""}
        />
      )}
    />
  );
};

export default FullpagePeekMaininfo;
