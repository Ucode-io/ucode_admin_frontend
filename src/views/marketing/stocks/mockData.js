
export const getData = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(data)
    }, 1500)
  })
}

export const data = [
  {
    count:2,
    data : [
      {
        id: 1,
        name: "Vulputate velit lacus, enim viverra quis.",
        start: "10.06.2021",
        end: "01.09.2021",
        status: true
      },
      {
        id: 2,
        name: "Vulputate velit lacus, enim viverra quis.",
        start: "10.06.2021",
        end: "01.09.2021",
        status: true
      }
    ]
  },
]