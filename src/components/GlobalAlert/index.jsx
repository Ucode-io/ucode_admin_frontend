import { Alert } from "@material-ui/lab"
import { useSelector } from "react-redux"
import "./style.scss"
import { useCallback } from "react"
import { useResizeDetector } from "react-resize-detector"
import { useDispatch } from "react-redux"
import { setGlobalAlertHeight } from "../../redux/reducers/alertReducer"

const GlobalAlert = () => {
  const alert = useSelector((state) => state.alert.globalAlert)
  const dispatch = useDispatch()

  const onResize = useCallback((width, height) => {
    if (!height) return null

    dispatch(setGlobalAlertHeight(height))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const { ref } = useResizeDetector({
    onResize,
    handleHeight: true,
    handleWidth: false,
    // skipOnMount: true,
  })

  return (
    <div className="GlobalAlert" ref={ref}>
      {alert && (
        <Alert className="alert" severity={alert.type}>
          {alert.announcement}
        </Alert>
      )}
    </div>
  )
}

export default GlobalAlert
