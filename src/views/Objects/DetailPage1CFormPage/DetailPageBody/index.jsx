import React, {useState} from "react";
import DetailPageTabs from "./DetailPageTabs";
import {Box} from "@mui/material";

function DetailPageBody({control, setSelectedTab, selectedTab, data}) {
  return (
    <Box>
      <DetailPageTabs
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
        control={control}
        data={data}
      />
    </Box>
  );
}

export default DetailPageBody;
