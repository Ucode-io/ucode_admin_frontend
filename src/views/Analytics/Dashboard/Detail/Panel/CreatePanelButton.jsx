


import { AddCircleOutline } from "@mui/icons-material";
import styles from "./style.module.scss"

const CreatePanelButton = () => {
  return ( <div className={styles.createPanelButton} >
    
    <AddCircleOutline sx={{ fontSize: 40 }} />

    <p className={styles.createPanelText} >Add new graph</p>

  </div> );
}
 
export default CreatePanelButton;