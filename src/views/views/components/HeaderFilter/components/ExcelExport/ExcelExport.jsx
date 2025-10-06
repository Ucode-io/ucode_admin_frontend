import useDownloader from "@/hooks/useDownloader";
import { constructorObjectService } from "@/services/objectService/object.service";
import { Flex, Spinner } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useMutation } from "react-query";
import { ViewOptionTitle } from "../../../ViewOptionTitle";
import { FileExportIcon } from "@/utils/constants/icons";
import { generateLangaugeText } from "@/utils/generateLanguageText";

export const ExcelExport = ({
  searchText,
  checkedColumns,
  computedVisibleFields,
  tableLan,
  tableSlug,
  filters,
}) => {
  // const {tableSlug} = useParams();
  const { download } = useDownloader();
  const { i18n } = useTranslation();

  const mutation = useMutation({
    mutationFn: async () => {
      const { data } = await constructorObjectService.downloadExcel(tableSlug, {
        data: {
          field_ids: computedVisibleFields,
          language: i18n.language,
          search: searchText,
          view_fields: checkedColumns,
          ...filters,
        },
      });
      return await download({
        fileName: `${tableSlug}.xlsx`,
        link: "https://" + data.link,
      });
    },
  });

  return (
    <Flex
      p="8px"
      h="32px"
      columnGap="4px"
      alignItems="center"
      borderRadius={6}
      _hover={{ bg: "#EAECF0" }}
      cursor="pointer"
      onClick={mutation.mutate}
    >
      {mutation.isLoading ? <Spinner w="20px" h="20px" /> : <FileExportIcon />}
      <ViewOptionTitle>
        {generateLangaugeText(tableLan, i18n?.language, "Export") || "Export"}
      </ViewOptionTitle>
      {/* <ChevronRightIcon ml="auto" fontSize={18} color="#D0D5DD" /> */}
    </Flex>
  );
};