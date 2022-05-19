import { Typography } from "@mui/material"
import styles from "./style.module.scss"

const FormCard = ({ title, children }) => {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <Typography variant="h4" className="title">
          {title}
        </Typography>
      </div>
      <div className={styles.body} >
        {children}
      </div>
    </div>
  )
}

export default FormCard
