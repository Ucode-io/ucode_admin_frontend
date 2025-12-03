export default function formatPhone(val) {
  if (!val || typeof val !== "string") return "";
  const digits = val.replace(/\D/g, "").slice(0, 9);
  const parts = [
    digits.slice(0, 2),
    digits.slice(2, 5),
    digits.slice(5, 7),
    digits.slice(7, 9),
  ];
  return `(${parts[0]}) ${parts[1]}-${parts[2]}-${parts[3]}`;
}
