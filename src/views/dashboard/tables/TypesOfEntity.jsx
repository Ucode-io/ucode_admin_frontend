/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import axios from "../../../utils/axios"
import Card from "../../../components/Card"
// import Button from "../../../components/Button"
import TypesOfEntity1 from "../../../assets/icons/TypesOfEntity1"
import TypesOfEntity2 from "../../../assets/icons/TypesOfEntity2"
import TypesOfEntity3 from "../../../assets/icons/TypesOfEntity3"
import TypesOfEntity4 from "../../../assets/icons/TypesOfEntity4"
import { useHistory } from "react-router"

let timeout

const TypesOfEntity = () => {
  const { t } = useTranslation()
  const [items, setItems] = useState({})
  const [loader, setLoader] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  // const [selectedCityId, setSelectedCityId] = useState(null)
  // const [selectedRegionId, setSelectedRegionId] = useState(null)
  // const [selectedStatusId, setSelectedStatusId] = useState(null)
  const [searchText, setSearchText] = useState(null)
  const history = useHistory()

  useEffect(() => {
    getItems(currentPage, true)
  }, [currentPage])

  useEffect(() => {
    return () => {
      clearTimeout(timeout)
    }
  }, [])

  const clearItems = () => {
    setItems((prev) => ({ count: prev.count }))
  }

  const getItems = (page, loader) => {
    clearTimeout(timeout)
    if (loader) {
      setLoader(true)
      clearItems()
    }

    axios
      .get("/entity-draft-expired")
      .then((res) => {
        timeout = setTimeout(() => {
          getItems(currentPage, false)
        }, 5000)
        setItems(res)
      })
      .finally(() => setLoader(false))
  }

  const data = [
    {
      title: "Davlat va jamoat ehtiyojlari",
      icon: <TypesOfEntity1 />,
      number: "325",
      link: "/home/application/create/1",
    },
    {
      title: "Tadbirkorlik va shaharsozlik",
      icon: <TypesOfEntity2 />,
      number: "246",
      link: "/home/application/create/2",
    },
    {
      title: "Davlat va jamoat ehtiyojlari",
      icon: <TypesOfEntity3 />,
      number: "325",
      link: "/home/application/create/3",
    },
    {
      title: "Davlat va jamoat ehtiyojlari",
      icon: <TypesOfEntity4 />,
      number: "325",
      link: "/home/application/create/1",
    },
  ]

  return (
    <Card style={{ marginBottom: "20px" }} title="Yer uchastkalari turlari">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {data.map((el, ind) => (
          <div
            key={ind}
            style={{
              flex: "0.25",
              border: "1px solid rgba(0, 0, 0, 0.1)",
              borderRadius: "12px",
              padding: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              marginRight: "20px",
            }}
            class="margin last: 0"
          >
            <div
              style={{ width: "100%", display: "flex", flexDirection: "row" }}
            >
              {el.icon}
              <div
                style={{
                  marginLeft: "20px",
                  maxWidth: "140px",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <p
                  style={{
                    marginBottom: "12px",
                    fontSize: "16px",
                    lineHeight: "24px",
                  }}
                >
                  {el.title}
                </p>
                <h2
                  style={{
                    fontWeight: " 600",
                    fontSize: "18px",
                    lineHeight: "22px",
                  }}
                >
                  {el.number}
                </h2>
              </div>
            </div>
            <button
              style={{
                minWidth: "100%",
                height: "36px",
                background: "#47D16C",
                borderRadius: "8px",
                marginTop: "16px",
                color: "#fff",
              }}
              onClick={() => history.push(el.link)}
            >
              + Qo'shish
            </button>
          </div>
        ))}
      </div>
    </Card>
  )
}

export default TypesOfEntity
