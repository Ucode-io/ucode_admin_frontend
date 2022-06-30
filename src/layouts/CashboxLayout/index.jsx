import { AttachMoney } from "@mui/icons-material"
import { Outlet } from "react-router-dom"
import Sidebar from "../../components/Sidebar"
import RouterTabsBlock from "../MainLayout/RouterTabsBlock"
import styles from "./style.module.scss"

const elements = [
  {
    id: "cashbox",
    title: "Касса",
    path: "/cashbox/visit",
    icon: AttachMoney,
    // permission: "PROJECTS"
  },
]


const CashboxLayout = () => {
  // const dispatch = useDispatch()

  // useEffect(() => {
  //   dispatch(fetchConstructorTableListAction())
  // }, [dispatch])


  return (
    <div className={styles.layout}>
      <Sidebar elements={elements} />
      <div className={styles.content}>

        <RouterTabsBlock />

        <Outlet />
      </div>
    </div>
  )
}

export default CashboxLayout