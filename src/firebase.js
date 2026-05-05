import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCriXApg5D5PzPj_vct8HRJxx2RE6D8nkI",
  authDomain: "boi-er-jogot.firebaseapp.com",
  projectId: "boi-er-jogot",
  storageBucket: "boi-er-jogot.firebasestorage.app",
  messagingSenderId: "700520728742",
  appId: "1:700520728742:web:93aeaa181ef2a77bbe8c67"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);