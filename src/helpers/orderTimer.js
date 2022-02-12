import moment from "moment";

export default function orderTimer(createdAt, finishedAt) {
  var start = moment(createdAt);
  var end = moment(finishedAt || undefined);
  var diff = end.diff(start);

  return moment.utc(diff).format("HH:mm:ss");
}
