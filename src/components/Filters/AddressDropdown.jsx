import { PlacemarkIcon } from "../../constants/icons"
import Card from "../Card"

export default function AddressDropdown({
  options = [],
  setAddressList,
  setPlacemarkGeometry,
  setFieldValue,
  setSearchAddress,
}) {
  return (
    <>
      <Card
        style={{
          backgroundColor: "#fff",
          position: "absolute",
          zIndex: 99,
          filter: "drop-shadow(0px 16px 40px rgba(0, 0, 0, 0.1))",
        }}
        headerStyle={{ padding: "10px 12px" }}
        bodyStyle={{
          padding: 0,
          overflowY: "auto",
          maxHeight: 336 - 56 * 2,
        }}
      >
        {options.map((elm, index) => (
          <div
            className={`px-4 py-3 text-sm flex items-start cursor-pointer hover:bg-gray-50 ${
              index + 1 === options.length ? "" : "border-b"
            }`}
            onClick={() => {
              setFieldValue("to_address", `${elm.label}, ${elm.description}`)
              setPlacemarkGeometry([
                elm.geometry.coordinates[1],
                elm.geometry.coordinates[0],
              ])
              setAddressList([])
              setSearchAddress("")
            }}
            key={elm.value}
          >
            <div className="mr-2 pt-0.5">
              <PlacemarkIcon />
            </div>
            <div>
              <div className="text-sm mb-1 font-medium">{elm.label}</div>
              <span className="text-xs">{elm.description}</span>
            </div>
          </div>
        ))}
      </Card>
    </>
  )
}
