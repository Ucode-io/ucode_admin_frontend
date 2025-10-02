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
import { useGroupProps } from "./useGroupProps";
import { generateLangaugeText } from "@/utils/generateLanguageText";
import { getColumnIcon } from "@/utils/constants/tableIcons";
import { ViewOptionTitle } from "../../../ViewOptionTitle";
import { FIELD_TYPES } from "@/utils/constants/fieldTypes";

export const Group = ({
  onBackClick,
}) => {
  const {
    onChange,
    updateViewMutation,
    tableLan,
    i18n,
    search,
    setSearch,
    renderFields,
    view,
    getLabel,
  } = useGroupProps()

  return (
    <Box>
      <Button
        leftIcon={<ChevronLeftIcon fontSize={22} />}
        rightIcon={updateViewMutation.isLoading ? <Spinner color="#475467" /> : undefined}
        colorScheme="gray"
        variant="ghost"
        w="fit-content"
        onClick={onBackClick}
      >
        <Box color="#475467" fontSize={16} fontWeight={600}>
          {generateLangaugeText(tableLan, i18n?.language, "Group columns") ||
            "Group columns"}
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
        {renderFields.map((column) => (
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
            <ViewOptionTitle>{getLabel(column)}</ViewOptionTitle>
            <Switch
              ml="auto"
              onChange={(ev) => onChange(column, ev.target.checked)}
              isChecked={view?.attributes?.group_by_columns?.includes(
                column?.type === FIELD_TYPES.LOOKUP || column?.type === FIELD_TYPES.LOOKUPS
                  ? column?.relation_id
                  : column?.id
              )}
            />
          </Flex>
        ))}
      </Flex>
    </Box>
  );
};