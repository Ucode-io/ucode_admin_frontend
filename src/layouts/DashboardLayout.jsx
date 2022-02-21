import { useEffect } from "react";
import { connectSocket } from "utils/socket.js";
import { connect } from "utils/stackMessages";
import ChangePasswordAlert from "../components/Alert/ChangePasswordAlert.jsx";
import AlertComponent from "../components/Alert/index.jsx";
import GlobalAlert from "../components/GlobalAlert/index.jsx";
// import Layout from "../components/Layout/index.jsx"
import Sidebar from "../components/Sidebar/index.jsx";
// import { fetchAnnouncement } from "../redux/actions/alertActions"
// import Sidebar from "../components/Sidebar2/index.jsx"
import "./style.scss";

export default function DashboardLayout({ children }) {
  // const dispatch = useDispatch()
  // const globalAlertHeight = useSelector(
  //   (state) => state.alert.globalAlertHeight
  // )

  // useEffect(() => {
  //   dispatch(fetchAnnouncement())
  // }, [])

  useEffect(() => {
    connectSocket();
    connect("messages");
  }, []);

  return (
    <>
      <AlertComponent />
      <ChangePasswordAlert />

      <div className="DashboardLayout">
        <Sidebar />
        <div className="content-wrapper bg-background">
          <GlobalAlert />
          <div style={{ position: "relative" }}>{children}</div>
        </div>
      </div>

      {/* <div >
        <GlobalAlert />
        <Layout sidebar={<Sidebar globalAlertHeight={globalAlertHeight} />} globalAlertHeight={globalAlertHeight} >{children}</Layout>
      </div> */}
    </>
  );
}
