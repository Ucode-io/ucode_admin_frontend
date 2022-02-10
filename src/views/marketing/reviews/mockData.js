export const getData = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({
        count: 2,
        data: [
          {
            client_id: "Баннер 1",
            id: "asdasdasdasdas",
            name: "Алиса Морозова",
            restaurant: "Safia",
            comment: "не самый лучший курьер",
            raiting: 3.5
          },
          {
            client_id: "Баннер 1",
            id: "dsafsdfse",
            name: "Алиса Морозова",
            restaurant: "Safia",
            comment: "не самый лучший курьер",
            raiting: 1.5
          },
          {
            client_id: "Баннер 1",
            id: "fewefwefew",
            name: "Алиса Морозова",
            restaurant: "Safia",
            comment: "не самый лучший курьер",
            raiting: 5
          },
        ],
      })
    }, 1000)
  })
}
