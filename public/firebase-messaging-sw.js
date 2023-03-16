importScripts("https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyCbChpKZaX7oBFs2HFaCtHxtbauJqvl3OE",
  authDomain: "ucode-51d41.firebaseapp.com",
  projectId: "ucode-51d41",
  storageBucket: "ucode-51d41.appspot.com",
  messagingSenderId: "429101898638",
  appId: "1:429101898638:web:5f196846d0290dc6fba2df",
  measurementId: "G-L6SYC6XJVV",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    title: payload.notification.title,
    //icon: './favicon.ico',
    // image: payload.notification.image,
    // data: { url: e.data.order_id },
    // click_action: `https://app.delever.uz/orders/edit/${e.data.order_id}?status_id=986a0d09-7b4d-4ca9-8567-aa1c6d770505`,
    // actions: [{action: "open_url", title: "Read Now"}]
  };
  return self.registration.showNotification(
    notificationTitle,
    notificationOptions
  );
});
