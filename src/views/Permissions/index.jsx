import { Box, Card } from "@mui/material";
import Header from "../../components/Header";
import { useParams } from "react-router-dom";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import { useState } from "react";
import FRow from "../../components/FormElements/FRow";
import HFTextField from "../../components/FormElements/HFTextField";
import { useForm } from "react-hook-form";
import clientTypeServiceV2 from "../../services/auth/clientTypeServiceV2";
import { useQuery } from "react-query";
import RolePage from "./Roles";
import FormCard from "../../components/FormCard";
import ConnectionPage from "./Connections";
import styles from "./style.module.scss";

const PermissionDetail = () => {
  const { clientId } = useParams();
  const [selectedTab, setSelectedTab] = useState(0);
  const { control, reset } = useForm();

  const { isLoading } = useQuery(
    ["GET_CLIENT_TYPE_BY_ID", clientId],
    () => {
      return clientTypeServiceV2.getById(clientId);
    },
    {
      enabled: !!clientId,
      onSuccess: (res) => {
        reset(res.data.response);
      },
    }
  );

  return (
    <Box className={styles.permission}>
      <Header title="Matrix details" backButtonLink={-1} />
      <Tabs
        direction={"ltr"}
        selectedIndex={selectedTab}
        onSelect={setSelectedTab}
        className={styles.tabs}
      >
        <Card style={{ padding: "10px", borderRadius: "0" }}>
          <TabList>
            <Tab>Инфо</Tab>
            <Tab>Роли</Tab>
          </TabList>

          <TabPanel style={{ marginTop: "8px" }}>
            <div>
              <FRow label="Name">
                <HFTextField control={control} name="name" fullWidth />
              </FRow>
            </div>
            <div>
              <ConnectionPage />
            </div>
          </TabPanel>
          <TabPanel>
            <RolePage />
          </TabPanel>
        </Card>
      </Tabs>
    </Box>
  );
};

export default PermissionDetail;
