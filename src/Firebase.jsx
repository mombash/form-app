import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBRSS7OEyHuC9vRz_cp10hRWOK0hOEH8qA",
  authDomain: "form-app-4166a.firebaseapp.com",
  projectId: "form-app-4166a",
  storageBucket: "form-app-4166a.appspot.com",
  messagingSenderId: "397821847692",
  appId: "1:397821847692:web:9692dc97469e9ed1b573a9",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };
