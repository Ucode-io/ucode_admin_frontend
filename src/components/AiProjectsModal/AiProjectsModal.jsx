import mcpService from "@/services/mcp/mcp.service";
import { List, ListItem, ListItemText, Modal, Typography } from "@mui/material";
import Add from "@mui/icons-material/Add";
import Edit from "@mui/icons-material/Edit";
import Delete from "@mui/icons-material/Delete";
import { useEffect, useState } from "react";
import cls from "./styles.module.scss";
import { Box, Button, Popover, PopoverContent, PopoverTrigger } from "@chakra-ui/react";
import { BsThreeDots } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

export const AiProjectsModal = ({children}) => {

  const navigate = useNavigate();

  const [aiProjects, setAiProjects] = useState([]);
  const [editingProject, setEditingProject] = useState(null);

  const [isProjectsModalOpen, setIsProjectsModalOpen] = useState(false);
  const [projectEditAnchorEl, setProjectEditAnchorEl] = useState(false);

  const handleOpen = (aiProjects) => {
    if (aiProjects?.length > 0) setIsProjectsModalOpen(true);
    else navigate("/ai-agent");
  };

  const handleNavigateToProject = (id) => {
    navigate(`/ai-agent/${id}`);
  };

  const handleOpenProjectSettings = (event) => {
    setProjectEditAnchorEl(event.currentTarget);
  };

  const handleUpdateProject = (e) => {
    e.preventDefault();
    const elements = e.target.elements;

    const data = {
      title: elements.title.value,
      description: elements.description.value,
      id: editingProject?.id,
    };

    mcpService.updateProject(data, editingProject?.id).then(() => {
      setEditingProject(null);
      setAiProjects((prev) =>
        prev?.map((el) =>
          el?.id === editingProject?.id ? { ...editingProject, ...data } : el,
        ),
      );
    });
  };

  const handleClick = () => {
    mcpService.getProjects().then((res) => {
      setAiProjects(res.projects);
      handleOpen(res.projects);
    });
  };

  return (
    <div className={cls.container}>
      <div
        className={cls.button}
        onClick={(e) => {
          e.stopPropagation();
          handleClick();
        }}
      >
        {children}
      </div>
      <Modal
        open={isProjectsModalOpen}
        onClose={() => setIsProjectsModalOpen(false)}
      >
        <Box
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "#fff",
            borderRadius: "12px",
            outline: "none",
            width: 400,
            padding: "20px",
            boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.2)",
            textAlign: "center",
          }}
        >
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="h6">Select Project</Typography>
            <button onClick={() => navigate("/ai-agent")}>
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  color: "#2d6ce5",
                }}
              >
                <Add />
                <span>Add new project</span>
              </span>
            </button>
          </Box>
          <List>
            {aiProjects?.map((project) => (
              <ListItem
                key={project.id}
                sx={{
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.1)",
                  },
                  borderRadius: "4px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
                onClick={() => handleNavigateToProject(project.id)}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    justifyContent: "flex-start",
                  }}
                >
                  <ListItemText primary={project.title} />
                  <ListItemText style={{ fontSize: "12px", color: "#888888" }}>
                    {project.description}
                  </ListItemText>
                </Box>
                <Popover
                  id={"simple-popover"}
                  // open={projectSettingsOpen}
                  anchorEl={projectEditAnchorEl}
                  onClose={() => setProjectEditAnchorEl(null)}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                >
                  <PopoverTrigger>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenProjectSettings(e);
                      }}
                      _hover={{
                        backgroundColor: "rgba(255, 255, 255, 0.87)",
                      }}
                      style={{
                        width: "20px",
                        height: "20px",
                        transform: "rotate(90deg)",
                        borderRadius: "6px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <BsThreeDots />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        padding: "4px",
                        backgroundColor: "#fff",
                        borderRadius: "6px",
                        boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.1)",
                      }}
                    >
                      <button
                        style={{
                          display: "flex",
                          borderRadius: "4px",
                          padding: "2px",
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingProject(project);
                        }}
                        // _hover={{
                        //   backgroundColor: "rgba(0, 0, 0, 0.1) !important",
                        // }}
                      >
                        <Edit htmlColor="#8F8E8B" />
                      </button>
                      <button
                        style={{
                          display: "flex",
                          borderRadius: "4px",
                          padding: "2px",
                        }}
                        // onClick={() => handleDeleteProject(project.id)}
                        // _hover={{
                        //   backgroundColor: "rgba(0, 0, 0, 0.1) !important",
                        // }}
                      >
                        <Delete htmlColor="rgb(255 76 76)" />
                      </button>
                    </div>
                  </PopoverContent>
                </Popover>
              </ListItem>
            ))}
          </List>
        </Box>
      </Modal>

      <Modal open={!!editingProject} onClose={() => setEditingProject(null)}>
        <form
          onSubmit={handleUpdateProject}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "#fff",
            borderRadius: "12px",
            outline: "none",
            width: 400,
            padding: "16px 16px 10px",
            boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.2)",
            textAlign: "center",
          }}
        >
          <div className={cls.modalContainer}>
            <label
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <span style={{ color: "#8F8E8B" }}>Title</span>
              <input
                style={{
                  width: "100%",
                  outline: "none",
                  border: "none",
                  borderBottom: "1px solid #ccc",
                }}
                placeholder="Project title"
                defaultValue={editingProject?.title}
                id="title"
              />
            </label>
            <label
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <span style={{ color: "#8F8E8B" }}>Description</span>
              <input
                style={{
                  width: "100%",
                  outline: "none",
                  border: "none",
                  borderBottom: "1px solid #ccc",
                }}
                placeholder="Project description"
                defaultValue={editingProject?.description}
                id="description"
              />
            </label>
          </div>
          <div className={cls.modalFooter}>
            <button className={cls.submitBtn} type={"submit"}>
              Apply changes
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );

}