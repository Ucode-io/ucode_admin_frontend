export function formatWithMask(value, mask) {

  if(!value || typeof value !== "string") return;

  const digits = value.replace(/\D/g, "");
  let result = "";
  let digitIndex = 0;

  for (let i = 0; i < mask.length; i++) {
    if (mask[i] === "#") {
      if (digitIndex < digits.length) {
        result += digits[digitIndex];
        digitIndex++;
      } else {
        result += "";
      }
    } else {
      result += mask[i];
    }
  }

  return result.trim();
}
