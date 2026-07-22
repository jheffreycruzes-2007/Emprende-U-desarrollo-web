import { app, storage } from "./firebase.js";
import {
    getFirestore,
    collection,
    addDoc
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

import {
    ref,
    uploadBytes,
    getDownloadURL
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-storage.js";

const db = getFirestore(app);

async function guardarProducto() {

    const nombre = document.getElementById("nombreProducto").value.trim();
    const precio = document.getElementById("precioProducto").value;
    const categoria = document.getElementById("categoriaProducto").value;
    const descripcion = document.getElementById("descripcionProducto").value.trim();
    const whatsapp = document.getElementById("whatsappProducto").value.trim();

    const imagen = document.getElementById("imagenProducto").files[0];

    if (
        nombre === "" ||
        precio === "" ||
        categoria === "" ||
        descripcion === "" ||
        whatsapp === "" ||
        !imagen
    ) {
        alert("Complete todos los campos.");
        return;
    }

    try {
        const nombreImagen = Date.now() + "_" + imagen.name;
        const referencia = ref(storage, "productos/" + nombreImagen);
        await uploadBytes(referencia, imagen);
        const urlImagen = await getDownloadURL(referencia);
        await addDoc(collection(db, "productos"), {

            nombre: nombre,
            precio: Number(precio),
            categoria: categoria,
            descripcion: descripcion,
            whatsapp: whatsapp,
            imagen: urlImagen
        });
        alert("Producto agregado correctamente.");
        document.getElementById("formProducto").reset();
    }
    catch (error) {
        console.log(error);
        alert("Ocurrió un error al guardar el producto.");
    }
}

const boton = document.getElementById("btnGuardar");
if (boton) {
    boton.addEventListener("click", guardarProducto);
}