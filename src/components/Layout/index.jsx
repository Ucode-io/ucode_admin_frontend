// import Sidebar from "../Sidebar2"
import "./style.scss"

export default function App(props) {

  return (
    <div className="Layout">
      {props.sidebar}
      <div className="content-wrapper bg-background" style={{ height: `calc(100vh - ${props.globalAlertHeight}px)` }} >
        <div>
          {props.children}
        </div>
      </div>
    </div>

    // <div className="flex bg-background w-full" style={{ minHeight: '100vh', height: 'inherit' }}>
    //     <div className="flex-none">
    //         {props.sidebar}
    //     </div>
    //     <div className="flex-grow"
    //         style={{height: "100vh", overflowY: "auto", overflowX: "hidden", position: "relative"}}
    //     >
    //         <div>
    //             {props.children}
    //         </div>
    //     </div>
    // </div>
  )
}
