
import HFTextField from "../../../../../../components/FormElements/HFTextField";
import styles from "./style.module.scss"

const BarChartAttributes = ({ control }) => {
  return ( <>
   <div className={styles.settingsSectionHeader}>Bar chart attributes</div>
   <div className="p-2" >
      <HFTextField control={control} label="Name" name="name" />
   </div>
  </> );
}
 
export default BarChartAttributes;