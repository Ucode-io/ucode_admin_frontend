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
import {Flex} from "@chakra-ui/react";
import clsx from "clsx";
import {SettingsPopupProvider} from "./providers";
import {isValidElement} from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddIcon from "@mui/icons-material/Add";
import {FolderCreateModal} from "./components/FolderCreateModal";
import {TAB_COMPONENTS} from "../../utils/constants/settingsPopup";
import {useSelector} from "react-redux";
import {selectThemeMode} from "../../store/theme/theme.slice";

// Dark mode colors - Notion inspired
const darkColors = {
  bgPrimary: "#191919",
  bgSecondary: "#202020",
  bgTertiary: "#2f2f2f",
  bgHover: "#363636",
  textPrimary: "#ffffffcf",
  textSecondary: "#ffffff71",
  border: "#ffffff14",
  iconColor: "#9b9b9b",
};

const TabTitle = ({tab, children, isDark, ...props}) => {
  return (
    <Flex columnGap="8px" cursor="pointer" {...props}>
      {tab?.icon && (
        <Box sx={{ color: isDark ? darkColors.iconColor : "inherit", display: "flex", alignItems: "center" }}>
          {tab?.icon}
        </Box>
      )}
      <Typography 
        className={cls.tabItemTitle} 
        flexGrow={1} 
        variant="p"
        sx={{ color: isDark ? darkColors.textPrimary : "rgb(55, 53, 47)" }}
      >
        {children}
      </Typography>
    </Flex>
  );
};

export const SettingsPopup = ({open, onClose}) => {
  const themeMode = useSelector(selectThemeMode);
  const isDark = themeMode === "dark";
  
  const {
    handleClose,
    tabs,
    activeTab,
    handleChangeTab,
    tabComponents,
    searchParams,
    setSearchParams,
    updateSearchParam,
    handlePermissionClick,
    handleFilesClick,
    activeChildId,
    handleOpenClientTypeModal,
    handleCloseClientTypeModal,
    isClientTypeModalOpen,
    permissionChild,
    tab,
  } = useSettingsPopupProps({ onClose });

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
      }}>
      <Dialog
        open={open}
        onClose={handleClose}
        className={cls.dialog}
        PaperProps={{
          sx: {
            borderRadius: "12px !important",
            maxWidth: "1150px !important",
            width: "100% !important",
            backgroundColor: isDark ? darkColors.bgPrimary : "#fff",
          },
        }}>
        <DialogContent className={cls.dialogContent} sx={{padding: 0, backgroundColor: isDark ? darkColors.bgPrimary : "#fff"}}>
          <Box className={cls.content} sx={{ backgroundColor: isDark ? darkColors.bgPrimary : "#fff" }}>
            <Box 
              className={cls.leftBarWrapper}
              sx={{
                backgroundColor: isDark ? darkColors.bgSecondary : "#fbfbfa",
                borderRight: isDark ? `1px solid ${darkColors.border}` : "none",
              }}
            >
              <Box className={cls.leftBar}>
                {tabs.map((tab, index) => {
                  return (
                    <Box mb="20px" key={index}>
                      <Typography 
                        className={cls.leftBarTitle} 
                        variant="h2"
                        sx={{ color: isDark ? darkColors.textSecondary : "rgba(55, 53, 47, 0.65)" }}
                      >
                        {tab?.title ?? tab?.label}
                      </Typography>
                      {tab?.tabs?.map((tab, tabIndex) => {
                        return (
                          <Box key={tabIndex}>
                            {tab?.children ? (
                              <Accordion
                                sx={{
                                  boxShadow: "none !important",
                                  backgroundColor: "transparent !important",
                                  color: isDark ? darkColors.textPrimary : "inherit",
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
                                  expandIcon={<ExpandMoreIcon sx={{ color: isDark ? darkColors.iconColor : "inherit" }} />}
                                  aria-controls="panel1-content"
                                  id="panel1-header"
                                  sx={{
                                    borderRadius: "4px",
                                    "&:hover": {
                                      backgroundColor: isDark 
                                        ? darkColors.bgHover 
                                        : "rgba(55, 53, 47, 0.06) !important",
                                    },
                                  }}
                                >
                                  <TabTitle tab={tab} isDark={isDark}>{tab?.title}</TabTitle>
                                </AccordionSummary>
                                <AccordionDetails>
                                  {tab?.children?.map((child) => (
                                    <>
                                      <Box
                                        className={cls.tabChildren}
                                        key={child?.id}
                                        sx={{
                                          backgroundColor:
                                            child?.guid === activeChildId
                                              ? (isDark ? darkColors.bgHover : "rgba(55, 53, 47, 0.06)")
                                              : "transparent",
                                          color: isDark ? darkColors.textPrimary : "rgb(55, 53, 47)",
                                          "&::after": {
                                            backgroundColor: isDark ? darkColors.textSecondary : "#344054",
                                          },
                                          "&:hover": {
                                            backgroundColor: isDark ? darkColors.bgHover : "rgba(55, 53, 47, 0.06)",
                                          },
                                        }}
                                      >
                                        <TabTitle
                                          tab={child}
                                          isDark={isDark}
                                          onClick={() => {
                                            child?.type === "MINIO_FOLDER"
                                              ? handleFilesClick(child)
                                              : handlePermissionClick(child);
                                          }}
                                        >
                                          {child?.name ?? child?.label}
                                        </TabTitle>
                                      </Box>
                                    </>
                                  ))}
                                  {tab?.key === "permissions" && (
                                    <button
                                      className={cls.addClientTypeBtn}
                                      onClick={handleOpenClientTypeModal}
                                      style={{ color: isDark ? darkColors.textSecondary : "#d0d5dd" }}
                                    >
                                      <span>
                                        <span className={cls.addIcon} style={{ color: isDark ? darkColors.iconColor : "rgb(55, 53, 47)" }}>
                                          <AddIcon />
                                        </span>
                                        <span>Add client type</span>
                                      </span>
                                    </button>
                                  )}
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
                                sx={{
                                  "&:hover": {
                                    backgroundColor: isDark ? darkColors.bgHover : "rgba(55, 53, 47, 0.06)",
                                  },
                                  backgroundColor: activeTab === tab?.key 
                                    ? (isDark ? darkColors.bgHover : "rgba(55, 53, 47, 0.06)") 
                                    : "transparent",
                                }}
                              >
                                <TabTitle tab={tab} isDark={isDark}>{tab?.title}</TabTitle>
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
                  tab === TAB_COMPONENTS.PERMISSIONS.PERMISSIONS_DETAIL,
              })}
              sx={{
                backgroundColor: isDark ? darkColors.bgPrimary : "#fff",
                color: isDark ? darkColors.textPrimary : "inherit",
              }}
            >
              {isValidElement(tabComponents[activeTab])
                ? tabComponents[activeTab]
                : (tabComponents[activeTab]?.[tab] ??
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
