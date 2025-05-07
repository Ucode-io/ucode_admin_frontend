import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
export const adminId = `${import.meta.env.VITE_ADMIN_FOLDER_ID}`;

const typeHandlers = {
  FOLDER: ({appId, element, navigate}) => {
    return navigate(`/${element?.id}`);
  },
  MINIO_FOLDER: ({appId, element, navigate}) =>
    navigate(`/${appId}/backet/${element?.id}`),
  TABLE: ({appId, element, navigate}) =>
    navigate(`/${element?.id}/${element?.data?.table?.slug}`),
  WIKI: ({appId, element, navigate}) =>
    navigate(
      `/${appId}/docs/note/${element?.parent_id}/${
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
      pathname: `/${appId}/page/${element?.data?.microfrontend?.id}`,
      search: `?${searchParams.toString()}`,
    });
  },
  WEBPAGE: ({appId, element, navigate}) =>
    navigate(`/${appId}/web-page/${element?.data?.webpage?.id}`),
  USER: ({appId, element, navigate}) =>
    navigate(`/${appId}/user-page/${element?.guid}`),
  PERMISSION: ({appId, element, navigate}) =>
    navigate(`/${appId}/permission/${element?.guid}`),
  default: ({appId, navigate}) => {
    return navigate(`/${appId}`);
  },
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
