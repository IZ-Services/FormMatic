/* eslint-disable @typescript-eslint/no-unused-vars */
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBih8kZRdCZFmYY_wwR4L0dssUjB1O0jnU",
  authDomain: "formatic-28666.firebaseapp.com",
  projectId: "formatic-28666",
  storageBucket: "formatic-28666.appspot.com",
  messagingSenderId: "578096624618",
  appId: "1:578096624618:web:0cf99b8871a12405ef3893",
  measurementId: "G-B0MS0S3F1V"
};


// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
