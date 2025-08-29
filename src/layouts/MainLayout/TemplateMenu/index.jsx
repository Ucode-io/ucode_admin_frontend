import React from "react";
import {
  Box,
  Button,
  Dialog,
  TextField,
  Grid,
  Typography,
  Paper,
} from "@mui/material";
import {useForm, Controller} from "react-hook-form";
import {Tab, Tabs, TabList, TabPanel} from "react-tabs";
import "react-tabs/style/react-tabs.css";
import styles from "./style.module.scss";
import MainTab from "./MainTab";

function TemplateMenu({closeModal = () => {}, selectedFolder = {}}) {
  const {handleSubmit, control, reset} = useForm({
    defaultValues: {
      name: "",
      description: "",
      tableNote: "",
      functionNote: "",
      mfNote: "",
    },
  });

  const onSubmit = (data) => {
    console.log("Full Form Data:", data);
    closeModal();
    reset();
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
              <Typography variant="h6">Tables</Typography>
              <Controller
                name="tableNote"
                control={control}
                render={({field}) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Table Notes"
                    variant="outlined"
                    margin="normal"
                  />
                )}
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
            onClick={handleSubmit(onSubmit)}
            variant="contained"
            color="primary">
            Make Template
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
}

export default TemplateMenu;
