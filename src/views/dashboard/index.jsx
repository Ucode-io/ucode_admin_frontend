import Header from "components/Header";
import { useTranslation } from "react-i18next";
import Widgets from "components/Widgets";
import HomeIcon from "@material-ui/icons/Home";
import DiscussIcon from "@material-ui/icons/Textsms";
import GavelIcon from "@material-ui/icons/Gavel";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import { useEffect, useMemo, useState } from "react";
import FullScreenLoader from "components/FullScreenLoader";
import AdminDashboard from "./AdminDashboard";
import * as requests from "services/dashboard";
import moment from "moment";

const Dashboard = () => {
  const { t } = useTranslation();
  const [userData, setUserData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [branchesCount, setBranchesCount] = useState(0);
  const [couriersCount, setCouriersCount] = useState(0);
  const [customersCount, setCustomersCount] = useState(0);
  const [orderLocations, setOrderLocations] = useState(0);
  const [statistics, setStatistics] = useState({});

  const computedWidgetsData = useMemo(() => {
    return [
      {
        title: "Количество филиалов",
        icon: HomeIcon,
        number: branchesCount,
        id: "home",
      },
      {
        title: "Количество клиентов",
        icon: DiscussIcon,
        number: customersCount,
        id: "discussion",
      },
      {
        title: "Количество курьеров",
        icon: GavelIcon,
        number: couriersCount,
        id: "auction",
      },
    ];
  }, [branchesCount, customersCount, couriersCount]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      let [branches, couriers, statistics, locations] = await Promise.all([
        requests.getBranchesCount({ page: 1, limit: 1000 }),
        // requests.getCustomersCount({ page: 1, limit: 10 }),
        requests.getCouriersCount({ page: 1, limit: 10 }),
        requests.getStatistics({ month: 2, year: 2022 }),
        requests.getOrderLocations({
          page: 1,
          limit: 10000,
          start_date: moment().format("YYYY-MM-DD HH:mm:ss"),
          end_date: moment().add(2, "days").format("YYYY-MM-DD HH:mm:ss"),
        }),
      ]);
      setBranchesCount(branches.count);
      // setCustomersCount(customers.count);
      setCouriersCount(couriers.count);
      setStatistics(statistics);
      setOrderLocations(locations.orders);
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      {isLoading ? <FullScreenLoader /> : ""}

      <Header
        title={
          userData?.first_name
            ? `${userData?.first_name} ${userData?.last_name} • ${userData?.organization?.name}`
            : t("dashboard")
        }
      />

      <div className="p-6">
        <Widgets data={computedWidgetsData} />

        <AdminDashboard statistics={statistics} />
      </div>
    </>
  );
};

export default Dashboard;
