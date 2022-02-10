import "./style.scss"

export default function ClientCard({
  cards = [],
  columnNumber = 1,
  inversely = false,
  classNameCard = "justify-between",
  classNameIcon = "",
}) {
  const icon = (item) => (
    <div
      className={`bg-background rounded-full flex justify-center items-center circle text-primary ${classNameIcon}`}
    >
      {item.icon}
    </div>
  )
  return (
    <div className={`grid grid-cols-${columnNumber} gap-4 m-4 ClientCard`}>
      {cards.map((item, index) => (
        <div
          key={index}
          className={`flex bg-white p-6 rounded-md ${classNameCard}`}
        >
          {inversely && icon(item)}
          <div>
            <h3 className="text-primary text-4xl font-bold mr-4">
              {new Intl.NumberFormat().format(item.count)}
            </h3>
            <p className="text-secondary font-medium mt-2">{item?.title}</p>
          </div>
          {!inversely && icon(item)}
        </div>
      ))}
    </div>
  )
}
