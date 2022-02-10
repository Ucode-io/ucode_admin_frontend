import { stackMessages } from "./stackMessages";
import { store } from "../redux/store";

function connectSocket() {
  var token = store.getState().auth.accessToken;
  var ws = new WebSocket(
    `${process.env.REACT_APP_WEBSOCKET_URL}?token=` + token
  );

  ws.onopen = function () {
    console.log("Connected to the websocket");
    ws.send("we have been connected to the web-socket :)");
  };

  ws.onmessage = function (mes) {
    try {
      var data = JSON.parse(mes.data);
      stackMessages.add(data);
    } catch (err) {
      // console.log(err);
    }
  };

  ws.onclose = function (e) {
    console.log(`Socket is closed.`, e.reason);
    connectSocket();
  };

  ws.onerror = function (err) {
    console.error("Socket encountered error: ", err.message, "Closing socket");
    ws.close();
  };

  return ws;
}

export { connectSocket };
