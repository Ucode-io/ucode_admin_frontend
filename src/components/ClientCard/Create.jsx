import "./style.scss"
import { useTranslation } from "react-i18next"

export default function ClientCreateCard({ cards = [] }) {
  const { t } = useTranslation()

  return (
    <div className="grid grid-cols-4 gap-4 m-4 ClientCard">
      {cards.map((item, index) => (
        <div
          key={index}
          className="flex justify-between bg-white p-6 rounded-lg"
        >
          <div>
            <h3 className="text-primary text-lg font-semibold">
              {item.count}{" "}
            </h3>
            <p className="text-secondary mt-3 text-sm font-normal">
              {item?.title}
            </p>
          </div>
          <div
            style={{ minWidth: "72px", height: "72px" }}
            className="ml-8 bg-background rounded-full flex justify-center items-center circle text-primary"
          >
            {item.icon}
          </div>
        </div>
      ))}
    </div>
  )
}
