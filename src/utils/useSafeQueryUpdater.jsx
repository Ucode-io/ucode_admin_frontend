export const updateQueryWithoutRerender = (key, value) => {
  const currentUrl = new URL(window.location.href);
  console.log("keykeykeykey", key, value);

  console.log("current", currentUrl);
  const searchParams = currentUrl.searchParams;

  if (value === undefined || value === null) {
    searchParams.delete(key);
  } else {
    searchParams.set(key, value);
  }

  window.history.replaceState(
    null,
    "",
    `${currentUrl.pathname}?${searchParams.toString()}`
  );
};
