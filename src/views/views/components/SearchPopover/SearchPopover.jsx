import { generateLangaugeText } from "@/utils/generateLanguageText";
import {
  Flex,
  IconButton,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Switch,
} from "@chakra-ui/react";
import { useSearchPopoverProps } from "./useSearchPopoverProps";
import { getColumnIcon } from "@/utils/constants/tableIcons";
import { ViewOptionTitle } from "../ViewOptionTitle";

export const SearchPopover = ({ handleSearchOnChange }) => {

  const { 
    onChange,
    searchText,
    tableLan,
    i18n,
    roleInfo,
    permissions,
    updateField,
    tableSlug,
    columnsForSearch,
  } = useSearchPopoverProps({ handleSearchOnChange });

  return <Popover placement="bottom-end">
  <InputGroup ml="auto" w="320px">
    <InputLeftElement>
      <Image src="/img/search-lg.svg" alt="search" />
    </InputLeftElement>
    <Input
      id="search_input"
      defaultValue={searchText}
      placeholder={
        generateLangaugeText(
          tableLan,
          i18n?.language,
          "Search"
        ) || "Search"
      }
      onChange={(e) => onChange(e.target.value)}
    />

    {(roleInfo === "DEFAULT ADMIN" ||
      permissions?.search_button) && (
      <PopoverTrigger>
        <InputRightElement>
          <IconButton
            w="24px"
            h="24px"
            aria-label="more"
            icon={
              <Image src="/img/dots-vertical.svg" alt="more" />
            }
            variant="ghost"
            colorScheme="gray"
            size="xs"
          />
        </InputRightElement>
      </PopoverTrigger>
    )}
  </InputGroup>

  <PopoverContent
    w="280px"
    p="8px"
    display="flex"
    flexDirection="column"
    maxH="300px"
    overflow="auto"
  >
    {columnsForSearch.map((column) => (
      <Flex
        key={column.id}
        as="label"
        p="8px"
        columnGap="8px"
        alignItems="center"
        borderRadius={6}
        _hover={{ bg: "#EAECF0" }}
        cursor="pointer"
      >
        {getColumnIcon({ column })}
        <ViewOptionTitle>
          {column?.attributes?.[`label_${i18n.language}`] ||
            column?.label}
        </ViewOptionTitle>
        <Switch
          ml="auto"
          isChecked={column.is_search}
          onChange={(e) =>
            updateField({
              data: {
                fields: columnsForSearch.map((c) =>
                  c.id === column.id
                    ? { ...c, is_search: e.target.checked }
                    : c
                ),
              },
              tableSlug,
            })
          }
        />
      </Flex>
    ))}
  </PopoverContent>
</Popover>
};