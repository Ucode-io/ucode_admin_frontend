import {useEffect, useRef, useState} from "react";
import {useTranslation} from "react-i18next";
import {useMutation, useQuery} from "react-query";
import {useSelector} from "react-redux";
import {Link, useParams, useSearchParams} from "react-router-dom";
import layoutService from "../../../services/layoutService";
import constructorViewService from "../../../services/constructorViewService";
import useDebounce from "../../../hooks/useDebounce";
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

const ViewOptions = ({
  selectedTab,
  data,
  refetchViews = () => {},
  fieldsMap,
  selectedTabIndex,
  tableLan,
}) => {
  const {appId, tableSlug} = useParams();
  const {i18n} = useTranslation();
  const [searchParams] = useSearchParams();

  const ref = useRef();

  const [openedMenu, setOpenedMenu] = useState(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.focus();
    }
  }, [openedMenu]);

  const layoutQuery = useQuery({
    queryKey: ["GET_LAYOUT", {tableSlug}],
    queryFn: () => layoutService.getLayout(tableSlug, appId),
  });

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

  const onViewNameChange = useDebounce((ev) => {
    updateView.mutate(ev.target.value);
  }, 500);

  const fixedColumnsCount = Object.values(
    selectedTab?.attributes?.fixedColumns || {}
  ).length;
  const groupByColumnsCount = selectedTab?.attributes?.group_by_columns?.length;
  const visibleColumnsCount = selectedTab?.columns?.length ?? 0;
  const tabGroupColumnsCount = selectedTab?.group_fields?.length;

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

              <Flex
                p="8px"
                h="32px"
                columnGap="8px"
                alignItems="center"
                borderRadius={6}
                _hover={{bg: "#EAECF0"}}
                cursor="pointer"
                onClick={() => setOpenedMenu("group")}>
                <Image src="/img/copy-01.svg" alt="Group by" />
                <ViewOptionTitle>
                  {generateLangaugeText(tableLan, i18n?.language, "Group") ||
                    "Group"}
                </ViewOptionTitle>
                <Flex ml="auto" alignItems="center" columnGap="8px">
                  {Boolean(groupByColumnsCount) && (
                    <ViewOptionSubtitle>
                      {groupByColumnsCount}{" "}
                      {generateLangaugeText(
                        tableLan,
                        i18n?.language,
                        "Group"
                      ) || "Group"}
                    </ViewOptionSubtitle>
                  )}
                  <ChevronRightIcon fontSize={22} />
                </Flex>
              </Flex>
            </Box>
          </>
        )}

        {/* <Box
          sx={{
            display: "flex",
            alignItems: "center",
            width: "100%",
            justifyContent: "flex-end",
            borderBottom: "1px solid #eee",
          }}>
          <FixColumnsRelationSection
            relatedTable={getRelatedTabeSlug}
            fieldsMap={fieldsMap}
            getAllData={getAllData}
          />
          <Divider orientation="vertical" flexItem />
          <VisibleColumnsButtonRelationSection
            currentView={getRelatedTabeSlug}
            fieldsMap={fieldsMap}
            getAllData={getAllData}
            // getLayoutList={getLayoutList}
            selectedTabIndex={selectedTabIndex}
            data={data}
          />
        </Box> */}

        {openedMenu === "columns-visibility" && (
          <ColumnsVisibility
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
