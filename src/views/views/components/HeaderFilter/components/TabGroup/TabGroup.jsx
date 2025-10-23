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
import { useTabGroupProps } from "./useTabGroupProps";
import { generateLangaugeText } from "@/utils/generateLanguageText";
import { getColumnIcon } from "@/utils/constants/tableIcons";
import { ViewOptionTitle } from "../../../ViewOptionTitle";

export const TabGroup = ({
  onBackClick,
  tableLan,
  label = "Tab group columns",
}) => {

  const {
    i18n,
    search,
    setSearch,
    renderFields,
    getLabel,
    selected,
    onChange,
    view,
    isBoardView,
    isViewUpdating,
  } = useTabGroupProps()

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
          {generateLangaugeText(tableLan, i18n?.language, label) ||
            "Tab group columns"}
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
            {isBoardView ? (
              <Switch
                ml="auto"
                checked={selected === column?.id}
                onChange={(ev) => onChange(column, ev.target.checked)}
                disabled={
                  isBoardView
                    ? view?.attributes?.sub_group_by_id === column?.id
                    : false
                }
                isChecked={(view?.group_fields ?? []).includes(
                  column?.type === "LOOKUP" || column?.type === "LOOKUPS"
                    ? column?.relation_id
                    : column?.id
                )}
              />
            ) : (
              <Switch
                ml="auto"
                onChange={(ev) => onChange(column, ev.target.checked)}
                isChecked={(view?.group_fields ?? []).includes(
                  column?.type === "LOOKUP" || column?.type === "LOOKUPS"
                    ? column?.relation_id
                    : column?.id
                )}
              />
            )}
          </Flex>
        ))}
      </Flex>
    </Box>
  );
};
