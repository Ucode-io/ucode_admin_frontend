import "./style.scss"

const RippleLoader = ({ size = "" }) => {
  return ( <div className={`lds-dual-ring ${size}`}></div> );
}
 
export default RippleLoader;