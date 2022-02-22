import Header from "components/Header";
import { useTranslation } from "react-i18next";
import Widgets from "components/Widgets";
import HomeIcon from "@material-ui/icons/Home";
import DiscussIcon from "@material-ui/icons/Textsms";
import GavelIcon from "@material-ui/icons/Gavel";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import { useEffect, useMemo, useState } from "react";
import axios from "utils/axios";
import FullScreenLoader from "components/FullScreenLoader";
import AdminDashboard from "./AdminDashboard";

const Dashboard = () => {
  const { t } = useTranslation();
  const [widgetData, setWidgetData] = useState({});
  const [userData, setUserData] = useState({});
  const [loading, setLoader] = useState(true);

  const computedWidgetsData = useMemo(() => {
    return [
      {
        title: "Bo'sh yer uchastkalari",
        icon: HomeIcon,
        number: widgetData?.free_count,
        id: "home",
      },
      {
        title: "Muhokamadagi",
        icon: DiscussIcon,
        number: widgetData?.discussion_count,
        id: "discussion",
      },
      {
        title: "Auksiondagi",
        icon: GavelIcon,
        number: widgetData?.auction_count,
        id: "auction",
      },
      {
        title: "Sotilganlar",
        icon: CheckCircleIcon,
        number: widgetData?.sold_count,
        id: "sold",
      },
    ];
  }, [widgetData]);

  const fetchWidgetData = () => {
    axios.get("/entity-count").then((res) => setWidgetData(res));
  };

  const fetchUserData = () => {
    axios
      .get("/staff-by-token")
      .then((res) => {
        res.status = res.role.status;
        setUserData(res);
      })
      .finally(() => setLoader(false));
  };

  useEffect(() => {
    fetchWidgetData();
    fetchUserData();
  }, []);

  return (
    <>
      {loading ? <FullScreenLoader /> : ""}

      <Header
        title={
          userData?.first_name
            ? `${userData?.first_name} ${userData?.last_name} • ${userData?.organization?.name}`
            : t("dashboard")
        }
      />

      <div className="p-6">
        <Widgets data={computedWidgetsData} />

        <AdminDashboard />
      </div>
    </>
  );
};

export default Dashboard;
