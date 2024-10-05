import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyC24aZ6UvcVocFon03Hab1I-rBM-UkZ3Mc",
  authDomain: "ead-vendora-30b06.firebaseapp.com",
  projectId: "ead-vendora-30b06",
  storageBucket: "ead-vendora-30b06.appspot.com",
  messagingSenderId: "348249324749",
  appId: "1:348249324749:web:1edc4cfc0f672dbbb5bd84",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Storage
const storage = getStorage(app);

export { storage };