import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBAC9W61Rsq4e0XAEjxgA75BCleXEOLJGA",
  authDomain: "whatsapp-8e5ad.firebaseapp.com",
  projectId: "whatsapp-8e5ad",
  storageBucket: "whatsapp-8e5ad.appspot.com",
  messagingSenderId: "836156745729",
  appId: "1:836156745729:web:c581f4b42684067ba3f800",
  measurementId: "G-H6CK0S69XF"
};

const app = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(app)