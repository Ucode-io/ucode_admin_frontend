export default function numberToPrice(number, currency = "сум", sep = " ") {
  return `${number
    ?.toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, sep)} ${currency}`
}
