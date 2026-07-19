import { initializeApp } from "firebase/app";
// @ts-ignore
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
const firebaseConfig = {

  apiKey: "AIzaSyCqtXGSSLF-dJ-8C7GZbNTUKJFHo4u2dO4",
  authDomain: "salonpro-73b13.firebaseapp.com",
  projectId: "salonpro-73b13",
  storageBucket: "salonpro-73b13.firebasestorage.app",
  messagingSenderId: "1032013273496",
  appId: "1:1032013273496:web:3c963680ae7bba1de473ed",
};

const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
const db = getFirestore(app);

export { app, auth, db };