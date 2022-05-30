import { Typography } from "@mui/material"
import IconGenerator from "../../../../components/IconPicker/IconGenerator"
import styles from "./style.module.scss"

const FormCard = ({ title, children, icon }) => {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.headerLeftSide}>
          <IconGenerator icon={icon} />
          <Typography variant="h4" className="title">
            {title}
          </Typography>
        </div>
      </div>
      <div className={styles.body}>{children}</div>
    </div>
  )
}

export default FormCard
