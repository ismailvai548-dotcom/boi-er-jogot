import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCrIxApg5D5PzPj_vct8HRJxX2RE6D8nkI",
  authDomain: "boi-er-jogot.firebaseapp.com",
  projectId: "boi-er-jogot",
  storageBucket: "boi-er-jogot.firebasestorage.app",
  messagingSenderId: "700520728742",
  appId: "1:700520728742:web:93aeaa181ef2a77bbe8c67",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);