let carrito = [];
function agregarProducto(nombre, precio) {
    let producto = carrito.find(p => p.nombre === nombre);
    if (producto) {
        producto.cantidad++;
    } else {
        carrito.push({
            nombre: nombre,
            precio: precio,
            cantidad: 1
        });
    }
    actualizarCarrito();
}
function eliminarProducto(indice) {
    carrito.splice(indice, 1);
    actualizarCarrito();
}
function vaciarCarrito() {
    carrito = [];
    actualizarCarrito();
}

function actualizarCarrito() {
    const contenedor = document.getElementById("carrito");
    if (!contenedor) return;
    contenedor.innerHTML = "";
    let total = 0;
    carrito.forEach((producto, indice) => {
        let subtotal = producto.precio * producto.cantidad;
        total += subtotal;
        contenedor.innerHTML += `
            <div class="card p-3 mb-3">
                <h5>${producto.nombre}</h5>

                <p>Precio: $${producto.precio}</p>

                <p>Cantidad: ${producto.cantidad}</p>

                <p>Subtotal: $${subtotal}</p>

                <button class="btn btn-danger"
                    onclick="eliminarProducto(${indice})">
                    Eliminar
                </button>
            </div>
        `;
    });
    contenedor.innerHTML += `
        <h3 class="mt-3">Total: $${total}</h3>
    `;
}