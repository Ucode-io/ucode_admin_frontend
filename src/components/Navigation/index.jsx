import NavigationIcon from '@material-ui/icons/Navigation';
import { useTranslation } from "react-i18next"

export default function Navigation ({className, ...props}) {
  const { t } = useTranslation()

  return (
    <div
      className={`flex fill-current text-primary-600 cursor-pointer items-center ${className}`}
      {...props}
    >
      <NavigationIcon size={14} style={{ transform: 'rotate(45deg)' }} />
      <div className="ml-3 text-base">{t('select.location')}</div>
    </div>
  )
}