import React, {useState} from "react";
import {
  Box,
  Button,
  Dialog,
  TextField,
  Grid,
  Typography,
  Paper,
  CircularProgress,
} from "@mui/material";
import {useForm, Controller} from "react-hook-form";
import {Tab, Tabs, TabList, TabPanel} from "react-tabs";
import "react-tabs/style/react-tabs.css";
import styles from "./style.module.scss";
import MainTab from "./MainTab";
import TemplateTables from "./TemplateTables";
import {useTemplateCreateMutation} from "../../../services/templateService";

function TemplateMenu({
  closeModal = () => {},
  selectedFolder = {},
  element = {},
}) {
  const [loading, setLoading] = useState(false);
  const {handleSubmit, control, reset} = useForm({
    defaultValues: {
      name: "",
      description: "",
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

  const onSubmit = (data) => {
    setLoading(true);
    const computedData = {
      menu_id: selectedFolder?.id,
      ...data,
    };
    createTemplate(computedData);
  };

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
                MF
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
              />
            </TabPanel>

            <TabPanel className={styles.tabPanel}>
              <Typography variant="h6">Functions</Typography>
              <Controller
                name="functionNote"
                control={control}
                render={({field}) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Functions Notes"
                    variant="outlined"
                    margin="normal"
                  />
                )}
              />
            </TabPanel>

            <TabPanel className={styles.tabPanel}>
              <Typography variant="h6">MF</Typography>
              <Controller
                name="mfNote"
                control={control}
                render={({field}) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="MF Notes"
                    variant="outlined"
                    margin="normal"
                  />
                )}
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
            top: "25px",
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
