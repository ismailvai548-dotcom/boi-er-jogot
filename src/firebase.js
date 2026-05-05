// firebase.js ফাইল

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"; // <--- এই লাইনটি যুক্ত করতে হবে

const firebaseConfig = {
  apiKey: "আপনার_এপিআই_কি",
  authDomain: "আপনার_প্রোজেক্ট.firebaseapp.com",
  projectId: "আপনার_প্রোজেক্ট_আইডি",
  storageBucket: "আপনার_প্রোজেক্ট.appspot.com",
  messagingSenderId: "...",
  appId: "..."
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export db and auth
export const db = getFirestore(app);
export const auth = getAuth(app); // <--- এই লাইনটি অবশ্যই থাকতে হবে