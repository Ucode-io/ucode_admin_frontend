


import { Box } from "@chakra-ui/react";
import { lazy } from "react";
import { useParams } from "react-router-dom";

const RemoteWebPage = lazy(() => import('remote_webpage_app/Page'))

const WebPage = () => {
  const { webPageId } = useParams()
  
  return <Box>
    asdasd
    <RemoteWebPage webPageId={webPageId} />
  </Box>
}
export default WebPage