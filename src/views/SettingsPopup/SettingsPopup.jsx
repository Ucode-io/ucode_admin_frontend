import cls from "./styles.module.scss";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import {useSettingsPopupProps} from "./useSettingsPopupProps";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Typography,
} from "@mui/material";
import { Flex } from "@chakra-ui/react";
import clsx from "clsx";
import { SettingsPopupProvider } from "./providers";
import { isValidElement } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddIcon from "@mui/icons-material/Add";
import { FolderCreateModal } from "./components/FolderCreateModal";
import { TAB_COMPONENTS } from "../../utils/constants/settingsPopup";

const TabTitle = ({ tab, children, ...props }) => {
  return (
    <Flex columnGap="8px" cursor="pointer" {...props}>
      {tab?.icon && tab?.icon}
      <Typography className={cls.tabItemTitle} flexGrow={1} variant="p">
        {children}
      </Typography>
    </Flex>
  );
};

export const SettingsPopup = ({ open, onClose }) => {
  const {
    handleClose,
    t,
    tabs,
    activeTab,
    handleChangeTab,
    tabComponents,
    searchParams,
    setSearchParams,
    updateSearchParam,
    handlePermissionClick,
    activeChildId,
    handleOpenClientTypeModal,
    handleCloseClientTypeModal,
    isClientTypeModalOpen,
    permissionChild,
  } = useSettingsPopupProps({ onClose });

  console.log(searchParams.get("tab"));

  return (
    <SettingsPopupProvider
      value={{
        activeTab,
        handleChangeTab,
        searchParams,
        setSearchParams,
        updateSearchParam,
        handleClose,
        permissionChild,
      }}
    >
      <Dialog
        open={open}
        onClose={handleClose}
        className={cls.dialog}
        PaperProps={{
          sx: {
            borderRadius: "12px !important",
            maxWidth: "1150px !important",
            width: "100% !important",
          },
        }}
      >
        <DialogContent className={cls.dialogContent} sx={{ padding: 0 }}>
          <Box className={cls.content}>
            <Box className={cls.leftBarWrapper}>
              <Box className={cls.leftBar}>
                {tabs.map((tab, index) => {
                  return (
                    <Box mb="20px" key={index}>
                      <Typography className={cls.leftBarTitle} variant="h2">
                        {tab?.title}
                      </Typography>
                      {tab?.tabs?.map((tab, tabIndex) => {
                        return (
                          <Box>
                            {tab?.children ? (
                              <Accordion
                                sx={{
                                  boxShadow: "none !important",
                                  backgroundColor: "transparent !important",
                                  "& .MuiPaper-root": {
                                    boxShadow: "none !important",
                                  },
                                  "& .MuiAccordionSummary-content": {
                                    margin: "0 !important",
                                  },
                                  "& .MuiButtonBase-root": {
                                    minHeight: "27px !important",
                                    paddingLeft: "12px",
                                    paddingRight: "12px",
                                  },
                                }}
                              >
                                <AccordionSummary
                                  expandIcon={<ExpandMoreIcon />}
                                  aria-controls="panel1-content"
                                  id="panel1-header"
                                  sx={{
                                    borderRadius: "4px",
                                    "&:hover": {
                                      backgroundColor:
                                        "rgba(55, 53, 47, 0.06) !important",
                                    },
                                  }}
                                >
                                  <TabTitle tab={tab}>{tab?.title}</TabTitle>
                                </AccordionSummary>
                                <AccordionDetails>
                                  {tab?.children?.map((child) => (
                                    <Box
                                      key={child?.id}
                                      sx={{
                                        position: "relative",
                                        paddingLeft: "28px",
                                        fontSize: "14px",
                                        lineHeight: "20px",
                                        fontWeight: "400",
                                        paddingTop: "4px",
                                        paddingBottom: "4px",
                                        borderRadius: "4px",
                                        backgroundColor:
                                          child?.guid === activeChildId
                                            ? "rgba(55, 53, 47, 0.06)"
                                            : "transparent",

                                        color: "rgb(55, 53, 47)",
                                        "&::after": {
                                          width: "4px",
                                          height: "4px",
                                          position: "absolute",
                                          top: "50%",
                                          left: "12px",
                                          borderRadius: "50%",
                                          backgroundColor: "#344054",
                                          transform: "translateY(-50%)",
                                          content: '""',
                                        },
                                        "&:hover": {
                                          backgroundColor:
                                            "rgba(55, 53, 47, 0.06) !important",
                                        },
                                      }}
                                    >
                                      <TabTitle
                                        tab={child}
                                        onClick={() =>
                                          handlePermissionClick(child)
                                        }
                                      >
                                        {child?.name}
                                      </TabTitle>
                                    </Box>
                                  ))}
                                  <button
                                    className={cls.addClientTypeBtn}
                                    onClick={handleOpenClientTypeModal}
                                  >
                                    <span>
                                      <span className={cls.addIcon}>
                                        <AddIcon />
                                      </span>
                                      <span>Add client type</span>
                                    </span>
                                  </button>
                                </AccordionDetails>
                              </Accordion>
                            ) : (
                              <Flex
                                className={clsx(cls.tabItem, {
                                  [cls.active]: activeTab === tab?.key,
                                })}
                                onClick={() => handleChangeTab(tab?.key)}
                                alignItems="center"
                                key={tabIndex}
                              >
                                <TabTitle tab={tab}>{tab?.title}</TabTitle>
                              </Flex>
                            )}
                          </Box>
                        );
                      })}
                    </Box>
                  );
                })}
              </Box>
            </Box>
            <Box
              className={clsx(cls.rightContent, {
                [cls.smPadding]:
                  searchParams.get("tab") ===
                  TAB_COMPONENTS.PERMISSIONS.PERMISSIONS_DETAIL,
              })}
            >
              {isValidElement(tabComponents[activeTab])
                ? tabComponents[activeTab]
                : (tabComponents[activeTab]?.[searchParams.get("tab")] ??
                  tabComponents[activeTab]?.[activeTab])}
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
      {isClientTypeModalOpen && (
        <FolderCreateModal
          closeModal={handleCloseClientTypeModal}
          modalType="CREATE"
        />
      )}
    </SettingsPopupProvider>
  );
};
