import {Box, ChakraProvider, Flex} from "@chakra-ui/react";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import {useDispatch, useSelector} from "react-redux";
import {toggleTheme, selectThemeMode} from "../../../../store/theme/theme.slice";

function ThemeToggle() {
  const dispatch = useDispatch();
  const themeMode = useSelector(selectThemeMode);
  const isDarkMode = themeMode === "dark";

  const handleClick = () => {
    dispatch(toggleTheme());
  };

  return (
    <ChakraProvider>
      <Flex
        align="center"
        justify="center"
        gap={2}
        px={3}
        py={1.5}
        bg="white"
        border="1px solid"
        borderColor="gray.300"
        borderRadius="8px"
        cursor="pointer"
        h={"36px"}
        mr={"8px"}
        _hover={{
          bg: "gray.50",
          boxShadow: "md",
          transform: "scale(1.05)",
          transition: "all 0.2s ease-in-out",
        }}
        onClick={handleClick}
        w="fit-content"
        boxShadow="sm"
        transition="all 0.15s ease-in-out">
        <Box
          as={isDarkMode ? LightModeIcon : DarkModeIcon}
          fontSize="20px"
          color="gray.600"
        />
      </Flex>
    </ChakraProvider>
  );
}

export default ThemeToggle;
