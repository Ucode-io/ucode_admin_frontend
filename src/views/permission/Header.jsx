import HeaderWrapper from "../../components/Header"
import Breadcrumb from "../../components/Breadcrumb/index";
import { useTranslation } from "react-i18next";
import Button from "../../components/Buttons"
import CircularProgress from "@material-ui/core/CircularProgress";


export default function Header ({ params, loading }) {
  
  // **** USE-HOOKS ****
  const { t } = useTranslation();

  // **** CONSTANTS ****
  const routes = [
    {
      title: t("settings"),
      link: true,
      route: "/home/settings",
    },
    {
      title: t("permission"),
      link: true,
      route: "/home/settings/permission",
    },
    {
      title: params.id ? t("save") : t("create"),
    },
  ];

  return (
    <HeaderWrapper
      title={t("roles")}
      startAdornment={[<Breadcrumb routes={routes} />]}
      endAdornment={[
        <Button
          size="large"
          type="submit"
          shape="text"
          color="text-primary-600"
          // onClick={onSubmit}
          icon={
            loading ? (
              <CircularProgress color="inherit" size={14} />
            ) : (
              <></>
            )
          }
        >
          {t(params.id ? "edit" : "create")}
        </Button>,
      ]}
    />
  )
}