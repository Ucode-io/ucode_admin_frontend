import {useEffect, useRef, useState} from "react";
import {useTranslation} from "react-i18next";
import {useMutation, useQuery} from "react-query";
import {Link, useParams, useSearchParams} from "react-router-dom";
import constructorViewService from "../../../services/constructorViewService";
import {
  Box,
  Flex,
  IconButton,
  Image,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@chakra-ui/react";
import {generateLangaugeText} from "../../../utils/generateLanguageText";
import {ChevronRightIcon} from "@chakra-ui/icons";
import ColumnsVisibility from "./ColumnVisibility";
import constructorTableService from "../../../services/constructorTableService";
import {listToMap} from "../../../utils/listToMap";

const ViewOptions = ({
  selectedTab,
  data,
  refetchViews = () => {},
  getAllData = () => {},
  fieldsMap: fieldsMapFromProps,
  selectedTabIndex,
  tableLan,
}) => {
  const {appId, tableSlug} = useParams();
  const {i18n} = useTranslation();
  const [searchParams] = useSearchParams();
  const relatedTableSlug = selectedTab?.relation?.relation_table_slug;

  const ref = useRef();

  const [openedMenu, setOpenedMenu] = useState(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.focus();
    }
  }, [openedMenu]);

  const {
    data: {fieldsMap} = {
      views: [],
      fieldsMap: {},
      visibleColumns: [],
      visibleRelationColumns: [],
    },
  } = useQuery(
    ["GET_VIEWS_AND_FIELDS", relatedTableSlug, i18n?.language],
    () => {
      return constructorTableService.getTableInfo(
        relatedTableSlug,
        {
          data: {},
        },
        {
          language_setting: i18n?.language,
        }
      );
    },
    {
      enabled: Boolean(relatedTableSlug),
      select: ({data}) => {
        return {
          fieldsMap: listToMap(data?.fields),
        };
      },
      enabled: !!relatedTableSlug,
    }
  );

  const updateView = useMutation({
    mutationFn: async (value) => {
      await constructorViewService.update(tableSlug, {
        id: selectedTab.id,
        columns: selectedTab.columns,
        attributes: {name_en: value},
      });
      return await refetchViews();
    },
  });

  const groupByColumnsCount = selectedTab?.attributes?.group_by_columns?.length;
  const visibleColumnsCount = selectedTab?.columns?.length ?? 0;

  return (
    <Popover
      offset={[-145, 8]}
      onClose={() => setTimeout(() => setOpenedMenu(null), 250)}
      modifiers={[
        {
          name: "computeStyles",
          options: {
            gpuAcceleration: false,
            adaptive: false,
          },
        },
      ]}>
      <PopoverTrigger>
        <IconButton
          aria-label="more"
          icon={<Image src="/img/dots-vertical.svg" alt="more" />}
          variant="ghost"
          colorScheme="gray"
        />
      </PopoverTrigger>
      <PopoverContent
        ref={ref}
        w="320px"
        p={openedMenu === null ? "0px" : "8px"}>
        {openedMenu === null && (
          <>
            <Box px="8px" py="4px" borderBottom="1px solid #D0D5DD">
              <Flex
                p="8px"
                h="32px"
                columnGap="8px"
                alignItems="center"
                borderRadius={6}
                _hover={{bg: "#EAECF0"}}
                cursor="pointer"
                onClick={() => setOpenedMenu("columns-visibility")}>
                <Image src="/img/eye.svg" alt="Visibility" />
                <ViewOptionTitle>
                  {generateLangaugeText(tableLan, i18n?.language, "Columns") ||
                    "Columns"}
                </ViewOptionTitle>
                <Flex ml="auto" alignItems="center" columnGap="8px">
                  {Boolean(visibleColumnsCount) && visibleColumnsCount > 0 && (
                    <ViewOptionSubtitle>
                      {visibleColumnsCount}{" "}
                      {generateLangaugeText(
                        tableLan,
                        i18n?.language,
                        "Shown"
                      ) || "Shown"}
                    </ViewOptionSubtitle>
                  )}
                  <ChevronRightIcon fontSize={22} />
                </Flex>
              </Flex>
            </Box>
          </>
        )}

        {openedMenu === "columns-visibility" && (
          <ColumnsVisibility
            getAllData={getAllData}
            data={data}
            selectedTabIndex={selectedTabIndex}
            selectedTab={selectedTab}
            // tableLan={tableLan}
            fieldsMap={fieldsMap}
            refetchViews={refetchViews}
            onBackClick={() => setOpenedMenu(null)}
          />
        )}

        {openedMenu === "fix-column" && (
          <FixColumns
            tableLan={tableLan}
            fieldsMap={fieldsMap}
            refetchViews={refetchViews}
            onBackClick={() => setOpenedMenu(null)}
          />
        )}
      </PopoverContent>
    </Popover>
  );
};

const ViewOptionSubtitle = ({children}) => (
  <Box color="#667085" fontWeight={400} fontSize={14}>
    {children}
  </Box>
);

const ViewOptionTitle = ({children}) => (
  <Box color="#475467" fontWeight={500} fontSize={14}>
    {children}
  </Box>
);

export default ViewOptions;
