import FiltersBlock from "../../../components/FiltersBlock";
import DatesRow from "./DatesRow";
import MainFieldRow from "./MainFieldRow";
import styles from "./style.module.scss"


const CalendarView = () => {
  return ( <div>
    <FiltersBlock  />

    <div className={styles.main} >
      
      <div className={styles.card} >
        <div className={styles.wrapper} >

      

        <DatesRow />

          <MainFieldRow />

          




        </div>
 


      </div>


    </div>
  </div> );
}
 
export default CalendarView;