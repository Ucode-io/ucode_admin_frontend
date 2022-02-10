export const getData = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({
        count: 2,
        data: [
          {
            image:
              "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg",
            restaurant_name: "Баннер 1",
            stock: "Ресторан",
            status: true,
            id: "asdasdasdasdas",
          },
          {
            image:
              "https://cdn.arstechnica.net/wp-content/uploads/2016/02/5718897981_10faa45ac3_b-640x624.jpg",
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
