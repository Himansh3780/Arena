// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCBeLkcCws6IRTIUztKMDCQztK8-os1pZM",
  authDomain: "ludo-7753c.firebaseapp.com",
  projectId: "ludo-7753c",
  storageBucket: "ludo-7753c.firebasestorage.app",
  messagingSenderId: "780949213750",
  appId: "1:780949213750:web:c54afff4efd44948163e97",
  measurementId: "G-SCSFRTD857"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Export 'auth' so index.html can use it
export { auth };
