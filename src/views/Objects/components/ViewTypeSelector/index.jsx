import { TableChart } from "@mui/icons-material";
import style from "./style.module.scss"


const ViewTabSelector = ({ selectedTabIndex, setSelectedTabIndex }) => {



  return ( <div className={style.selector}>
    <div className={`${style.element} ${style.active}`}>
      <TableChart /> 
    </div>
    <div className={style.element}>
      <TableChart /> 
    </div>
    <div className={style.element}>
      <TableChart /> 
    </div>
    <div className={style.element}>
      <TableChart /> 
    </div>
    <div className={style.element}>
      <TableChart /> 
    </div>
    <div className={style.element}>
      <TableChart /> 
    </div>


    


  </div> );
}
 
export default ViewTabSelector;