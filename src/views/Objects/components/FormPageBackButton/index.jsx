import { useDispatch } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import BackButton from "../../../../components/BackButton";
import useTabRouter from "../../../../hooks/useTabRouter";
import { fetchConstructorTableListAction } from "../../../../store/constructorTable/constructorTable.thunk";

const FormPageBackButton = () => {
  const { deleteTab } = useTabRouter();
  // const dispatch = useDispatch();
  // const { appId } = useParams();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const clickHandler = () => {
    deleteTab(pathname);
    navigate(-1);
    // dispatch(fetchConstructorTableListAction(appId));
  };

  return <BackButton className="ml-1" onClick={clickHandler} />;
};

export default FormPageBackButton;
