export default function parseQuery(_query) {
  const url = new URL(
    window.location.origin + window.location.hash.substring(1)
  );
  let query = _query || url.search;
  if (!query) return {};
  var search = query.substring(1);
  return JSON.parse(
    '{"' +
      decodeURI(search)
        .replace(/"/g, '\\"')
        .replace(/&/g, '","')
        .replace(/=/g, '":"') +
      '"}'
  );
}
