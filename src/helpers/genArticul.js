export default function genArticul(length) {
  length = 3;
  const result = [];
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result.push(
      characters.charAt(Math.floor(Math.random() * charactersLength)),
    );
  }
  const letters = result.join("");
  const numbers = Math.floor(Math.random() * 90000) + 10000;

  return `${letters}-${numbers}`;
}
