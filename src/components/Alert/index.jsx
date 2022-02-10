import { useSelector } from 'react-redux'
import AlertElement from './AlertElement'
import './style.scss'

const AlertComponent = () => {
  const alerts = useSelector((state) => state.alert.alerts)

  return (
    <div className='alerts fixed left-5 top-5 '>
      {alerts.map((alert) => (
        <AlertElement
          key={alert.id}
          id={alert.id}
          title={alert.title}
          type={alert.type}
        />
      ))}
    </div>
  )
}

export default AlertComponent
