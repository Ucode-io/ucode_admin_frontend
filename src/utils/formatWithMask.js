export function formatWithMask(value, mask) {
  if (!value || typeof value !== "string") return "";

  const isNegative = value.startsWith("-");

  const digits = value.replace(/\D/g, "");

  let result = "";
  let digitIndex = 0;

  for (let i = 0; i < mask.length; i++) {
    if (mask[i] === "#") {
      if (digitIndex < digits.length) {
        result += digits[digitIndex];
        digitIndex++;
      }
    } else {
      if (digitIndex < digits.length) {
        result += mask[i];
      }
    }
  }

  const formatted = result.trim();
  return isNegative ? `-${formatted}` : formatted;
}
