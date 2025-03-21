export const parseHTMLToText = (html) => {

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const cleanedText = doc.body.textContent;

  return cleanedText
};
