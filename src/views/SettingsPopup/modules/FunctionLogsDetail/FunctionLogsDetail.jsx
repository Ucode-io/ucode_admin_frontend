import { ContentTitle } from "../../components/ContentTitle"
import { useFunctionLogsDetailProps } from "./useFunctionLogsDetailProps";
import { DataList } from "../../components/DataList";
import { Box } from "@mui/material";

export const FunctionLogsDetail = () => {

  const { handleBackClick, data, mainData } = useFunctionLogsDetailProps();

  return <div>
    <ContentTitle onBackClick={handleBackClick}>
      Function Item
    </ContentTitle>
   <Box display="flex" flexDirection="column" gap={2}>
    <DataList items={mainData} />
    <DataList items={data} />
   </Box>
  </div>
}
