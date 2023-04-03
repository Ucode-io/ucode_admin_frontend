// import { notification } from "antd"

import { store } from "../../store";

let webSocket;

function connectSocket(sendMessage, chat_id) {
  const authStore = store.getState().auth;

  const ws = new WebSocket(
    `wss://test.chat.u-code.io/ws/${chat_id}/${authStore.userId}?sender_name=Moxrbe`
  );
  // ws.addEventListener('open', function (event) {
  //   const message = {
  //     name: 'John',
  //     message: 'Hello, World!'
  //   };

  //   // Отправить сообщение в теле запроса
  //   ws.send(JSON.stringify(message));
  // });

  ws.onopen = function () {
    // notification.info({
    //   message: i18nRender('connected.to.websocket')
    // })
    // subscribe to some channels
    console.log("Connected");
    const message = {
      user_id: authStore.userId,
      message: sendMessage || "",
    };
    // ws.send("we have been connected to the web-socket :)");
    // ws.send("Hello, world!", {

    // });
    // ws.send(JSON.stringify(message));
  };

  // ws.onmessage = function (e) {
  //   console.log(e)
  //   try {
  //     console.log('MESSAGE: ', JSON.parse(e.data))
  //   } catch (e) {}
  // }

  ws.onclose = function (e) {
    console.log(`Socket is closed.`, e.reason);
    connectSocket();
  };

  ws.onerror = function (err) {
    console.error("Socket encountered error: ", err.message, "Closing socket");
    ws.close();
  };

  webSocket = ws;
}

export { webSocket, connectSocket };
