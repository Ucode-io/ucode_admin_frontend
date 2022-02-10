import "./style.scss"
import Widget from "./Widget"

const Widgets = ({data}) => {
  return (
    <div className="w-full flex mb-5 gap-4 Widgets" >
      {
        data.map(widget => (
          <Widget 
            Icon={widget.icon}
            title={widget.title}
            number={widget.number}
          />
        ))
      }

      {/* <Widget />
      <Widget />
      <Widget />
      <Widget /> */}

    </div>
  )
}

export default Widgets
