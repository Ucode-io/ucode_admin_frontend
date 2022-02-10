import "./style.scss"

export default function ViewDate({date = ""}) {
  return (
    <div className="inline-block">
      <div className="view-date flex items-center">
        <p className="date-text">{date.slice(0, 10)}</p>
        <div className="time-content">
          <p className="time-text">{date.slice(11, 16)}</p>
        </div>
      </div>
    </div>
  )
}
