import { ChevronLeftIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  Spinner,
  Switch,
} from "@chakra-ui/react";
import { generateLangaugeText } from "@/utils/generateLanguageText";
import { getColumnIcon } from "@/utils/constants/tableIcons";
import { ViewOptionTitle } from "../../../ViewOptionTitle";
import { useFixColumnsProps } from "./useFixColumnsProps";

export const FixColumns = ({
  onBackClick,
  tableLan,
}) => {
  
  const {
    isViewUpdating,
    setSearch,
    i18n,
    columns,
    onChange,
    view,
    search,
  } = useFixColumnsProps()

  return (
    <Box>
      <Button
        leftIcon={<ChevronLeftIcon fontSize={22} />}
        rightIcon={isViewUpdating ? <Spinner color="#475467" /> : undefined}
        colorScheme="gray"
        variant="ghost"
        w="fit-content"
        onClick={onBackClick}
      >
        <Box color="#475467" fontSize={16} fontWeight={600}>
          {generateLangaugeText(tableLan, i18n?.language, "Fix columns") ||
            "Fix columns"}
        </Box>
      </Button>
      <InputGroup mt="10px">
        <InputLeftElement>
          <Image src="/img/search-lg.svg" alt="search" />
        </InputLeftElement>
        <Input
          placeholder={
            generateLangaugeText(
              tableLan,
              i18n?.language,
              "Seaarch by filled name"
            ) || "Search by filled name"
          }
          value={search}
          onChange={(ev) => setSearch(ev.target.value)}
        />
      </InputGroup>
      <Flex flexDirection="column" mt="8px" maxHeight="300px" overflow="auto">
        {columns.map((column) => (
          <Flex
            key={column.id}
            as="label"
            p="8px"
            columnGap="8px"
            alignItems="center"
            borderRadius={6}
            _hover={{ bg: "#EAECF0" }}
            cursor="pointer"
            height="28px"
          >
            {column?.type && getColumnIcon({ column })}
            <ViewOptionTitle>{column?.label}</ViewOptionTitle>
            <Switch
              ml="auto"
              isChecked={Boolean(
                Object.keys(view?.attributes?.fixedColumns ?? {})?.find(
                  (el) => el === column.id
                )
              )}
              onChange={(ev) => onChange(column, ev.target.checked)}
            />
          </Flex>
        ))}
      </Flex>
    </Box>
  );
};