import {useEffect, useRef, useState} from "react";
import {useTranslation} from "react-i18next";
import {
  IconButton,
  Image,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@chakra-ui/react";
import ColumnsVisibility from "./ColumnVisibility";

const ViewOptions = ({
  layoutTabs,
  selectedTab,
  data,
  refetchViews = () => {},
  getAllData = () => {},
  selectedTabIndex,
  tableSlug,
  fieldsMap = {},
}) => {
  const {i18n} = useTranslation();
  const relatedTableSlug = selectedTab?.relation?.table_to?.slug;
  const ref = useRef();

  const [openedMenu, setOpenedMenu] = useState(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.focus();
    }
  }, [openedMenu]);

  // const {
  //   data: {fieldsMap} = {
  //     views: [],
  //     fieldsMap: {},
  //     visibleColumns: [],
  //     visibleRelationColumns: [],
  //   },
  // } = useQuery(
  //   ["GET_VIEWS_AND_FIELDS", relatedTableSlug, i18n?.language],
  //   () => {
  //     return constructorTableService.getTableInfo(
  //       relatedTableSlug,
  //       {
  //         data: {},
  //       },
  //       {
  //         language_setting: i18n?.language,
  //       }
  //     );
  //   },
  //   {
  //     enabled: Boolean(relatedTableSlug),
  //     select: ({data}) => {
  //       return {
  //         fieldsMap: listToMap(data?.fields),
  //       };
  //     },
  //     enabled: !!relatedTableSlug,
  //   }
  // );

  // const updateView = useMutation({
  //   mutationFn: async (value) => {
  //     await constructorViewService.update(tableSlug, {
  //       id: selectedTab.id,
  //       columns: selectedTab.columns,
  //       attributes: {name_en: value},
  //     });
  //     return await refetchViews();
  //   },
  // });

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
          ml={"10px"}
        />
      </PopoverTrigger>
      <PopoverContent
        ref={ref}
        w="320px"
        p={openedMenu === null ? "0px" : "8px"}>
        <ColumnsVisibility
          tableSlug={relatedTableSlug}
          layoutTabs={layoutTabs}
          getAllData={getAllData}
          data={data}
          selectedTabIndex={selectedTabIndex}
          selectedTab={selectedTab}
          fieldsMap={fieldsMap}
          refetchViews={refetchViews}
          onBackClick={() => setOpenedMenu(null)}
        />
      </PopoverContent>
    </Popover>
  );
};

export default ViewOptions;
