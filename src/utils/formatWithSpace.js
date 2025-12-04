export default function formatWithSpaces(value) {
  if (value === null || value === undefined || value === "") return "";

  const str = String(value).replace(/\s+/g, "");

  const sign = str.startsWith("-") ? "-" : "";
  const [rawInt, frac] = str.replace(/^-/, "").split(".");

  const intWithSpaces = rawInt.replace(/\B(?=(\d{3})+(?!\d))/g, " ");

  return sign + intWithSpaces + (typeof frac !== "undefined" ? "." + frac : "");
}