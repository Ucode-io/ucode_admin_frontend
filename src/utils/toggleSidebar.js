var lastKeypressTime = 0;
var delta = 500;
var lastPressed;

function isValid(key) {
  if (!(lastPressed == "t" && key == "Alt")) return false;
  var now = new Date();
  if (now - lastKeypressTime <= delta) {
    lastKeypressTime = now;
    return false;
  }
  return true;
}

function keyHandler(event, cb) {
  if (isValid(event.key)) {
    cb();
  }
  lastPressed = event.key;
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
