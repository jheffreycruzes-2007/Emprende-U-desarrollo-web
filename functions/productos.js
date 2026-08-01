import { db, auth } from "./firebase.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

import {
    collection,
    addDoc,
    onSnapshot,
    query,
    orderBy,
    deleteDoc,
    doc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

let idEditando = null;
let imagenActual = "";

function convertirImagenABase64(archivo, maxWidth = 800, calidad = 0.7) {
    return new Promise((resolve, reject) => {
        const lector = new FileReader();
        lector.onload = () => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");
                let width = img.width;
                let height = img.height;
                if (width > maxWidth) {

                    height = Math.round((height * maxWidth) / width);
                    width = maxWidth;
                }

                canvas.width = width;
                canvas.height = height;
                ctx.drawImage(img, 0, 0, width, height);
                resolve(canvas.toDataURL("image/jpeg", calidad));
            };
            img.src = lector.result;
        };
        lector.onerror = reject;
        lector.readAsDataURL(archivo);
    });
}

async function guardarProducto() {

    const nombre = document.getElementById("nombreProducto").value.trim();
    const precio = document.getElementById("precioProducto").value.trim();
    const categoria = document.getElementById("categoriaProducto").value;
    const descripcion = document.getElementById("descripcionProducto").value.trim();
    const whatsapp = document.getElementById("whatsappProducto").value.trim();

    const archivoImagen = document.getElementById("imagenProducto").files[0];

    if (!nombre || !precio || !categoria || !descripcion || !whatsapp) {

        alert("Complete todos los campos.");
        return;
    }

    try {
        let imagen = imagenActual;
        if (archivoImagen) {
            imagen = await convertirImagenABase64(archivoImagen);
        }

        const datos = {

            uid: auth.currentUser.uid,
            correo: auth.currentUser.email,

            nombre: nombre,
            precio: Number(precio),
            categoria: categoria,
            descripcion: descripcion,
            whatsapp: whatsapp,
            imagen: imagen,
            fecha: Date.now()
        };

        if (idEditando === null) {
            if (!archivoImagen) {
                alert("Seleccione una imagen.");
                return;
            }

            await addDoc(collection(db, "productos"), datos);
            alert("Producto agregado correctamente.");

        } else {
            await updateDoc(doc(db, "productos", idEditando), datos);
            alert("Producto actualizado correctamente.");
            idEditando = null;
            imagenActual = "";
            document.getElementById("btnGuardar").textContent = "Guardar producto";
        }

        document.getElementById("formProducto").reset();
    } catch (error) {
        console.error(error);
        alert("Ocurrió un error.");
    }

}

async function eliminarProducto(id) {
    const confirmar = confirm("¿Seguro que deseas eliminar este producto?");
    if (!confirmar) return;

    try {
        await deleteDoc(doc(db, "productos", id));
        alert("Producto eliminado correctamente.");

    } catch (error) {
        console.error(error);
        alert("No se pudo eliminar el producto.");
    }

}

function editarProducto(id, producto) {
    if (producto.uid !== auth.currentUser.uid) {
    alert("No puedes editar este producto.");
    return;
}

    idEditando = id;
    imagenActual = producto.imagen;

    document.getElementById("nombreProducto").value = producto.nombre;
    document.getElementById("precioProducto").value = producto.precio;
    document.getElementById("categoriaProducto").value = producto.categoria;
    document.getElementById("descripcionProducto").value = producto.descripcion;
    document.getElementById("whatsappProducto").value = producto.whatsapp;

    document.getElementById("btnGuardar").textContent = "Actualizar producto";

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}

function cargarProductos() {
    const lista = document.getElementById("listaProductos");
    if (!lista) return;
    const consulta = query(
        collection(db, "productos"),
        orderBy("fecha", "desc")
    );

    onSnapshot(consulta, (snapshot) => {
        lista.innerHTML = "";
        if (!auth.currentUser) {
            lista.innerHTML = `
                <p class="text-center">
                    Inicie sesión nuevamente.
                </p>
            `;
            return;
        }

        if (snapshot.empty) {
            lista.innerHTML = `
                <p class="text-center">
                    No hay productos registrados.
                </p>
            `;
            return;
        }

        snapshot.forEach((documento) => {
            const producto = documento.data();
            if (producto.uid !== auth.currentUser.uid) {
                return;
            }

            const card = document.createElement("div");
            card.className = "card mb-3 shadow-sm";

            card.innerHTML = `
                <div class="row g-0 align-items-center">

                    <div class="col-md-3">

                        <img
                            src="${producto.imagen}"
                            class="img-fluid rounded-start"
                            alt="${producto.nombre}">

                    </div>

                    <div class="col-md-9">

                        <div class="card-body">

                            <h5 class="card-title">
                                ${producto.nombre}
                            </h5>

                            <p class="card-text mb-1">
                                <strong>Precio:</strong>
                                $${producto.precio}
                            </p>

                            <p class="card-text mb-1">
                                <strong>Categoría:</strong>
                                ${producto.categoria}
                            </p>

                            <p class="card-text mb-1">
                                <strong>WhatsApp:</strong>
                                ${producto.whatsapp}
                            </p>

                            <p class="card-text">
                                ${producto.descripcion}
                            </p>

                            <div class="mt-3">

                                <button
                                    class="btn btn-warning btn-sm me-2 editar">
                                    Editar
                                </button>

                                <button
                                    class="btn btn-danger btn-sm eliminar">
                                    Eliminar
                                </button>

                            </div>

                        </div>

                    </div>

                </div>
            `;

            card.querySelector(".editar").addEventListener("click", () => {
                editarProducto(documento.id, producto);
            });

            card.querySelector(".eliminar").addEventListener("click", () => {
                eliminarProducto(documento.id, producto);
            });

            lista.appendChild(card);

        });

    });

}

const botonGuardar = document.getElementById("btnGuardar");
if (botonGuardar) {
    botonGuardar.addEventListener("click", guardarProducto);
}

cargarProductos();
const btnCerrarSesion = document.getElementById("btnCerrarSesion");
if (btnCerrarSesion) {
    btnCerrarSesion.addEventListener("click", async () => {

        try {
            await signOut(auth);
            alert("Sesión cerrada correctamente.");
            window.location.href = "login.html";

        } catch (error) {
            console.error(error);
            alert("Error al cerrar sesión.");
        }
    });
}