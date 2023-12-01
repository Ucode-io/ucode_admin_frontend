import KeyboardTabIcon from "@mui/icons-material/KeyboardTab";
import {Box, Button, Tooltip} from "@mui/material";
import {useEffect, useMemo, useState} from "react";
import {useTranslation} from "react-i18next";
import {useParams} from "react-router-dom";
import FormElementGenerator from "../../components/ElementGenerators/FormElementGenerator";
import PageFallback from "../../components/PageFallback";
import {useProjectGetByIdQuery} from "../../services/projectService";
import {store} from "../../store";
import NewFormCard from "./components/NewFormCard";
import styles from "./style.module.scss";
import ButtonsPopover from "../../components/ButtonsPopover";
import {useWatch} from "react-hook-form";

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

  useEffect(() => {
    if (isMultiLanguage) {
      setActiveLang(projectInfo?.language?.[0]?.short_name);
    }
  }, [isMultiLanguage, projectInfo]);
  const {i18n} = useTranslation();

  if (loader) return <PageFallback />;

  const removeField = (section, field, fieldIndex) => {
    console.log("fieldfield", section, field);
    remove(indexField);
  };

  return (
    <div className={styles.newcontainerModal}>
      {isShow ? (
        <div className={styles.newmainCardSide}>
          {isMultiLanguage && (
            <div className={styles.language}>
              {projectInfo?.language?.map((lang) => (
                <Button
                  className={activeLang === lang?.short_name && styles.active}
                  onClick={() => setActiveLang(lang?.short_name)}
                >
                  {lang?.name}
                </Button>
              ))}
            </div>
          )}

          {computedSections.map((section) => (
            <NewFormCard
              key={section.id}
              title={
                section?.attributes?.[`label_${i18n.language}`] ?? section.label
              }
              className={styles.formCard}
              icon={section.icon}
            >
              <div className={styles.newformColumn}>
                {section.fields?.map((field, fieldIndex) => (
                  <Box
                    style={{
                      display: "flex",
                      alignItems: "center",
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
                    {editAcces && (
                      <ButtonsPopover
                        className={styles.deleteButton}
                        //   onEditClick={() => openSettingsBlock(field)}
                        onDeleteClick={() =>
                          removeField(section, field, fieldIndex)
                        }
                      />
                    )}
                  </Box>
                ))}
              </div>
            </NewFormCard>
          ))}
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

export default MainInfoForModal;
