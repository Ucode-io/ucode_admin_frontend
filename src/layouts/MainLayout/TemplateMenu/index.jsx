import {Box, Button, CircularProgress, Dialog} from "@mui/material";
import React, {useState} from "react";
import {useForm} from "react-hook-form";
import {Tab, TabList, TabPanel, Tabs} from "react-tabs";
import "react-tabs/style/react-tabs.css";
import {
  useTemplateCreateMutation,
  useTemplateImportMutation,
} from "../../../services/templateService";
import {useMenuTemplateCreateMutation} from "../../../services/menuTemplateService";
import FunctionsTable from "./FunctionsTable";
import MainTab from "./MainTab";
import MicroFunctions from "./MicroFunctions";
import styles from "./style.module.scss";
import TemplateSelection from "./TemplateSelection";
import TemplateTables from "./TemplateTables";

function TemplateMenu({
  closeModal = () => {},
  selectedFolder = {},
  element = {},
  templatePopover = "",
  setTemplatePopover = () => {},
}) {
  const [loading, setLoading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const {handleSubmit, control, reset} = useForm({
    defaultValues: {
      name: "",
      description: "",
      tables: [],
      functions: [],
      microfronts: [],
      photo: "",
    },
  });

  const {mutate: createTemplate} = useTemplateCreateMutation({
    onSuccess: (res) => {
      closeModal();
      reset();
    },
    onError: () => {
      setLoading(false);
    },
  });

  const {mutate: createMenuTemplate} = useMenuTemplateCreateMutation({
    onSuccess: (res) => {
      closeModal();
      reset();
    },
    onError: () => {
      setLoading(false);
    },
  });

  const {mutate: importTemplate} = useTemplateImportMutation({
    onSuccess: (res) => {
      closeModal();
      reset();
    },
    onError: () => {
      setLoading(false);
    },
  });

  const onSubmit = (data) => {
    setLoading(true);
    const computedData = {
      menu_id:
        selectedFolder?.id ||
        element?.id ||
        "c57eedc3-a954-4262-a0af-376c65b5a284",
      ...data,
    };

    const computedTemplate = {
      id: selectedTemplate?.id,
      ...data,
      tables: [],
      microfronts: [],
      functions: [],
    };

    if (selectedTemplate?.id) {
      importTemplate(computedTemplate);
    } else {
      if (templatePopover === "create-template") {
        createMenuTemplate(computedData);
      } else {
        createTemplate(computedData);
      }
    }
  };

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);

    reset({
      name: template.name || "",
      description: template.description || "",
      tables: template.tables || [],
      functions: template.functions || [],
      microfronts: template.microfronts || [],
      photo: template.photo || "",
      tables: template.tables?.tables || [],
    });

    setTemplatePopover("template");
  };

  if (templatePopover === "create-template") {
    return (
      <TemplateSelection
        closeModal={closeModal}
        onTemplateSelect={handleTemplateSelect}
        isLoading={false}
        templatePopover={templatePopover}
      />
    );
  }

  return (
    <Dialog
      open
      onClose={closeModal}
      PaperProps={{
        style: {
          width: "800px",
          maxWidth: "800px",
          height: "380px",
        },
      }}>
      <Box position={"relative"} px={3} pt={2}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Tabs className={styles.tabs}>
            <TabList className={styles.tabList}>
              <Tab className={styles.tab} selectedClassName={styles.activeTab}>
                Main
              </Tab>
              <Tab className={styles.tab} selectedClassName={styles.activeTab}>
                Tables
              </Tab>
              <Tab className={styles.tab} selectedClassName={styles.activeTab}>
                Functions
              </Tab>
              <Tab className={styles.tab} selectedClassName={styles.activeTab}>
                Micro Functions
              </Tab>
            </TabList>

            <TabPanel className={styles.tabPanel}>
              <MainTab control={control} />
            </TabPanel>

            <TabPanel className={styles.tabPanel}>
              <TemplateTables
                element={element}
                control={control}
                selectedFolder={selectedFolder}
                templatePopover={templatePopover}
              />
            </TabPanel>

            <TabPanel className={styles.tabPanel}>
              <FunctionsTable
                element={element}
                control={control}
                selectedFolder={selectedFolder}
                templatePopover={templatePopover}
              />
            </TabPanel>

            <TabPanel className={styles.tabPanel}>
              <MicroFunctions
                element={element}
                control={control}
                selectedFolder={selectedFolder}
                templatePopover={templatePopover}
              />
            </TabPanel>
          </Tabs>
        </form>

        <Box
          sx={{
            height: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
            position: "absolute",
            top: "15px",
            right: "25px",
          }}>
          <Button onClick={closeModal} variant="outlined" color="error">
            Cancel
          </Button>
          <Button
            disabled={loading}
            minWidth="111px"
            onClick={handleSubmit(onSubmit)}
            variant="contained"
            color="primary">
            {loading ? (
              <CircularProgress style={{color: "#fff"}} size={20} />
            ) : selectedTemplate?.id ? (
              "Import Template"
            ) : (
              "Make Template"
            )}
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
}

export default TemplateMenu;
