import { useState, useMemo, useEffect } from "react"
import { StyledTab, StyledTabs } from "."
import { useTranslation } from "react-i18next"
import RusFlag from "../../assets/icons/Ellipse 8.png"
import EngFlag from "../../assets/icons/Ellipse 9.png"
import FlagUz from "../../assets/icons/Ellipse 7.png"

const defaultOptions = [
  {
    label: "russian",
    value: "ru",
    image: RusFlag,
  },
  {
    label: "english",
    value: "en",
    image: EngFlag,
  },
  {
    label: "uzbek",
    value: "uz",
    image: FlagUz,
  },
]

export default function TabsWithFlags({
  options = defaultOptions,
  wrapperPadding = 16,
  defaultValue = "ru",
  value,
}) {
  const { t } = useTranslation()
  const [selectedTab, setSelectedTab] = useState(value ?? defaultValue)

  const tabLabel = (text, isActive = false) => {
    return <span className="px-1">{text}</span>
  }

  const tabValue = useMemo(() => value ?? selectedTab, [selectedTab])

  return (
    <div
      className="border-b px-3"
      style={{
        marginLeft: -wrapperPadding,
        marginRight: -wrapperPadding,
        marginTop: -wrapperPadding,
        marginBottom: wrapperPadding,
      }}
    >
      <StyledTabs
        value={tabValue}
        onChange={(_, value) => setSelectedTab(value)}
        indicatorColor="primary"
        textColor="primary"
        centered={false}
        aria-label="full width tabs example"
        TabIndicatorProps={{ children: <span className="w-2" /> }}
      >
        {options.map((elm, i) => (
          <StyledTab
            key={i}
            style={{ minWidth: 100 }}
            label={
              <div className="flex items-center">
                <img
                  width={16}
                  className="mr-2"
                  src={elm.image}
                  alt={`flag-${elm.value}`}
                />
                {tabLabel(t(elm.label))}
              </div>
            }
            value={elm.value}
          />
        ))}
      </StyledTabs>
    </div>
  )
}
