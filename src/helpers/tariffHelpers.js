export const colors = [
  "bg-blue-100",
  "bg-blue-100",
  "bg-blue-100",
  "bg-blue-100",
  "bg-red-100",
  "bg-red-100",
  "bg-green-100",
  "bg-green-100",
  "bg-green-100",
  "bg-green-100",
  "bg-purple-100",
  "bg-purple-100",
  "bg-purple-100",
  "bg-purple-100",
  "bg-yellow-100",
  "bg-yellow-100",
  "bg-yellow-100",
  "bg-yellow-100",
  "bg-teal-100",
  "bg-teal-100",
  "bg-teal-100",
  "bg-teal-100",
  "bg-red-200",
  "bg-red-200",
]

export const tariffTimers = (arr) => {
  const newTimers = []
  const timers = ["time", 0, 24, 48, 72, 96, 120, 144]
  Array(24)
    .fill()
    .map((_, j) => {
      timers.map((val) => {
        if (val === "time") {
          newTimers.push([`${j}:00`])
        } else {
          newTimers[j].push(arr && Array.isArray(arr) ? arr[j + val] : arr)
        }
      })
    })
  return newTimers
}
