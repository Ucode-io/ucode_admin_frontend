import AppSelector from "../AppSelector"
import BackButton from "../BackButton"
import IconGenerator from "../IconPicker/IconGenerator"
import RowLinearLoader from "../RowLinearLoader"
import styles from "./style.module.scss"

const HeaderSettings = ({
  title = "",
  subtitle,
  extra,
  children,
  loader,
  backButtonLink,
  icon,
  sticky,
  ...props
}) => {
  return (
    <div className={`${styles.header} ${sticky ? styles.sticky : ''}`}  {...props}>
      <div className={styles.leftSide}>
        {backButtonLink && <BackButton link={backButtonLink} />}

        {icon && <IconGenerator className={styles.icon} icon={icon} />}

        <div className={styles.titleBlock}>
          {title && <div className={styles.title}>{title}</div>}
          {subtitle && <div className={styles.subtitle}>{subtitle}</div>}
        </div>

        <div className={styles.line} />

        <div>{children}</div>
      </div>

      <div className={styles.rightSide}>

        <AppSelector />

      </div>
    </div>
  )
}

export default HeaderSettings
