import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
export const adminId = `${import.meta.env.VITE_ADMIN_FOLDER_ID}`;

const typeHandlers = {
  FOLDER: ({menuId, element, navigate}) => {
    return navigate(`/${element?.id}`, {replace: false});
  },
  MINIO_FOLDER: ({menuId, element, navigate}) =>
    navigate(`/${menuId}/backet/${element?.id}`),
  TABLE: ({menuId, element, navigate}) =>
    navigate(`/${element?.id}/${element?.data?.table?.slug}`),
  WIKI: ({menuId, element, navigate}) =>
    navigate(
      `/${menuId}/docs/note/${element?.parent_id}/${
        element?.attributes?.wiki_id
          ? element?.attributes?.wiki_id
          : element?.wiki_id
      }`
    ),
  MICROFRONTEND: ({menuId, element, navigate}) => {
    const obj = {};
    element?.attributes?.params.forEach((el) => {
      obj[el.key] = el.value;
    });
    const searchParams = new URLSearchParams(obj || {});
    return navigate({
      pathname: `/${menuId}/page/${element?.data?.microfrontend?.id}`,
      search: `?${searchParams.toString()}`,
    });
  },
  WEBPAGE: ({menuId, element, navigate}) =>
    navigate(`/${menuId}/web-page/${element?.data?.webpage?.id}`),
  USER: ({menuId, element, navigate}) =>
    navigate(`/${menuId}/user-page/${element?.guid}`),
  PERMISSION: ({menuId, element, navigate}) =>
    navigate(`/${menuId}/permission/${element?.guid}`),
  default: ({menuId, navigate}) => {
    return navigate(`/${menuId}`);
  },
};

export const NavigateByType = ({
  element,
  menuId,
  navigate,
  navigateAndSaveHistory,
}) => {
  const handler = typeHandlers[element?.type] || typeHandlers.default;
  return handler({element, menuId, navigate, navigateAndSaveHistory});
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
