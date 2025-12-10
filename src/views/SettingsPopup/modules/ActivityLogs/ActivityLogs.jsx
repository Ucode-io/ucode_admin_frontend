import { Box } from "@mui/material";
import { useActivityLogsProps } from "./useActivityLogsProps";
import cls from "./styles/styles.module.scss";
import { ActivityFeedHeader } from "./components/ActivityFeedHeader";
import { ActivityFeedTable } from "./components/ActivityFeedTable";
import {
  Flex,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";

import styles from "./styles.module.scss";
import { FunctionLogs } from "./components/FunctionLogs";

export const ActivityLogs = () => {
  const {
    histories,
    setHistories,
    dateFilters,
    setDateFilters,
    activityLan,
    actionValue,
    setActionValue,
    actionType,
    setActionType,
    tabIndex,
    onTabChange,
    tabs,
  } = useActivityLogsProps();

  return (
    <Tabs index={tabIndex} onChange={onTabChange}>
      <TabList className={styles.react_tab}>
        <Flex
          p={"4px"}
          bg={"#f9fafb"}
          borderRadius={"8px"}
          h={"32px"}
          mb={"5px"}
          border={"1px solid #EAECF0"}
          overflow="auto"
          maxWidth="720px"
        >
          {tabs.map((type, index) => (
            <Tab
              className={`${tabIndex === index ? styles.reactTabIteActive : styles.reactTabItem} ${styles.userTab}`}
              sx={{ fontSize: "12px" }}
              key={type.guid}
            >
              {type.name}
            </Tab>
          ))}
        </Flex>
      </TabList>
      <TabPanels>
        <TabPanel>
          <Box className={cls.activity}>
            <ActivityFeedHeader
              histories={histories?.histories}
              setDateFilters={setDateFilters}
              dateFilters={dateFilters}
              activityLan={activityLan}
              setActionValue={setActionValue}
              actionType={actionType}
            />
            <ActivityFeedTable
              setHistories={setHistories}
              dateFilters={dateFilters}
              actionValue={actionValue}
              activityLan={activityLan}
              actionType={actionType}
              setActionType={setActionType}
            />
          </Box>
        </TabPanel>
        <TabPanel>
          <FunctionLogs />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};
