import KeyboardTabIcon from "@mui/icons-material/KeyboardTab";
import { Box, Button, Tooltip } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import FormElementGenerator from "../../components/ElementGenerators/FormElementGenerator";
import PageFallback from "../../components/PageFallback";
import { useProjectGetByIdQuery } from "../../services/projectService";
import { store } from "../../store";
import NewFormCard from "./components/NewFormCard";
import styles from "./style.module.scss";
import ButtonsPopover from "../../components/ButtonsPopover";
import { useWatch } from "react-hook-form";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { layout } from "@chakra-ui/react";
import layoutService from "../../services/layoutService";

const MainInfoForModal = ({
  computedSections,
  control,
  loader,
  setFormValue,
  relatedTable,
  relation,
  isMultiLanguage,
  errors,
  setFullScreen,
  remove,
  editAcces,
  setData,
  data,
}) => {
  const { tableSlug } = useParams();
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

  const { data: projectInfo } = useProjectGetByIdQuery({ projectId });

  useEffect(() => {
    if (isMultiLanguage) {
      setActiveLang(projectInfo?.language?.[0]?.short_name);
    }
  }, [isMultiLanguage, projectInfo]);
  const { i18n } = useTranslation();
  const selectedTable = store.getState().menu.menuItem;

  const updateLayout = (newData) => {
    const computedData = {
      layouts: newData,
      project_id: projectId,
      table_id: selectedTable?.table_id,
    };
    layoutService.update(computedData);
  };

  const toggleFields = (field) => {
    const newFields = data?.map((layout) => {
      return {
        ...layout,
        tabs: layout?.tabs?.map((tab) => {
          return {
            ...tab,
            sections: tab?.sections?.map((section) => {
              return {
                ...section,
                fields: section?.fields?.map((f) => {
                  if (f?.id === field?.id) {
                    return {
                      ...f,
                      is_visible_layout: !f?.is_visible_layout,
                    };
                  } else {
                    return f;
                  }
                }),
              };
            }),
          };
        }),
      };
    });
    setData(newFields);
    updateLayout(newFields);
  };

  const isVisibleSection = (section) => {
    if (editAcces) return true;
    const isVisible = section?.fields?.some((field) => field?.is_visible_layout);
    return isVisible;
  };

  if (loader) return <PageFallback />;

  return (
    <div className={styles.newcontainerModal} style={{
      height: "calc(100% - 60px)",
    }}>
      {isShow ? (
        <div className={styles.newmainCardSide}>
          {isMultiLanguage && (
            <div className={styles.language}>
              {projectInfo?.language?.map((lang) => (
                <Button className={activeLang === lang?.short_name && styles.active} onClick={() => setActiveLang(lang?.short_name)}>
                  {lang?.name}
                </Button>
              ))}
            </div>
          )}

          {computedSections.map(
            (section) =>
              isVisibleSection(section) && (
                <NewFormCard key={section.id} title={section?.attributes?.[`label_${i18n.language}`] ?? section.label} className={styles.formCard} icon={section.icon}>
                  <div className={styles.newformColumn}>
                    {!editAcces
                      ? section.fields?.map(
                          (field, fieldIndex) =>
                            (field?.is_visible_layout || field?.is_visible_layout === undefined) && (
                              <Box
                                style={{
                                  display: "flex",
                                  alignItems: "flex-end",
                                }}
                              >
                                <FormElementGenerator
                                  key={field.id}
                                  isMultiLanguage={isMultiLanguage}
                                  field={field}
                                  control={control}
                                  setFormValue={setFormValue}
                                  fieldsList={fieldsList}
                                  formTableSlug={tableSlug}
                                  relatedTable={relatedTable}
                                  activeLang={activeLang}
                                  errors={errors}
                                />
                              </Box>
                            )
                        )
                      : section.fields?.map((field, fieldIndex) => (
                          <Box
                            style={{
                              display: "flex",
                              alignItems: "flex-end",
                            }}
                          >
                            <FormElementGenerator
                              key={field.id}
                              isMultiLanguage={isMultiLanguage}
                              field={field}
                              control={control}
                              setFormValue={setFormValue}
                              fieldsList={fieldsList}
                              formTableSlug={tableSlug}
                              relatedTable={relatedTable}
                              activeLang={activeLang}
                              errors={errors}
                            />

                            <Button
                              onClick={() => toggleFields(field)}
                              sx={{
                                height: "38px",
                                minWidth: "38px",
                                width: "38px",
                                borderRadius: "50%",
                              }}
                            >
                              {!field?.is_visible_layout ? <VisibilityIcon /> : <VisibilityOffIcon />}
                            </Button>
                          </Box>
                        ))}
                  </div>
                </NewFormCard>
              )
          )}
        </div>
      ) : (
        <div className={styles.hideSideCard}>
          <Tooltip title="Открыть полю ввода" placement="right" followCursor>
            <button onClick={() => setIsShow(true)}>
              <KeyboardTabIcon style={{ color: "#000" }} />
            </button>
          </Tooltip>
        </div>
      )}
    </div>
  );
};

export default MainInfoForModal;
