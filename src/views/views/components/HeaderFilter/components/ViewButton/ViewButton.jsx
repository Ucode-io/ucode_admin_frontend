import { default as SVG } from "react-inlinesvg";
import {
  Box,
  Button,
} from "@chakra-ui/react";
import { viewIcons } from "@/utils/constants/viewTypes";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useTranslation } from "react-i18next";

export const ViewButton = ({
  handleViewClick,
  handleClick,
  view,
  viewId,
  visibleViews,
  getViewName,
  overflowedViews,
  index,
}) => {
  const { t } = useTranslation();

  const isLastAndMoreViewButton =
    overflowedViews?.length > 0 && index === visibleViews?.length - 1;

  return (
    <Button
      p={"0 6px"}
      minW={"80px"}
      key={view?.id}
      variant="ghost"
      colorScheme="grey"
      textTransform="uppercase"
      mx={"4px"}
      leftIcon={
        isLastAndMoreViewButton ? (
          <></>
        ) : (
          <SVG
            src={`/img/${viewIcons[view?.type]}`}
            color={viewId === view?.id ? "#175CD3" : "#475467"}
            width={18}
            height={18}
          />
        )
      }
      fontSize={13}
      h={"30px"}
      fontWeight={500}
      color={viewId === view?.id ? "#175CD3" : "#475467"}
      bg={
        viewId === view?.id ||
        (overflowedViews?.find((view) => view?.id === viewId) &&
          index === visibleViews?.length - 1)
          ? "#D1E9FF"
          : "#fff"
      }
      _hover={viewId === view?.id ? { bg: "#D1E9FF" } : undefined}
      onClick={(e) => {
        e.stopPropagation();
        if (overflowedViews?.length > 0) {
          if (index !== visibleViews?.length - 1) {
            handleViewClick(view, index);
          } else {
            handleClick(e);
          }
        } else handleViewClick(view, index);
      }}
    >
      {isLastAndMoreViewButton ? t("more") : getViewName(view)}

      {isLastAndMoreViewButton && (
        <Box
          onClick={handleClick}
          sx={{
            height: "19px",
            cursor: "pointer",
          }}
        >
          <KeyboardArrowDownIcon />
        </Box>
      )}
    </Button>
  );
};