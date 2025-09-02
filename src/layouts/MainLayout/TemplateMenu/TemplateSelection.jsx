import React from "react";
import {
  Box,
  Button,
  Dialog,
  Typography,
  CircularProgress,
  Card,
  CardMedia,
} from "@mui/material";
import {useTemplatesListQuery} from "../../../services/templateService";

function TemplateSelection({
  closeModal = () => {},
  onTemplateSelect = () => {},
  isLoading = false,
  templatePopover = "",
}) {
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
          width: "800px",
          maxWidth: "800px",
          height: "380px",
        },
      }}>
      <Box position={"relative"} px={4} pt={3}>
        <Typography
          variant="h5"
          sx={{
            mb: 3,
            textAlign: "left",
            fontWeight: 600,
            color: "#374151",
            fontSize: "18px",
          }}>
          Featured templates
        </Typography>

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
              minHeight: "220px",
              overflowY: "hidden",
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 2,
              p: 2,
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
                }}
                onClick={() => onTemplateSelect(template)}>
                <Box
                  sx={{
                    height: "160px",
                    borderRadius: "12px",
                    overflow: "hidden",
                    backgroundColor: "#ffffff",
                    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                      transform: "translateY(-2px)",
                    },
                  }}>
                  <CardMedia
                    component="img"
                    height="160"
                    image={template.photo || "/img/template-placeholder.png"}
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
                    }}>
                    {template.name}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        )}

        <Box
          sx={{
            height: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
            position: "absolute",
            top: "20px",
            right: "30px",
          }}>
          <Button onClick={closeModal} variant="outlined" color="error">
            Cancel
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
}

export default TemplateSelection;
