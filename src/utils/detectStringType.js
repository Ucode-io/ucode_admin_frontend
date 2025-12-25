export const detectStringType = (inputString) => {
  if (/^\d+$/.test(inputString)) {
    return "number";
  } else {
    return "string";
  }
};