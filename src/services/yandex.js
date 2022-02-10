import axios from "axios"
import { apikey } from "../constants/mapDefaults"

export const getAddressListYandex = (params) =>
  axios({
    method: "get",
    url: "https://search-maps.yandex.ru/v1/",
    params: {
      ...params,
      type: "biz",
      lang: "ru_RU",
      apikey: "d778c11d-b8d1-4b37-b4f0-13d2e7eaf0ce",
      // spn: "1.5,1.5",
      results: 5,
      // rspn: 1,
    },
  })

// apikey=&text=beru&lang=ru-RU&results=5&ll=69.241320,41.292906&spn=1.5,1.5&
