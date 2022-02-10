import moment from "moment";

export default function orderTimer(created_at, finished_at) {
  let start = moment(created_at);
  let end = moment(finished_at || undefined);
  let diff = end.diff(start);

  return moment.utc(diff).format("HH:mm");
}
