var lastKeypressTime = 0;
var delta = 500;
var lastPressed;

function isValid(key) {
  if (key !== "Alt" || key !== "t" || lastPressed !== "Alt" || key !== "t")
    return false;
  var now = new Date();
  if (now - lastKeypressTime <= delta) {
    lastKeypressTime = now;
    return false;
  }
  return true;
}

function keyHandler(e, cb) {
  if (isValid(e.key)) {
    cb();
  }
  lastPressed = e.key === "t" || e.key === "Alt" ? e.key : null;
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
