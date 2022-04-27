import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchContructorTableListAction } from "../store/contructorTable/contructorTable.thunk";



const GlobalFunctionsProvider = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchContructorTableListAction())
  }, [dispatch])


  return null;
}
 
export default GlobalFunctionsProvider;