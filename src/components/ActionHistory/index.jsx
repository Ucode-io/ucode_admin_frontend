import Steps from "../Steps"
import Step from "../Steps/Step"
// import StatusTag from "../Tag/StatusTag"
import CalendarTodayIcon from "@material-ui/icons/CalendarToday"
import ScheduleIcon from "@material-ui/icons/Schedule"
import moment from "moment"
import { useEffect, useMemo } from "react"
import "./style.scss"
import { useState } from "react"
import axios from "../../utils/axios"
import Card from "../Card"

const ActionHistory = ({
  elementID,
  type = "entity",
  title = "Harakatlar tarixi",
}) => {
  const [actionHistory, setActionHistory] = useState([])

  const fetchActionHistory = () => {
    axios
      .get(`/action-history-${type}/${elementID}`)
      .then((res) => setActionHistory(res.action_histories))
  }

  useEffect(() => {
    fetchActionHistory()
  }, [])

  return (
    <Card className="ActionHistory" title={title}>
      <div className="action-history__card">
        <Steps size="small" layout="vertical">
          {actionHistory?.map((action) => (
            <Step
              passed
              type="active"
              extra={<DateBlock date={action.created_at} />}
              subtitle={
                "(" +
                action?.user?.first_name +
                " " +
                action?.user?.last_name +
                ")" +
                " " +
                (type === "entity" ? action?.action : action?.action)
              }
              title={type === "entity" ? action?.user?.organization?.name : ""}
            />
          ))}
          {/* <Step passed title="Hello" type="active" extra={<DateBlock date={"12.07.2000"} />} />
        <Step passed title="Hello" type="active"  extra={<DateBlock date={"12.07.2020"} />} /> */}
        </Steps>
      </div>
    </Card>
  )
}

const DateBlock = ({ date }) => {
  const momentDate = useMemo(() => {
    const newDate = moment(date)
    return {
      time: newDate.format("HH:mm"),
      date: newDate.format("DD.MM.YYYY"),
    }
  }, [date])

  return (
    <div className="DateBlock">
      <div className="tag" style={{ width: "125px" }}>
        <CalendarTodayIcon className="icon" />
        {momentDate.date}
      </div>
      <div className="tag" style={{ width: "90px" }}>
        <ScheduleIcon className="icon" />
        {momentDate.time}
      </div>
    </div>
  )
}

export default ActionHistory
