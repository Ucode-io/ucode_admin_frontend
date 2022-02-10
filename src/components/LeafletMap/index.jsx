import "leaflet/dist/leaflet.css"
import { Map, TileLayer } from "react-leaflet"

const LeafletMap = () => {
  return (
    <div style={{ width: "100%", height: "500px" }}>
      <Map center={[51.505, -0.09]} zoom={13} scrollWheelZoom={false}>
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      </Map>
    </div>
  )
}

export default LeafletMap
