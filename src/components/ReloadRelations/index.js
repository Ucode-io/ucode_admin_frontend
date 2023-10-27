import {useLocation, useNavigate} from "react-router-dom";
import {useEffect} from "react";
import {useAliveController} from "react-activation";

const ReloadRelations = ({}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const {drop} = useAliveController();
  const url = location?.state?.redirectUrl.replace("reload:", "");
  console.log("location", location);

  useEffect(() => {
    drop(url).then(() => {
      navigate(url, {request: true});
    });
  }, []);
};

export default ReloadRelations;
