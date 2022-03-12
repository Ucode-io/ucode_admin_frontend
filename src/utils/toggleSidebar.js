var delta = 500;
var lastKeypressTime = 0;
var lastPressed;

function keyHandler(event, cb) {
  if (event.key == "t") {
    lastPressed = "t";
    var thisKeypressTime = new Date();
    if (thisKeypressTime - lastKeypressTime <= delta) {
      // cb();
      // optional - if we'd rather not detect a triple-press
      // as a second double-press, reset the timestamp
      thisKeypressTime = 0;
    }
    lastKeypressTime = thisKeypressTime;
  } else if (event.key == "Alt") {
    lastPressed == "t" && cb();
  }
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
