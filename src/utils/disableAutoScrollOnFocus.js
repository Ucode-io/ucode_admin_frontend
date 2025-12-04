export const disableAutoScrollOnFocus = () => {
  document.addEventListener(
    "focus",
    (e) => {
      if (e.target instanceof HTMLElement) {
        e.target.scrollIntoView({ block: "nearest", inline: "nearest" });
      }
    },
    true // capture
  );
};