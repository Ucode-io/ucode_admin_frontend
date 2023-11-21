import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

export const NavigateByType = ({
  element,
  appId,
  navigate,
  navigateAndSaveHistory,
}) => {
  switch (element?.type) {
    case "FOLDER":
      return navigate(`/main/${appId}`);
    case "MINIO_FOLDER":
      return navigate(`/main/${appId}/backet/${element?.id}`);
    case "TABLE":
      return navigate(`/main/${appId}/object/${element?.data?.table?.slug}`);
    case "WIKI":
      return navigate(
        `/main/${appId}/docs/note/${element?.parent_id}/${
          element?.attributes?.wiki_id
            ? element?.attributes?.wiki_id
            : element?.wiki_id
        }`
      );
    case "MICROFRONTEND":
      let obj = {};
      element?.attributes?.params.forEach((el) => {
        obj[el.key] = el.value;
      });
      const searchParams = new URLSearchParams(obj || {});
      return navigate({
        pathname: `/main/${appId}/page/${element?.data?.microfrontend?.id}`,
        search: `?${searchParams.toString()}`,
      });

    case "WEBPAGE":
      return navigate(`/main/${appId}/web-page/${element?.data?.webpage?.id}`);
    case "USER":
      return navigate(`/main/${appId}/user-page/${element?.guid}`);

    case "REPORT_SETTING":
      return navigate(
        `/main/${appId}/report-setting/${element?.report_setting_id}`
      );

    case "PERMISSION":
      return navigate(`/main/${appId}/permission/${element?.guid}`);

    case "PIVOT":
      return navigateAndSaveHistory(element);

    default:
      return navigate(`/main/${appId}`);
  }
};

export const MenuFolderArrows = ({ element, childBlockVisible }) => {
  if (childBlockVisible && element?.type === "FOLDER") {
    return <KeyboardArrowDownIcon />;
  } else if (!childBlockVisible && element?.type === "FOLDER") {
    return <KeyboardArrowRightIcon />;
  } else if (childBlockVisible && element?.type === "WIKI_FOLDER") {
    return <KeyboardArrowDownIcon />;
  } else if (!childBlockVisible && element?.type === "WIKI_FOLDER") {
    return <KeyboardArrowRightIcon />;
  } else if (childBlockVisible && element?.type === "MINIO_FOLDER") {
    return <KeyboardArrowDownIcon />;
  } else if (!childBlockVisible && element?.type === "MINIO_FOLDER") {
    return <KeyboardArrowRightIcon />;
  }
};
