import {Box, Card} from "@mui/material";
import Header from "../../components/Header";
import {useParams} from "react-router-dom";
import {Tab, TabList, TabPanel, Tabs} from "react-tabs";
import {useEffect, useState} from "react";
import FRow from "../../components/FormElements/FRow";
import HFTextField from "../../components/FormElements/HFTextField";
import {useForm} from "react-hook-form";
import clientTypeServiceV2 from "../../services/auth/clientTypeServiceV2";
import {useQuery} from "react-query";
import RolePage from "./Roles";
import ConnectionPage from "./Connections";
import styles from "./style.module.scss";
import {getAllFromDB} from "../../utils/languageDB";
import {generateLangaugeText} from "../../utils/generateLanguageText";
import {useTranslation} from "react-i18next";

const PermissionDetail = () => {
  const {clientId} = useParams();
  const [selectedTab, setSelectedTab] = useState(0);
  const {control, reset} = useForm();
  const [connections, setConnections] = useState([]);
  const [settingLan, setSettingLan] = useState();
  const {i18n} = useTranslation();

  const {isLoading} = useQuery(
    ["GET_CLIENT_TYPE_BY_ID", clientId],
    () => {
      return clientTypeServiceV2.getById(clientId);
    },
    {
      enabled: !!clientId,
      onSuccess: (res) => {
        setConnections([res?.data?.response]);
        reset(res.data.response);
      },
    }
  );

  useEffect(() => {
    getAllFromDB().then((storedData) => {
      if (storedData && Array.isArray(storedData)) {
        const formattedData = storedData.map((item) => ({
          ...item,
          translations: item.translations || {},
        }));

        setSettingLan(formattedData?.find((item) => item?.key === "Setting"));
      }
    });
  }, []);

  return (
    <Box className={styles.permission}>
      <Header
        title={
          generateLangaugeText(settingLan, i18n?.language, "Matrix Details") ||
          "Matrix Details"
        }
        backButtonLink={-1}
      />
      <Tabs
        direction={"ltr"}
        selectedIndex={selectedTab}
        onSelect={setSelectedTab}
        className={styles.tabs}>
        <Card style={{paddingBottom: "0px", borderRadius: "0"}}>
          <TabList>
            <Tab>
              {generateLangaugeText(settingLan, i18n?.language, "Role") ||
                "Role"}
            </Tab>
            <Tab>
              {generateLangaugeText(settingLan, i18n?.language, "Connection") ||
                "Connection"}
            </Tab>
          </TabList>

          <TabPanel style={{marginTop: "8px"}}>
            <div style={{padding: "10px 10px 0 10px", maxWidth: "30%"}}>
              <FRow
                label={
                  generateLangaugeText(settingLan, i18n?.language, "Name") ||
                  "Name"
                }>
                <HFTextField control={control} name="name" fullWidth />
              </FRow>
            </div>
            <RolePage />
          </TabPanel>
          <TabPanel>
            <ConnectionPage settingLan={settingLan} connections={connections} />
          </TabPanel>
        </Card>
      </Tabs>
    </Box>
  );
};

export default PermissionDetail;
