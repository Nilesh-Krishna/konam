// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAGu-iruaaM7g9K0m8fMX4lr33TnfqNxEo",
  authDomain: "konamarchi.firebaseapp.com",
  projectId: "konamarchi",
  storageBucket: "konamarchi.firebasestorage.app",
  messagingSenderId: "562990635889",
  appId: "1:562990635889:web:426462e9b2babea188b4d0",
  measurementId: "G-K902NNER9P",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const analytics = getAnalytics(app);
const database = getDatabase(app);
const storage = getStorage(app);

export { app, analytics, database, storage };
