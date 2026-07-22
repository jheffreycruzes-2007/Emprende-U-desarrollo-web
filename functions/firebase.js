import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-storage.js";

const firebaseConfig = {
    apiKey: "AIzaSyCb3RhQVcLlAZIwtGGzAtT1oxRnt2DxI_k",
    authDomain: "emprende-u-7c02a.firebaseapp.com",
    projectId: "emprende-u-7c02a",
    storageBucket: "emprende-u-7c02a.firebasestorage.app",
    messagingSenderId: "281602682397",
    appId: "1:281602682397:web:4f5dab160f543f003e60f4"
};
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
export { app, storage };