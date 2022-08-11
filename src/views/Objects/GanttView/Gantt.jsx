
import DatesRow from "./DatesRow";
import RecursiveBlock from "./RecursiveBlock";
import styles from "./style.module.scss"

const Gantt = ({ data, fieldsMap, datesList, view, tabs }) => {
  return ( <div className={styles.wrapper} >
    <div className={styles.gantt} >

<DatesRow datesList={datesList} />


<RecursiveBlock data={data} fieldsMap={fieldsMap} view={view} tabs={tabs} datesList={datesList} />


</div>
  </div> );
}
 
export default Gantt;