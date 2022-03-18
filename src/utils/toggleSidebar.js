var lastKeypressTime = 0;
var delta = 500;
var lastPressed;

var map = new Map([
  ["Control", "b"],
  ["b", "Control"],
]);

function isValid(key) {
  var now = new Date();
  if (now - lastKeypressTime >= delta) {
    lastKeypressTime = now;
    return false;
  }
  if (map.get(lastPressed) !== key) return false;
  return true;
}

function keyHandler(e, cb) {
  if (isValid(e.key)) {
    cb();
  }
  lastPressed = e.key === "b" || e.key === "Control" ? e.key : null;
}

var count = 0;

export default function useToggle(cb) {
  if (!count) {
    window.addEventListener("keyup", function (e) {
      keyHandler(e, cb);
    });
    count += 1;
  }
}
