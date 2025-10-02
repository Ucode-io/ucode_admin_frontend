import { generateLangaugeText } from "@/utils/generateLanguageText";
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
} from "@chakra-ui/react";
import { useColumnsVisibilityProps } from "./useColumnsVisibilityProps";
import { Container, Draggable } from "react-smooth-dnd";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import { getColumnIcon } from "@/utils/constants/tableIcons";
import { ViewOptionTitle } from "../../../ViewOptionTitle";
import { EyeIcon, EyeOffIcon } from "@/utils/constants/icons";
import { FieldOptions } from "../FieldsOptions";

export const ColumnsVisibility = ({
  onBackClick,
}) => {

  const {
    updateViewMutation,
    invisibleFields,
    getLabel,
    onChange,
    onShowAllChange,
    onDrop,
    renderFields,
    openMenuId,
    setOpenMenuId,
    search,
    setSearch,
    i18n,
    tableSlug,
    tableLan,
    view,
  } = useColumnsVisibilityProps();
 
  return (
    <Box>
      <Flex justifyContent="space-between" alignItems="center">
        <Button
          paddingLeft={"0"}
          leftIcon={<ChevronLeftIcon fontSize={22} />}
          rightIcon={
            updateViewMutation.isLoading ? <Spinner color="#475467" /> : undefined
          }
          colorScheme="gray"
          variant="ghost"
          w="fit-content"
          onClick={onBackClick}
        >
          <Box color="#475467" fontSize={14} fontWeight={600}>
            {generateLangaugeText(
              tableLan,
              i18n?.language,
              "Visible columns"
            ) || "Visible columns"}
          </Box>
        </Button>
      </Flex>
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
      <Flex
        // className="scrollbarNone"
        flexDirection="column"
        mt="8px"
        maxHeight="300px"
        overflow="auto"
      >
        {renderFields?.length > 0 && (
          <>
            <Flex alignItems={"center"} justifyContent={"space-between"}>
              <Box
                p={"2px 0 2px 6px"}
                fontWeight="600"
                fontSize={"12px"}
                color={"#898989"}
              >
                Shown in Table
              </Box>

              <Box
                cursor={"pointer"}
                fontSize={"12px"}
                color={"#3985d3"}
                mr={"10px"}
                onClick={() => onShowAllChange(false)}
              >
                Hide All
              </Box>
            </Flex>

            <Container onDrop={onDrop}>
              {renderFields.map((column) => (
                <Draggable
                  style={{ overflow: "auto", height: "28px" }}
                  key={column.id}
                >
                  <Flex
                    // as="label"
                    p="4px"
                    columnGap="8px"
                    alignItems="center"
                    borderRadius={6}
                    bg="#fff"
                    h={"28px"}
                    overflow={"hidden"}
                    cursor="pointer"
                  >
                    <Box cursor={"grab"} h={"20px"}>
                      <DragIndicatorIcon style={{ color: "#898989" }} />
                    </Box>
                    {column?.type && getColumnIcon({ column })}

                    <ViewOptionTitle>{getLabel(column)}</ViewOptionTitle>
                    <Flex
                      ml="auto"
                      cursor="pointer"
                      onClick={() =>
                        onChange(
                          column,
                          !(view?.type === "TIMELINE"
                            ? view?.attributes?.visible_field?.includes(
                                column?.slug
                              )
                            : view?.columns?.includes(
                                column?.type === "LOOKUP" ||
                                  column?.type === "LOOKUPS"
                                  ? column?.relation_id
                                  : column?.id
                              ))
                        )
                      }
                    >
                      {view?.type === "TIMELINE" ? (
                        view?.attributes?.visible_field?.includes(
                          column?.slug
                        ) ? (
                          <EyeIcon />
                        ) : (
                          <EyeOffIcon color="#888" />
                        )
                      ) : view?.columns?.includes(
                          column?.type === "LOOKUP" ||
                            column?.type === "LOOKUPS"
                            ? column?.relation_id
                            : column?.id
                        ) ? (
                        <EyeIcon />
                      ) : (
                        <EyeOffIcon color="#888" />
                      )}
                    </Flex>
                    <FieldOptions
                      tableLan={tableLan}
                      view={view}
                      tableSlug={tableSlug}
                      field={column}
                      isOpen={openMenuId === column.id}
                      onOpen={() => setOpenMenuId(column.id)}
                      onClose={() => setOpenMenuId(null)}
                    />
                  </Flex>
                </Draggable>
              ))}
            </Container>
          </>
        )}

        {invisibleFields?.length > 0 && (
          <>
            <Flex alignItems={"center"} justifyContent={"space-between"}>
              <Box
                mt={"6px"}
                p={"2px 0 2px 6px"}
                fontSize={"12px"}
                fontWeight="600"
                color={"#898989"}
              >
                Hidden in Table
              </Box>

              <Box
                cursor={"pointer"}
                color={"#3985d3"}
                mr={"10px"}
                onClick={() => onShowAllChange(true)}
              >
                Show All
              </Box>
            </Flex>
            {invisibleFields?.map((column, index) => (
              <Flex
                // as="label"
                key={index}
                p="4px"
                columnGap="8px"
                alignItems="center"
                borderRadius={6}
                bg="#fff"
                // _hover={{bg: "#EAECF0"}}
                cursor="pointer"
                h={"28px"}
              >
                {column?.type && getColumnIcon({ column })}
                <ViewOptionTitle>{getLabel(column)}</ViewOptionTitle>
                <Flex
                  ml="auto"
                  cursor="pointer"
                  onClick={() =>
                    onChange(
                      column,
                      !(view?.type === "TIMELINE"
                        ? view?.attributes?.visible_field?.includes(
                            column?.slug
                          )
                        : view?.columns?.includes(
                            column?.type === "LOOKUP" ||
                              column?.type === "LOOKUPS"
                              ? column?.relation_id
                              : column?.id
                          ))
                    )
                  }
                >
                  {view?.type === "TIMELINE" ? (
                    view?.attributes?.visible_field?.includes(column?.slug) ? (
                      <EyeIcon />
                    ) : (
                      <EyeOffIcon color="#888" />
                    )
                  ) : view?.columns?.includes(
                      column?.type === "LOOKUP" || column?.type === "LOOKUPS"
                        ? column?.relation_id
                        : column?.id
                    ) ? (
                    <EyeIcon />
                  ) : (
                    <EyeOffIcon color="#888" />
                  )}
                </Flex>
                <FieldOptions
                  tableLan={tableLan}
                  view={view}
                  tableSlug={tableSlug}
                  field={column}
                  isOpen={openMenuId === column.id}
                  onOpen={() => setOpenMenuId(column.id)}
                  onClose={() => setOpenMenuId(null)}
                />
              </Flex>
            ))}
          </>
        )}
      </Flex>
    </Box>
  );
};