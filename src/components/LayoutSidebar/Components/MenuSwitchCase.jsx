import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

const typeHandlers = {
  FOLDER: ({appId, navigate}) => navigate(`/main/${appId}`),
  MINIO_FOLDER: ({appId, element, navigate}) =>
    navigate(`/main/${appId}/backet/${element?.id}`),
  TABLE: ({appId, element, navigate}) =>
    navigate(`/main/${element?.parent_id}/object/${element?.data?.table?.slug}?menuId=${element?.id}`),
  WIKI: ({appId, element, navigate}) =>
    navigate(
      `/main/${appId}/docs/note/${element?.parent_id}/${
        element?.attributes?.wiki_id
          ? element?.attributes?.wiki_id
          : element?.wiki_id
      }`
    ),
  MICROFRONTEND: ({appId, element, navigate}) => {
    const obj = {};
    element?.attributes?.params.forEach((el) => {
      obj[el.key] = el.value;
    });
    const searchParams = new URLSearchParams(obj || {});
    return navigate({
      pathname: `/main/${appId}/page/${element?.data?.microfrontend?.id}`,
      search: `?${searchParams.toString()}`,
    });
  },
  WEBPAGE: ({appId, element, navigate}) =>
    navigate(`/main/${appId}/web-page/${element?.data?.webpage?.id}`),
  USER: ({appId, element, navigate}) =>
    navigate(`/main/${appId}/user-page/${element?.guid}`),
  // REPORT_SETTING: ({appId, element, navigate}) =>
  //   navigate(`/main/${appId}/report-setting/${element?.report_setting_id}`),
  PERMISSION: ({appId, element, navigate}) =>
    navigate(`/main/${appId}/permission/${element?.guid}`),
  // PIVOT: ({element, navigateAndSaveHistory}) => navigateAndSaveHistory(element),
  default: ({appId, navigate}) => navigate(`/main/${appId}`),
};

export const NavigateByType = ({
  element,
  appId,
  navigate,
  navigateAndSaveHistory,
}) => {
  const handler = typeHandlers[element?.type] || typeHandlers.default;
  return handler({element, appId, navigate, navigateAndSaveHistory});
};

export const MenuFolderArrows = ({element, childBlockVisible}) => {
  const type = element?.type;
  const isFolder =
    type === "FOLDER" || type === "WIKI_FOLDER" || type === "MINIO_FOLDER";
  const IconComponent = isFolder ? (
    childBlockVisible ? (
      <KeyboardArrowDownIcon />
    ) : (
      <KeyboardArrowRightIcon />
    )
  ) : null;

  return IconComponent;
};
