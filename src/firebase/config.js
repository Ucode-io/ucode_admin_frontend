import "firebase/messaging";
import firebase from "firebase/app";

const firebaseCloudMessaging = {
  init: async function () {
    if (!firebase.apps.length) {
      firebase.initializeApp({
        apiKey: "AIzaSyCbChpKZaX7oBFs2HFaCtHxtbauJqvl3OE",
        authDomain: "ucode-51d41.firebaseapp.com",
        projectId: "ucode-51d41",
        storageBucket: "ucode-51d41.appspot.com",
        messagingSenderId: "429101898638",
        appId: "1:429101898638:web:5f196846d0290dc6fba2df",
        measurementId: "G-L6SYC6XJVV",
      });

      try {
        const messaging = firebase.messaging();

        const status = await Notification.requestPermission();

        if (status && status === "granted") {
          // if (true) {
          try {
            const fcm_token = await messaging.getToken({
              vapidKey:
                "BDaRdVA0HTBQihO_x1TIZwdfe_W-kD_qSh-ZhBm4dUlhpNpIavBl8a_FRdySAagcPe5chz4FzLYJClA9XihGsMc",
            });
            await navigator.serviceWorker.register("firebase-messaging-sw.js", {
              scope: "firebase-cloud-messaging-push-scope",
            });

            console.log("fcm_token", fcm_token);
            return fcm_token;
          } catch (error) {
            console.log("error in try catch", error);
          }
        }
        return null;
      } catch (error) {
        return null;
      }
    }
  },
};

export { firebaseCloudMessaging };
