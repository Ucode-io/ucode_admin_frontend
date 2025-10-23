import constructorViewService from "@/services/viewsService/views.service";
import { detailDrawerActions } from "@/store/detailDrawer/detailDrawer.slice";
import { TrashIcon } from "@/utils/constants/icons";
import { Flex, Spinner } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { ViewOptionTitle } from "../../../ViewOptionTitle";
import { generateLangaugeText } from "@/utils/generateLanguageText";

export const DeleteView = ({
  relationView,
  view,
  refetchViews,
  tableLan,
  tableSlug,
}) => {
  const dispatch = useDispatch();
  const { i18n } = useTranslation();
  const queryClient = useQueryClient();
  const viewsList = useSelector((state) => state.groupField.viewsList);
  const mutation = useMutation({
    mutationFn: () => constructorViewService.delete(view.id, tableSlug),
    onSuccess: () => {
      relationView
        ? dispatch(detailDrawerActions.setDrawerTabIndex(0))
        : dispatch(detailDrawerActions.setMainTabIndex(0));

      if (relationView && viewsList?.length > 1) {
        return queryClient.refetchQueries(["GET_TABLE_VIEWS_LIST_RELATION"]);
      } else if (relationView && viewsList?.length <= 1) {
        return queryClient.refetchQueries(["GET_TABLE_VIEWS_LIST"]);
      } else refetchViews();
    },
  });

  return (
    <Flex
      padding="6px 8px"
      h="32px"
      columnGap="4px"
      alignItems="center"
      borderRadius={6}
      _hover={{ bg: "#EAECF0" }}
      cursor="pointer"
      onClick={() => mutation.mutate()}
    >
      {mutation.isLoading ? <Spinner w="20px" h="20px" /> : <TrashIcon />}
      <ViewOptionTitle>
        {generateLangaugeText(tableLan, i18n?.language, "Delete") || "Delete"}
      </ViewOptionTitle>
    </Flex>
  );
};