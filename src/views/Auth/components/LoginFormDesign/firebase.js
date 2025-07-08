import {initializeApp} from "firebase/app";
import {getAuth} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAI2P6BcpeVdkt7G_xRe3mYiQ4Ek0cU2pM",
  authDomain: "ucode-c166d.firebaseapp.com",
  projectId: "ucode-c166d",
  storageBucket: "ucode-c166d.firebasestorage.app",
  messagingSenderId: "195504606938",
  appId: "1:195504606938:web:1f01f882f66e1b52339fe3",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export default app;
