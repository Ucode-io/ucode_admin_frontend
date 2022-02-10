import Breadcrumb from "../../components/Breadcrumb/index";
import CustomButton from "../../components/Buttons/index";
import HeaderWrapper from "../../components/Header";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useTranslation } from "react-i18next";


export default function Header ({ params, loading, initialValues }) {

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
      title: t("roles"),
      link: true,
      route: "/home/settings/roles",
    },
    {
      title: params.id ? initialValues.name : t("create"),
    },
  ];

  return (
    <HeaderWrapper
      title={t("roles")}
      startAdornment={[<Breadcrumb routes={routes} />]}
      endAdornment={[
        <CustomButton
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
        </CustomButton>,
      ]}
    />
  )
}