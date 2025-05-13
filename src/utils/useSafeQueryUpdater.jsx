export const updateQueryWithoutRerender = (key, value) => {
  const currentUrl = new URL(window.location.href);

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
