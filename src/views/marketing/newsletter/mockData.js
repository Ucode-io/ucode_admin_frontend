export const getData = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({
        count: 2,
        data: [
          {
            image: "https://www.closetag.com/images/photo4.jpg",
            restaurant_name: "Баннер 1",
            stock: "Ресторан",
            status: true,
            id: "asdasdasdasdas",
          },
          {
            image:
              "https://ichef.bbci.co.uk/news/999/cpsprodpb/15951/production/_117310488_16.jpg",
            restaurant_name: "Баннер 2",
            stock: "Ресторан",
            status: false,
            id: "asfgdskjl",
          },
        ],
      })
    }, 1000)
  })
}
