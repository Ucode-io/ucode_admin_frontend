import { format } from "date-fns";
import { ActivityFeedColors } from "@/components/Status";
import Tag from "@/components/Tag";
import cls from "./styles.module.scss";
import { Box, Typography } from "@mui/material";
import RectangleIconButton from "@/components/Buttons/RectangleIconButton";
import { MdContentCopy } from "react-icons/md";
import ReactJson from "react-json-view";
import { useActivityLogsDetailProps } from "./useActivityLogsDetailProps";
import { ContentTitle } from "../../components/ContentTitle";

export const ActivityLogsDetail = () => {

  const {
    utcDate,
    copyJson,
    history,
    versionHistoryByIdLoader,
    onBackClick,
  } = useActivityLogsDetailProps();

  return <Box>
    <ContentTitle withBackBtn onBackClick={onBackClick}>Activity Item</ContentTitle>
    <Box className={cls.content}>
      <Box className={cls.card}>
        <Typography variant="h6">User:</Typography>
        <Typography variant="p">{history?.user_info}</Typography>
      </Box>
      <Box className={cls.card}>
        <Typography variant="h6">Action:</Typography>
        <Tag
          shape="subtle"
          color={ActivityFeedColors(history?.action_type)}
          size="large"
          style={{
            background: `${ActivityFeedColors(history?.action_type)}`,
            width: '97px'
          }}
          className={cls.tag}
        >
          {history?.action_type?.charAt(0).toUpperCase() + history?.action_type.slice(1).toLowerCase()}
        </Tag>
      </Box>
      <Box className={cls.card}>
        <Typography variant="h6">Date:</Typography>
        {history && <Typography variant="p">{format(utcDate, 'yyyy-MM-dd HH:mm:ss')}</Typography>}
      </Box>
      <Box className={cls.card}>
        <Typography variant="h6">Collection:</Typography>
        <Typography variant="p">{history?.table_slug}</Typography>
      </Box>
      <Box className={cls.promise}>
        <Box width={"50%"} borderRadius={"10px"} className={cls.promiseCard}>
          <Typography variant="h6">Request:</Typography>
          <RectangleIconButton
            onClick={() =>
              copyJson(JSON.stringify(history?.request, null, 2))
            }
            className={cls.copy}
          >
            <MdContentCopy />
          </RectangleIconButton>

          <ReactJson
            src={history?.request && JSON.parse(history?.request)}
            theme="codeschool"
            style={{
              padding: "10px",
              borderRadius: "10px",
              overflow: "auto",
              height: "300px",
            }}
            enableClipboard={false}
            displayDataTypes={false}
            displayObjectSize={false}
          />
        </Box>
        <Box width={"50%"} borderRadius={"10px"} className={cls.promiseCard}>
          <Typography variant="h6">Response:</Typography>
          <RectangleIconButton
            onClick={() =>
              copyJson(JSON.stringify(history?.response, null, 2))
            }
            className={cls.copy}
          >
            <MdContentCopy />
          </RectangleIconButton>
          <ReactJson
            src={history?.response && JSON.parse(history?.response)}
            theme="codeschool"
            style={{
              padding: "10px",
              borderRadius: "10px",
              overflow: "auto",
              height: "300px",
            }}
            displayDataTypes={false}
            enableClipboard={false}
            displayObjectSize={false}
          />
        </Box>
      </Box>
    </Box>
  </Box>
};
