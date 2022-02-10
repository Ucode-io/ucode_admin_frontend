import { Alert } from '@material-ui/lab'
const AlertElement = ({ id, title, type }) => {
  // useEffect(() => {
  //   timeout = setTimeout(() => {
  //     dispatch(deleteAlert(id))
  //   }, 4000)
  //   return () => {
  //     clearTimeout(timeout)
  //   }
  // }, [])

  return (
    <div>
      <Alert
        severity={type}
        style={{ padding: '10px 30px' }}
        className='shake-animation mb-3'
      >
        {title}
      </Alert>
    </div>
  )
}

export default AlertElement
