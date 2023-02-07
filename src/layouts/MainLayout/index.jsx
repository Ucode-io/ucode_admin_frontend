import {useEffect} from "react"
import {useDispatch, useSelector} from "react-redux"
import {Outlet, useNavigate, useParams} from "react-router-dom"
import Sidebar from "../../components/Sidebar"
import useSidebarElements from "../../hooks/useSidebarElements"
import {fetchConstructorTableListAction} from "../../store/constructorTable/constructorTable.thunk"
import RouterTabsBlock from "./RouterTabsBlock"
import styles from "./style.module.scss"
import {useQuery} from "react-query";
import projectService from "@/services/projectService";
import Favicon from "react-favicon";

const MainLayout = ({setFavicon, favicon}) => {
    const {appId} = useParams()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const {elements} = useSidebarElements()
    const projectId = useSelector(state => state.auth.projectId)

    useEffect(() => {
        dispatch(fetchConstructorTableListAction(appId))
    }, [dispatch, appId])

    useEffect(() => {
        const keyDownHandler = event => {
            if (event.key === 'Escape') {
                event.preventDefault();
                navigate(-1)
            }
        };

        document.addEventListener('keydown', keyDownHandler);
        return () => {
            document.removeEventListener('keydown', keyDownHandler);
        };
    }, []);

    const { data: projectInfo } = useQuery(
      [
          "GET_PROJECT_BY_ID",
          projectId
      ],
      () => {
          return projectService.getById(projectId);
      },
    );

    useEffect(() => {
        setFavicon(projectInfo?.logo)
        document.title = projectInfo?.title
    }, [projectInfo])

    return (
        <div className={styles.layout}>
            <Favicon url={favicon} />
            <Sidebar elements={elements}/>
            <div className={styles.content}>
                <RouterTabsBlock/>

                <Outlet/>
            </div>
        </div>
    )
}

export default MainLayout
