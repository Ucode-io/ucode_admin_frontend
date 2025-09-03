import {Box, Button, CircularProgress, Dialog, Typography} from "@mui/material";
import React, {useState} from "react";
import {useForm} from "react-hook-form";
import {Tab, TabList, TabPanel, Tabs} from "react-tabs";
import "react-tabs/style/react-tabs.css";
import {useMenuTemplateCreateMutation} from "../../../services/menuTemplateService";
import {useTemplateCreateMutation} from "../../../services/templateService";
import FunctionsTable from "./FunctionsTable";
import MainTab from "./MainTab";
import MicroFunctions from "./MicroFunctions";
import styles from "./style.module.scss";
import TemplateTables from "./TemplateTables";
import TemplateSelection from "./TemplateSelection";

function TemplateMenu({
  closeModal = () => {},
  selectedFolder = {},
  element = {},
  templatePopover = "",
  setTemplatePopover = () => {},
}) {
  const [loading, setLoading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const {handleSubmit, control, reset, watch} = useForm({
    defaultValues: {
      name: "",
      description: "",
      tables: [],
      functions: [],
      microfronts: [],
      photo: "",
    },
  });

  // Watch form values for conditional rendering
  const formValues = watch();

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

  const onSubmit = (data) => {
    setLoading(true);
    const computedData = {
      menu_id:
        selectedFolder?.id ||
        element?.id ||
        "c57eedc3-a954-4262-a0af-376c65b5a284",
      ...data,
    };

    if (templatePopover === "create-template") {
      createMenuTemplate(computedData);
    } else {
      createTemplate(computedData);
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
    });

    setTemplatePopover("template");
  };

  // Show template selection if create-template mode
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
          height: "500px",
        },
      }}>
      <Box position={"relative"} px={3} pt={2}>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Header with Buttons */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
              pb: 2,
              borderBottom: "1px solid #e5e7eb",
            }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                color: "#374151",
                fontSize: "18px",
              }}>
              {selectedTemplate?.id ? "Import Template" : "Create Template"}
            </Typography>

            <Box sx={{display: "flex", gap: 1}}>
              <Button
                onClick={closeModal}
                variant="outlined"
                sx={{
                  borderColor: "#d1d5db",
                  color: "#6b7280",
                  fontWeight: 500,
                  fontSize: "14px",
                  px: 3,
                  py: 1,
                  borderRadius: "8px",
                  textTransform: "none",
                  "&:hover": {
                    borderColor: "#9ca3af",
                    backgroundColor: "#f9fafb",
                  },
                }}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                minWidth="120px"
                variant="contained"
                sx={{
                  backgroundColor: "#3b82f6",
                  color: "#ffffff",
                  fontWeight: 500,
                  fontSize: "14px",
                  px: 3,
                  py: 1,
                  borderRadius: "8px",
                  textTransform: "none",
                  "&:hover": {
                    backgroundColor: "#2563eb",
                  },
                  "&:disabled": {
                    backgroundColor: "#9ca3af",
                  },
                }}>
                {loading ? (
                  <CircularProgress style={{color: "#fff"}} size={20} />
                ) : selectedTemplate?.id ? (
                  "Import Template"
                ) : (
                  "Create Template"
                )}
              </Button>
            </Box>
          </Box>

          {/* Content Area */}
          <Box sx={{height: "400px", overflow: "auto"}}>
            <Tabs className={styles.tabs}>
              <TabList className={styles.tabList}>
                <Tab
                  className={styles.tab}
                  selectedClassName={styles.activeTab}>
                  Main
                </Tab>
                <Tab
                  className={styles.tab}
                  selectedClassName={styles.activeTab}>
                  Tables
                </Tab>
                <Tab
                  className={styles.tab}
                  selectedClassName={styles.activeTab}>
                  Functions
                </Tab>
                <Tab
                  className={styles.tab}
                  selectedClassName={styles.activeTab}>
                  Micro Functions
                </Tab>
                <Tab
                  className={styles.tab}
                  selectedClassName={styles.activeTab}>
                  Details
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

              <TabPanel className={styles.tabPanel}>
                {/* Detail Page - Show template details when template is selected */}
                {selectedTemplate ? (
                  <Box sx={{p: 2}}>
                    <Typography variant="h6" sx={{mb: 2, fontWeight: 600}}>
                      Template Details
                    </Typography>

                    <Box sx={{display: "flex", gap: 3, mb: 3}}>
                      {selectedTemplate.photo && (
                        <Box
                          component="img"
                          src={selectedTemplate.photo}
                          alt={selectedTemplate.name}
                          sx={{
                            width: 120,
                            height: 120,
                            objectFit: "cover",
                            borderRadius: "8px",
                            border: "1px solid #e5e7eb",
                          }}
                        />
                      )}

                      <Box sx={{flex: 1}}>
                        <Typography variant="h6" sx={{mb: 1, fontWeight: 600}}>
                          {selectedTemplate.name}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{mb: 2, color: "#6b7280"}}>
                          {selectedTemplate.description}
                        </Typography>

                        <Box sx={{display: "flex", gap: 2, mb: 2}}>
                          <Box
                            sx={{
                              px: 2,
                              py: 0.5,
                              backgroundColor: selectedTemplate.is_free
                                ? "#dcfce7"
                                : "#dbeafe",
                              color: selectedTemplate.is_free
                                ? "#166534"
                                : "#1e40af",
                              borderRadius: "4px",
                              fontSize: "12px",
                              fontWeight: 500,
                            }}>
                            {selectedTemplate.is_free ? "Free" : "Premium"}
                          </Box>

                          {selectedTemplate.rating && (
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 0.5,
                              }}>
                              <Typography
                                variant="body2"
                                sx={{fontSize: "12px"}}>
                                ⭐ {selectedTemplate.rating}
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      </Box>
                    </Box>

                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr 1fr",
                        gap: 2,
                      }}>
                      <Box
                        sx={{
                          p: 2,
                          backgroundColor: "#f9fafb",
                          borderRadius: "8px",
                        }}>
                        <Typography
                          variant="subtitle2"
                          sx={{fontWeight: 600, mb: 1}}>
                          Tables ({formValues.tables?.length || 0})
                        </Typography>
                        <Typography variant="body2" sx={{color: "#6b7280"}}>
                          {formValues.tables?.length > 0
                            ? formValues.tables.map((t) => t.label).join(", ")
                            : "No tables selected"}
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          p: 2,
                          backgroundColor: "#f9fafb",
                          borderRadius: "8px",
                        }}>
                        <Typography
                          variant="subtitle2"
                          sx={{fontWeight: 600, mb: 1}}>
                          Functions ({formValues.functions?.length || 0})
                        </Typography>
                        <Typography variant="body2" sx={{color: "#6b7280"}}>
                          {formValues.functions?.length > 0
                            ? formValues.functions
                                .map((f) => f.label)
                                .join(", ")
                            : "No functions selected"}
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          p: 2,
                          backgroundColor: "#f9fafb",
                          borderRadius: "8px",
                        }}>
                        <Typography
                          variant="subtitle2"
                          sx={{fontWeight: 600, mb: 1}}>
                          Microfronts ({formValues.microfronts?.length || 0})
                        </Typography>
                        <Typography variant="body2" sx={{color: "#6b7280"}}>
                          {formValues.microfronts?.length > 0
                            ? formValues.microfronts
                                .map((m) => m.label)
                                .join(", ")
                            : "No microfronts selected"}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                ) : (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "300px",
                      backgroundColor: "#f9fafb",
                      borderRadius: "8px",
                      border: "2px dashed #d1d5db",
                    }}>
                    <Typography
                      variant="body1"
                      sx={{
                        color: "#6b7280",
                        fontSize: "16px",
                        fontWeight: 500,
                      }}>
                      Select a template to view details
                    </Typography>
                  </Box>
                )}
              </TabPanel>
            </Tabs>
          </Box>
        </form>
      </Box>
    </Dialog>
  );
}

export default TemplateMenu;
