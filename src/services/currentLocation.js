import axios from 'axios'

export const onClickMap = (setAddress, data) => {
  axios({
    method: 'get',
    url: process.env.YANDEX_API_URL,
    params: {
      format: 'json',
      apikey: "3c8cad2d-8795-4a48-8f42-a279792c0e0e",
      geocode: data.longitude + ',' + data.latitude,
      lang: 'ru-RU',
      results: 3,
    },
  }).then((body) => {
    var tempAddress =
      body.data.response.GeoObjectCollection.featureMember[0].GeoObject
        .metaDataProperty.GeocoderMetaData.Address.Components
    let addressName = ''
    tempAddress.map((address, i) => {
      if (i !== 2) {
        addressName += address.name + ', '
      }
    })
    setAddress(addressName)
  })
}