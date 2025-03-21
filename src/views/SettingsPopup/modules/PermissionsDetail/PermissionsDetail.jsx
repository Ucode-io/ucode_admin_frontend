import { Box, Card } from "@mui/material";
import cls from "./styles.module.scss";
import { usePermissionsDetailProps } from "./usePermissionsDetailProps";
import { generateLangaugeText } from "../../../../utils/generateLanguageText";
import { ContentTitle } from "../../components/ContentTitle";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import ConnectionPage from "../../../Permissions/Connections";
import FRow from "../../../../components/FormElements/FRow";
import HFTextField from "../../../../components/FormElements/HFTextField";
import RolePage from "../../../Permissions/Roles";

export const PermissionsDetail = () => {

  const {
    lang,
    clientId,
    selectedTab,
    control,
    reset,
    connections,
    i18n,
    isLoading,
    setSelectedTab,
    setSearchParams,
    onRowClick,
  } = usePermissionsDetailProps();

  return (
    <Box className={cls.permission}>
      <ContentTitle withBackBtn onBackClick={() => setSearchParams({})}>
        {
          generateLangaugeText(lang, i18n?.language, "Matrix Details") ||
          "Matrix Details"
        }
      </ContentTitle>
      <Tabs
        direction={"ltr"}
        selectedIndex={selectedTab}
        onSelect={setSelectedTab}
        className={cls.tabs}>
        <Card style={{paddingBottom: "0px", borderRadius: "0", boxShadow: "none"}}>
          <TabList>
            <Tab>
              {generateLangaugeText(lang, i18n?.language, "Role") ||
                "Role"}
            </Tab>
            <Tab>
              {generateLangaugeText(lang, i18n?.language, "Connection") ||
                "Connection"}
            </Tab>
          </TabList>

          <TabPanel style={{marginTop: "8px"}}>
            <div style={{padding: "10px 10px 0 10px", maxWidth: "30%"}}>
              <FRow
                label={
                  generateLangaugeText(lang, i18n?.language, "Name") ||
                  "Name"
                }>
                <HFTextField control={control} name="name" fullWidth />
              </FRow>
            </div>
            <RolePage onRowClick={onRowClick} />
          </TabPanel>
          <TabPanel>
            <ConnectionPage settingLan={lang} connections={connections} />
          </TabPanel>
        </Card>
      </Tabs>
    </Box>
  );
}
