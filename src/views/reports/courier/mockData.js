export const getData = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({
        count: 1,
        data: [
          {
            fullName: "Абдулла Хидоятов",
            id: "asdasdasdasdas",
            order_id: "132142",
            order_time: "25,4 мин",
            order_count: "25",
            income: "250 000 сум",
            km: "87км",
            rate: "4,7",
            work_hour: "8ч 25мин",
            cancel_order: "4",
          },
        ],
      })
    }, 1000)
  })
}
