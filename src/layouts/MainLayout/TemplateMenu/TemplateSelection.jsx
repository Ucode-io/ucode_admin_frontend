import React, {useState} from "react";
import {
  Box,
  Button,
  Dialog,
  Typography,
  CircularProgress,
  Card,
  CardMedia,
} from "@mui/material";
import {useForm} from "react-hook-form";
import {
  useTemplateImportMutation,
  useTemplatesListQuery,
} from "../../../services/templateService";
import TemplateDetailPage from "./TemplateDetailPage";

function TemplateSelection({
  closeModal = () => {},
  onTemplateSelect = () => {},
  isLoading = false,
  templatePopover = "",
  getMenuList = () => {},
  setTemplatePopover = () => {},
  element = {},
  selectedFolder = {},
}) {
  const [loading, setLoading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showDetailPage, setShowDetailPage] = useState(false);

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

  const {mutate: importTemplate} = useTemplateImportMutation({
    onSuccess: (res) => {
      closeModal();
      reset();
      getMenuList();
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
    importTemplate(computedData);
  };

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    setShowDetailPage(true);

    reset({
      name: template.name || "",
      description: template.description || "",
      tables: template.tables || [],
      functions: template.functions || [],
      microfronts: template.microfronts || [],
      photo: template.photo || "",
    });
  };

  const handleBackToList = () => {
    setShowDetailPage(false);
    setSelectedTemplate(null);
  };

  const handleImportTemplate = (data) => {
    setLoading(true);
    const computedData = {
      id: selectedTemplate?.id || "",
      // menu_id:
      //   selectedFolder?.id ||
      //   element?.id ||
      //   "c57eedc3-a954-4262-a0af-376c65b5a284",
      // ...data,
    };
    importTemplate(computedData);
  };

  const {data: templates} = useTemplatesListQuery({
    queryParams: {
      enabled: templatePopover === "create-template",
    },
  });

  return (
    <Dialog
      open
      onClose={closeModal}
      PaperProps={{
        style: {
          width: "1000px",
          maxWidth: "1000px",
          height: "550px",
          backgroundColor: showDetailPage ? "#fff" : "#ffffff",
        },
      }}>
      <Box position={"relative"} pt={2} sx={{height: "100%"}}>
        {showDetailPage ? (
          <TemplateDetailPage
            template={selectedTemplate}
            onBack={handleBackToList}
            onImport={handleImportTemplate}
            loading={loading}
          />
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 1,
                pb: "5px",
                px: 3,
                borderBottom: "1px solid #e5e7eb",
              }}>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 600,
                  color: "#374151",
                  fontSize: "18px",
                }}>
                Featured templates
              </Typography>

              <Box sx={{display: "flex", gap: 1}}>
                <Button
                  color="error"
                  onClick={closeModal}
                  variant="outlined"
                  sx={{height: "32px"}}>
                  Cancel
                </Button>
                {selectedTemplate && (
                  <Button
                    type="submit"
                    disabled={loading}
                    minWidth="120px"
                    variant="contained"
                    sx={{
                      height: "32px",
                    }}>
                    {loading ? (
                      <CircularProgress style={{color: "#fff"}} size={20} />
                    ) : (
                      "Import Template"
                    )}
                  </Button>
                )}
              </Box>
            </Box>

            <Box sx={{height: "500px", overflow: "auto"}}>
              {isLoading ? (
                <Box
                  display="flex"
                  flexDirection="column"
                  justifyContent="center"
                  alignItems="center"
                  height="280px"
                  gap={2}>
                  <CircularProgress size={40} sx={{color: "#3b82f6"}} />
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#6b7280",
                      fontSize: "14px",
                      fontWeight: 500,
                    }}>
                    Loading templates...
                  </Typography>
                </Box>
              ) : (
                <Box
                  sx={{
                    minHeight: "280px",
                    overflowY: "hidden",
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: 2,
                    p: 1,
                    "&::-webkit-scrollbar": {
                      width: "6px",
                    },
                    "&::-webkit-scrollbar-track": {
                      background: "#f1f1f1",
                      borderRadius: "3px",
                    },
                    "&::-webkit-scrollbar-thumb": {
                      background: "#c1c1c1",
                      borderRadius: "3px",
                      "&:hover": {
                        background: "#a8a8a8",
                      },
                    },
                  }}>
                  {templates?.templates?.map((template) => (
                    <Box
                      key={template.id}
                      sx={{
                        cursor: "pointer",
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                        borderRadius: "12px",
                        p: 1,
                        transition: "all 0.2s ease-in-out",
                      }}
                      onClick={() => handleTemplateSelect(template)}>
                      <Box
                        sx={{
                          height: "160px",
                          borderRadius: "12px",
                          overflow: "hidden",
                          backgroundColor: "#ffffff",
                          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                          transition: "all 0.2s ease-in-out",
                        }}>
                        <CardMedia
                          component="img"
                          height="160"
                          image={
                            template.photo || "/img/template-placeholder.png"
                          }
                          alt={template.name}
                          sx={{
                            objectFit: "cover",
                            width: "100%",
                            height: "160px",
                          }}
                        />
                      </Box>

                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 0.5,
                        }}>
                        <Box
                          sx={{display: "flex", alignItems: "center", gap: 1}}>
                          <Box
                            sx={{
                              width: 20,
                              height: 20,
                              borderRadius: "50%",
                              backgroundColor: "#374151",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0,
                            }}>
                            <Typography
                              sx={{
                                color: "#ffffff",
                                fontSize: "10px",
                                fontWeight: 600,
                              }}>
                              {template.name?.[0] || "T"}
                            </Typography>
                          </Box>
                          <Typography
                            variant="subtitle1"
                            component="div"
                            sx={{
                              textAlign: "left",
                              fontSize: "14px",
                              fontWeight: 600,
                              color: "#374151",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              flex: 1,
                            }}>
                            {template.name}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          </form>
        )}
      </Box>
    </Dialog>
  );
}

export default TemplateSelection;
