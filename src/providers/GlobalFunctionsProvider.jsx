import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchConstructorTableListAction } from "../store/constructorTable/constructorTable.thunk";



const GlobalFunctionsProvider = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchConstructorTableListAction())
  }, [dispatch])


  return null;
}
 
export default GlobalFunctionsProvider;