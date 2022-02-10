export default function hundredsDivider(num, sep = " ") {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, sep);
}
