import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import FormElementGenerator from "../../components/ElementGenerators/FormElementGenerator";
import FormCard from "./components/FormCard";
import styles from "./style.module.scss";
import IconGenerator from "@/components/IconPicker/IconGenerator";
import { Box, Tooltip } from "@mui/material";
import KeyboardTabIcon from "@mui/icons-material/KeyboardTab";
import NewFormCard from "./components/NewFormCard";
import PageFallback from "../../components/PageFallback";

const MainInfo = ({ computedSections, control, loader, setFormValue, relatedTable, relation, selectedTabIndex, selectedTab, selectedIndex }) => {
  const { tableSlug } = useParams();
  const [isShow, setIsShow] = useState(true);

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

  if(loader) return <PageFallback />

  return (
    <div className={styles.newcontainer}>
      {isShow ? (
        <div className={styles.newmainCardSide}>
          {computedSections.map((section) => (
            <NewFormCard
              key={section.id}
              title={section.label}
              className={styles.formCard}
              icon={section.icon}
            >
              <div className={styles.newformColumn}>
                {section.fields?.map((field) => (
                  <Box style={{minWidth: '250px', display: 'flex', alignItems: 'flex-start'}}>
                    <FormElementGenerator
                      key={field.id}
                      field={field}
                      control={control}
                      setFormValue={setFormValue}
                      fieldsList={fieldsList}
                      formTableSlug={tableSlug}
                      relatedTable={relatedTable}
                    />
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
              <KeyboardTabIcon style={{ color: "#000" }} />
            </button>
          </Tooltip>
        </div>
      )}
    </div>
  );
};

export default MainInfo;
