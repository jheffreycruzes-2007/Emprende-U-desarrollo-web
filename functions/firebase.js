import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyCb3RhQVcLlAZIwtGGzAtT1oxRnt2DxI_k",
    authDomain: "emprende-u-7c02a.firebaseapp.com",
    projectId: "emprende-u-7c02a",
    storageBucket: "emprende-u-7c02a.firebasestorage.app",
    messagingSenderId: "281602682397",
    appId: "1:281602682397:web:4f5dab160f543f003e60f4"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export {
    app,
    db,
    auth
};