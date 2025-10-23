import { Box } from "@chakra-ui/react";

export const ViewOptionTitle = ({ children }) => (
  <Box
    maxWidth="105px"
    textOverflow="ellipsis"
    overflow="hidden"
    whiteSpace="nowrap"
    color="#101828"
    fontWeight={400}
    fontSize={14}
    lineHeight="20px"
  >
    {children}
  </Box>
);
