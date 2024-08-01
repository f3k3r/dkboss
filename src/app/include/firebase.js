import { initializeApp } from "firebase/app";
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyAzT90G1V1XwTaIUGZ6j-fULYZcj4WKSnc",
  authDomain: "union-b4fa0.firebaseapp.com",
  databaseURL: "https://union-b4fa0-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "union-b4fa0",
  storageBucket: "union-b4fa0.appspot.com",
  messagingSenderId: "875280196203",
  appId: "1:875280196203:web:78429920df01a556f4072e",
};
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db };