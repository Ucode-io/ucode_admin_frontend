import { Box, Card } from "@mui/material";
import Header from "../../components/Header";
import { useParams } from "react-router-dom";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import { useState } from "react";
import FRow from "../../components/FormElements/FRow";
import HFTextField from "../../components/FormElements/HFTextField";
import { useForm } from "react-hook-form";

const PermissionDetail = () => {
  const { clientId } = useParams();
  const [selectedTab, setSelectedTab] = useState(0);
  const { control, reset } = useForm();
  console.log("clientId", clientId);

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
            <TabPanel></TabPanel>
          </Card>
        </div>
      </Tabs>
    </Box>
  );
};

export default PermissionDetail;
