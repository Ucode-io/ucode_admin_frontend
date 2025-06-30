import { Box, Flex } from "@chakra-ui/react";
import { Skeleton } from "@mui/material";

export const BoardSkeleton = () => {
  return (
    <Box height="100%">
      <Flex gap="8px" paddingX={3} alignItems="flex-start">
        <Skeleton
          height="80px"
          width="278px"
          sx={{ backgroundColor: "rgba(9, 24, 236, 0.03)" }}
        />
        <Skeleton
          height="80px"
          width="278px"
          sx={{ backgroundColor: "rgba(9, 24, 236, 0.03)" }}
        />
        <Skeleton
          height="80px"
          width="278px"
          sx={{ backgroundColor: "rgba(9, 24, 236, 0.03)" }}
        />
        <Skeleton
          height="80px"
          width="278px"
          sx={{ backgroundColor: "rgba(9, 24, 236, 0.03)" }}
        />
      </Flex>
      <Flex gap="8px" paddingX={3} height="700px" alignItems="flex-start">
        <Skeleton
          height="800px"
          width="278px"
          sx={{
            backgroundColor: "rgba(9, 24, 236, 0.03)",
            marginTop: "-170px",
          }}
        />
        <Skeleton
          height="800px"
          width="278px"
          sx={{
            backgroundColor: "rgba(9, 24, 236, 0.03)",
            marginTop: "-170px",
          }}
        />
        <Skeleton
          height="800px"
          width="278px"
          sx={{
            backgroundColor: "rgba(9, 24, 236, 0.03)",
            marginTop: "-170px",
          }}
        />
        <Skeleton
          height="800px"
          width="278px"
          sx={{
            backgroundColor: "rgba(9, 24, 236, 0.03)",
            marginTop: "-170px",
          }}
        />
      </Flex>
    </Box>
  );
};
