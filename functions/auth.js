import { app } from "./firebase.js";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

import {
    getFirestore,
    doc,
    setDoc
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

const auth = getAuth(app);
const db = getFirestore(app);

const btnRegistro = document.getElementById("btnRegistro");
if (btnRegistro) {
    btnRegistro.addEventListener("click", registrar);
}

async function registrar() {
    const nombre = document.getElementById("nombre").value;
    const correo = document.getElementById("correo").value;
    const password = document.getElementById("password").value;
    const confirmar = document.getElementById("confirmar").value;
    if (
        nombre == "" ||
        correo == "" ||
        password == "" ||
        confirmar == ""
    ) {
        alert("Complete todos los campos.");
        return;
    }
    if (password != confirmar) {

        alert("Las contraseñas no coinciden.");
        return;
    }
    try {
        const usuario = await createUserWithEmailAndPassword(
            auth,
            correo,
            password
        );

        await setDoc(doc(db, "usuarios", usuario.user.uid), {
            nombre: nombre,
            correo: correo
        });
        alert("Usuario registrado correctamente.");
        window.location = "login.html";
    } catch (error) {
        alert(error.message);
    }
}

const btnLogin = document.getElementById("btnLogin");
if (btnLogin) {
    btnLogin.addEventListener("click", iniciarSesion);
}

async function iniciarSesion() {
    const correo = document.getElementById("correo").value;
    const password = document.getElementById("password").value;
    try {

        await signInWithEmailAndPassword(
            auth,
            correo,
            password
        );

        alert("Bienvenido.");
        window.location = "panel.html";
    }
    catch (error) {
        alert("Correo o contraseña incorrectos.");
    }
}