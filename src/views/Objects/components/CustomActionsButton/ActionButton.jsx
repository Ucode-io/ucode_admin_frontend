import { useState } from "react"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import PrimaryButton from "../../../../components/Buttons/PrimaryButton"
import IconGenerator from "../../../../components/IconPicker/IconGenerator"
import { showAlert } from "../../../../store/alert/alert.thunk"
import request from "../../../../utils/request"

const ActionButton = ({ event, id }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [btnLoader, setBtnLoader] = useState(false)

  const invokeFunction = () => {
    const data = {
      function_id: event.event_path,
      object_ids: [id],
    }

    setBtnLoader(true)

    request
      .post("/invoke_function", data)
      .then((res) => {
        dispatch(showAlert("Success", "success"))

        let url = event?.url ?? ""

        if (url) {
          Object.entries(res?.data ?? {}).forEach(([key, value]) => {
            const computedKey = "${" + key + "}"
            url = url.replaceAll(computedKey, value)
          })
        }

        navigate(url)
      })
      .finally(() => setBtnLoader(false))
  }

  return (
    <PrimaryButton loader={btnLoader} onClick={invokeFunction}>
      <IconGenerator icon={event.icon} /> {event.label}
    </PrimaryButton>
  )
}

export default ActionButton
