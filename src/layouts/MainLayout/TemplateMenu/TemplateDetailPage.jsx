import ShareIcon from "@mui/icons-material/Share";
import {Box, Button, Card, IconButton, Typography} from "@mui/material";
import React from "react";
import {useForm} from "react-hook-form";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

function TemplateDetailPage({
  template,
  onBack,
  onImport = () => {},
  loading = false,
}) {
  const {handleSubmit, control, reset} = useForm({
    defaultValues: {
      name: template?.name || "",
      description: template?.description || "",
      tables: template?.tables || [],
      functions: template?.functions || [],
      microfronts: template?.microfronts || [],
      photo: template?.photo || "",
      id: template?.id || "",
    },
  });

  const onSubmit = (data) => {
    console.log("dataaaaaaa", data);

    onImport(data);
  };

  function stripHTML(html) {
    return html?.replace(/<[^>]*>/g, "");
  }

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
            pb: 1,
            px: 3,
            borderBottom: "1px solid #e5e7eb",
          }}>
          <Box sx={{display: "flex", alignItems: "center", gap: 2}}>
            <Box
              sx={{
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              onClick={onBack}>
              <ArrowBackIosIcon />
            </Box>
          </Box>

          <Box sx={{display: "flex", gap: 1, alignItems: "center"}}></Box>
        </Box>

        <Box sx={{flex: 1, display: "flex", gap: 3, px: 3, pt: "30px"}}>
          <Box sx={{flex: 1, maxWidth: "340px"}}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                backgroundColor: "#000000",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 2,
              }}>
              <Typography
                sx={{
                  color: "#ffffff",
                  fontSize: "18px",
                  fontWeight: 600,
                }}>
                {template?.name?.[0] || "T"}
              </Typography>
            </Box>

            <Typography
              variant="h4"
              sx={{
                color: "#374151",
                fontSize: "32px",
                fontWeight: 700,
                mb: 1,
                lineHeight: 1.2,
              }}>
              {template?.name || "Template"}
            </Typography>

            <Typography
              variant="h6"
              sx={{
                color: "#6b7280",
                fontSize: "16px",
                fontWeight: 400,
                mb: 3,
                lineHeight: 1.4,
              }}>
              {stripHTML(template?.description) ||
                "Easy to use, simple & insightful template"}
            </Typography>

            <Box sx={{display: "flex", gap: 2, alignItems: "center"}}>
              <Button
                disabled={loading}
                type="submit"
                variant="contained"
                sx={{
                  height: "40px",
                  width: "50%",
                  backgroundColor: "#3b82f6",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: 600,
                  "&:hover": {
                    backgroundColor: "#2563eb",
                  },
                }}>
                {loading ? "Importing..." : "Import"}
              </Button>

              {/* <Button
                variant="outlined"
                sx={{
                  height: "40px",
                  width: "50%",
                  borderColor: "#d1d5db",
                  color: "#374151",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: 600,
                  "&:hover": {
                    borderColor: "#9ca3af",
                    backgroundColor: "#f9fafb",
                  },
                }}>
                Preview
              </Button> */}
            </Box>
          </Box>

          <Box sx={{flex: 1, minWidth: "500px"}}>
            <Card
              sx={{
                backgroundColor: "#ffffff",
                borderRadius: "12px",
                overflow: "hidden",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                border: "1px solid #e5e7eb",
              }}>
              <Box
                sx={{
                  height: "400px",
                  backgroundImage: `url(${template?.photo || "/img/template-placeholder.png"})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  borderRadius: "8px",
                }}
              />
            </Card>
          </Box>
        </Box>
      </form>
    </Box>
  );
}

export default TemplateDetailPage;
