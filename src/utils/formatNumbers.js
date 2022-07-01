
export const numberWithSpaces = (x) => {
  if(isNaN(Number(x))) return 0

  var parts = x.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return parts.join(".");
}
