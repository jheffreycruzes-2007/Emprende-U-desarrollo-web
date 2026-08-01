import { app } from "./firebase.js";
import {
    getFirestore,
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

const db = getFirestore(app);
let productos = [];
async function cargarProductos() {
    const consulta = await getDocs(collection(db, "productos"));

    productos = [];
    consulta.forEach((producto) => {
        productos.push(producto.data());
    });
    mostrarProductos(productos);
}

function crearTarjeta(datos) {
    const imagen = datos.imagen
        ? datos.imagen
        : "../multimedia/img/icono.png";
    return `
        <div class="col-md-3 mb-4">

            <div class="card h-100 shadow">

                <img
                    src="${imagen}"
                    class="card-img-top"
                    alt="${datos.nombre}">

                <div class="card-body">

                    <h5>${datos.nombre}</h5>

                    <p>${datos.descripcion}</p>

                    <p>
                        <strong>Categoría:</strong>
                        ${datos.categoria}
                    </p>

                    <p>
                        <strong>Precio:</strong>
                        $${datos.precio}
                    </p>

                    <button
                        class="btn btn-success w-100"
                        onclick="agregarProducto('${datos.nombre}', ${datos.precio})">

                        Agregar al carrito

                    </button>

                    <a
                        href="https://wa.me/${datos.whatsapp}?text=Hola,%20vi%20el%20producto%20${encodeURIComponent(datos.nombre)}%20en%20Emprende%20U%20y%20quiero%20comprarlo."
                        target="_blank"
                        class="btn btn-primary w-100 mt-2">

                        Comprar por WhatsApp

                    </a>

                </div>

            </div>

        </div>
    `;
}

function mostrarProductos(lista) {

    const joyas = document.getElementById("productosJoyas");
    const accesorios = document.getElementById("productosAccesorios");

    if (!joyas || !accesorios) return;

    joyas.innerHTML = "";
    accesorios.innerHTML = "";

    if (lista.length === 0) {

        joyas.innerHTML = `
            <div class="col-12">
                <p class="text-center">
                    No se encontraron productos.
                </p>
            </div>
        `;

        return;
    }

    lista.forEach((datos) => {

        const tarjeta = crearTarjeta(datos);

        if (datos.categoria === "Joyas") {
            joyas.innerHTML += tarjeta;

        }

        else if (datos.categoria === "Accesorios") {
            accesorios.innerHTML += tarjeta;
        }

    });

}

window.buscarProductos = function () {
    const texto = document
        .getElementById("buscador")
        .value
        .toLowerCase();
    const filtrados = productos.filter((producto) =>
        producto.nombre.toLowerCase().includes(texto)
    );
    mostrarProductos(filtrados);
};

window.filtrarCategoria = function (categoria) {
    const filtrados = productos.filter((producto) =>
        producto.categoria === categoria
    );
    mostrarProductos(filtrados);
};

window.mostrarTodos = function () {
    mostrarProductos(productos);
};

cargarProductos();