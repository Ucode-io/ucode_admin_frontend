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
import ProjectPage from "../Projects";
import RolePage from "./Roles";

const PermissionDetail = () => {
  const { clientId } = useParams();
  const [selectedTab, setSelectedTab] = useState(0);
  const { control, reset, watch } = useForm();

  const { data: computedClientTpes } = useQuery(
    ["GET_CLIENT_TYPE_LIST"],
    () => {
      return clientTypeServiceV2.getById(clientId);
    },
    {
      enabled: !!clientId,
      onSuccess: (res) => {
        console.log("res", res);
        reset(res.data.response);
      },
    }
  );

  return (
    <Box flex={1}>
      <Header title="Matrix details" />
      <Tabs
        direction={"ltr"}
        selectedIndex={selectedTab}
        onSelect={setSelectedTab}
      >
        <div style={{ padding: "20px" }}>
          <Card style={{ padding: "10px" }}>
            <TabList>
              <Tab>Инфо</Tab>
              <Tab>Роли</Tab>
            </TabList>

            <TabPanel>
              <div
                style={{
                  padding: "20px",
                }}
              >
                <FRow label="Name">
                  <HFTextField control={control} name="name" fullWidth />
                </FRow>
              </div>
            </TabPanel>
            <TabPanel>
              <RolePage />
            </TabPanel>
          </Card>
        </div>
      </Tabs>
    </Box>
  );
};

export default PermissionDetail;
