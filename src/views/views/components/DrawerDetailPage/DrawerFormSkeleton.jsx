import { Box, Flex } from "@chakra-ui/react";
import { Skeleton } from "@mui/material";

// ponytail: the drawer used to slide in blank while views/layout/record loaded. Same
// px as Section's wrapper so fields land where the bars were.
export const DrawerFormSkeleton = ({ rows = 12 }) => (
  <Box px={10} pt="20px">
    {Array.from({ length: rows }).map((_, index) => (
      <Flex key={index} alignItems="center" columnGap="24px" h="39px">
        <Skeleton
          variant="rounded"
          animation="wave"
          height={14}
          width={140}
          sx={{ flexShrink: 0 }}
        />
        <Skeleton
          variant="rounded"
          animation="wave"
          height={14}
          width={index % 3 === 0 ? 280 : 190}
        />
      </Flex>
    ))}
  </Box>
);

export default DrawerFormSkeleton;
