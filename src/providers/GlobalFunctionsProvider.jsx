import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchApplicationListActions } from "../store/application/application.thunk";


const GlobalFunctionsProvider = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchApplicationListActions())
  }, [dispatch])


  return null;
}
 
export default GlobalFunctionsProvider;