
import { Collapse } from "@mui/material";
import { useState } from "react";
import CollapseIcon from "../../../../../components/CollapseIcon";
import FRow from "../../../../../components/FormElements/FRow";
import HFSwitch from "../../../../../components/FormElements/HFSwitch";
import HFTextField from "../../../../../components/FormElements/HFTextField";
import styles from "./style.module.scss"

const SettingsPanel = ({ form }) => {
  const [open, setOpen] = useState(false);

  return (  <div className={styles.settingsPanel} >
    
    <div className={styles.sectionButton} onClick={() => setOpen(prev => !prev)} >
      <CollapseIcon isOpen={open} />

      <div className={styles.sectionButtonTitle} >
          Main info
      </div>
    </div>


    <Collapse in={open} >
      <div className={styles.form} >
        <FRow label={"Title"} >
          <HFTextField control={form.control} name="title" fullWidth />
        </FRow>

        <FRow label={"Pagination"} >
          <HFSwitch control={form.control} name="has_pagination" />
        </FRow>

        <FRow label={"X-axis"} >
          <HFTextField control={form.control} name="test1" fullWidth />
        </FRow>


        <FRow label={"Show label on x-axis"} >
          <HFSwitch control={form.control} name="test2" fullWidth />
        </FRow>

        <FRow label={"Y-axis"} >
          <HFTextField control={form.control} name="test3" fullWidth />
        </FRow>


        <FRow label={"Show label on y-axis"} >
          <HFSwitch control={form.control} name="test4" fullWidth />
        </FRow>
      </div>
    </Collapse>


  </div> );
}
 
export default SettingsPanel;