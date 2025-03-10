import cls from './styles.module.scss';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { useSettingsPopupProps } from './useSettingsPopupProps';
import { Box, Typography } from '@mui/material';
import { Flex } from '@chakra-ui/react';
import clsx from 'clsx';
import { SettingsPopupProvider } from './providers';
import { isValidElement } from 'react';

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
  } = useSettingsPopupProps({ onClose });

  return (
    <SettingsPopupProvider 
      value={{ 
        activeTab,
        handleChangeTab,
        searchParams,
        setSearchParams,
        updateSearchParam,
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
          }
        }}
      >
        <DialogContent className={cls.dialogContent} sx={{padding: 0}}>
          <Box className={cls.content}>
            <Box className={cls.leftBarWrapper}>
              <Box className={cls.leftBar}>
                {
                  tabs.map((tab, index) => {

                    return (
                      <Box mb="20px" key={index}>
                        <Typography className={cls.leftBarTitle} variant='h2'>{tab?.title}</Typography>
                        {
                          tab?.tabs?.map((tab, tabIndex) => {

                            return <Flex 
                                className={clsx(cls.tabItem, {[cls.active]: activeTab === tab?.key})}
                                onClick={() => handleChangeTab(tab?.key)}
                                alignItems="center"
                                key={tabIndex}
                              >
                                <Flex columnGap="8px">
                                  {tab?.icon && tab?.icon}
                                  <Typography className={cls.tabItemTitle} flexGrow={1} variant='p'>{tab?.title}</Typography>
                                </Flex>
                            </Flex>
                          })
                        }
                      </Box>
                    )

                  })
                }
              </Box>
            </Box>
            <Box className={cls.rightContent}>
              {
                isValidElement(tabComponents[activeTab])
                  ? tabComponents[activeTab]
                  : (
                    tabComponents[activeTab]?.[searchParams.get("tab")] ?? tabComponents[activeTab]?.[activeTab]
                  )
              }
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </SettingsPopupProvider>
  );
}
