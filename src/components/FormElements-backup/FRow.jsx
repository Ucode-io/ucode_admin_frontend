import "./style.scss"


const FRow = ({ label, children, position="vertical" }) => {
  return (
    <div className={`FRow ${position}`} >
      <div className="label">{label}:</div>
      <div className="component">{children}</div>
    </div>  
  )
}

export default FRow
