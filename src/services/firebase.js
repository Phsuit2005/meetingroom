import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCpUTehs0fwuH33xwruEz2qbe7MwBZC-N0",
  authDomain: "meetingroom0073-0081.firebaseapp.com",
  databaseURL: "https://meetingroom0073-0081-default-rtdb.firebaseio.com/",
  projectId: "meetingroom0073-0081",
  storageBucket: "meetingroom0073-0081.firebasestorage.app",
  messagingSenderId: "75732541465",
  appId: "1:75732541465:web:141efec7cd8251531d4a88"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getDatabase(app);