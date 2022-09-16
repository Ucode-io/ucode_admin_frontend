import { Close } from "@mui/icons-material";
import { Backdrop, Box, Card, Fade, Modal, Typography } from "@mui/material";
import { useState } from "react";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import CMultipleSelect from "../../../../../components/CMultipleSelect";

import styles from './styles.module.scss'
import SettingsTab from "./Tabs/SettingsTab";

const ActionForm = ({isOpen, handleClose}) => {
  const [selectedTab, setSelectedTab] = useState(0)
   const [value, setValue] = useState([])

  const onSelectHandler = (e) => {
    const computedValue = e.target.value
    setValue(computedValue ?? [])
  }

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '60%',
    bgcolor: '#fff',
    boxShadow: 24,
    borderRadius: '6px'
    // pt: 2,
    // px: 4,
    // pb: 3,
  };

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={isOpen}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={isOpen}>
        <Box sx={style}>
          <Tabs
            direction={"ltr"}
            selectedIndex={selectedTab}
            onSelect={setSelectedTab}
          >
            <div className={styles.modal_header}>
              <div>
                <p>Automations</p>
                <TabList>
                  <Tab>Настройки</Tab>
                  <Tab>Событие</Tab>
                </TabList>
              </div>
              <span>
                <Close htmlColor="#6E8BB7" />
              </span>
            </div>

            <TabPanel>
              <SettingsTab />
            </TabPanel>
            <TabPanel>
              22222
            </TabPanel>
          </Tabs>
        </Box>
      </Fade>
    </Modal>
  )
}

export default ActionForm
