import moment from "moment"
import { useEffect, useState } from "react"
import StatusTag from "../Tag/StatusTag"
import "./style.scss"

let interval

const differentDateGenerator = (deadlineDate) => {
  if (!deadlineDate) return null
  const diffSeconds = deadlineDate.diff(moment(), "seconds")

  if (diffSeconds < 0) return { valid: false, text: "Muddati o'tgan" }

  const day = Math.floor(diffSeconds / 86400)

  const hour = Math.floor((diffSeconds % 86400) / 3600)
    .toString()
    .padStart(2, "0")

  const minute = Math.floor((diffSeconds % 3600) / 60)
    .toString()
    .padStart(2, "0")

  const seconds = (diffSeconds % 60).toString().padStart(2, "0")

  return { valid: true, text: `${day} kun, ${hour}:${minute}:${seconds}` }
}

const DeadlineTimer = ({ deadlineDate }) => {
  const [diffDate, setDiffDate] = useState(null)

  useEffect(() => {
    interval = setInterval(() => {
      setDiffDate(differentDateGenerator(deadlineDate))
    }, [1000])

    return () => {
      clearInterval(interval)
    }
  }, [])

  if (!diffDate) return null

  return (
    <div>
      <StatusTag
        status={diffDate.valid}
        style={{ width: "160px" }}
        innerText={diffDate.text}
      />
    </div>
  )
}

export default DeadlineTimer
