const productosEnCarrito = JSON.parse(localStorage.getItem("productos-en-carrito"));
const contenedorCarritoProductos = document.querySelector("#carrito-productos");
const contenedorCarritoVacio = document.querySelector("#carrito-vacio");
const contenedorCarritoComprado = document.querySelector("#carrito-comprado");
const contenedorCarritoAcciones = document.querySelector("#carrito-acciones");
const numeritoTexto = document.querySelector("#numerito");
let botonesBorrar = document.querySelectorAll(".carrito-producto-eliminar");
const botonVaciarCarrito = document.querySelector("#carrito-acciones-vaciar");
const botonComprarCarrito = document.querySelector("#carrito-acciones-comprar");
const total = document.querySelector("#carrito-total");

function cargarProductosCarrito(){
    contenedorCarritoProductos.innerHTML="";
    if (productosEnCarrito && productosEnCarrito.length !== 0) {
        contenedorCarritoVacio.classList.add("disable");
        contenedorCarritoComprado.classList.add("disable");
        contenedorCarritoAcciones.classList.remove("disable");
        contenedorCarritoProductos.classList.remove("disable");
        actualizarNumerito();
        productosEnCarrito.forEach((producto) => {
          const div = document.createElement("div");
          div.classList.add("carrito-producto");
          div.innerHTML = `
              <img class="carrito-imagen" src="${producto.imagen}" alt="${producto.titulo}" />
              <div class="carrito-producto-titulo">
                <small>Nombre</small>
                <h3>${producto.titulo}</h3>
              </div>
              <div class="carrito-producto-cantidad">
                <small>Cantidad</small>
                <p>${producto.cantidad}</p>
              </div>
              <div class="carrito-producto-precio">
                <small>Precio</small>
                <p>${producto.precio}</p>
              </div>
              <div class="carrito-producto-subtotal">
                <small>Subtotal</small>
                <p>${producto.cantidad * producto.precio}</p>
              </div>
              <button class="carrito-producto-eliminar" id+="${producto.id}"><i class="bi bi-trash-fill"></i></button>
                 
          `;
          contenedorCarritoProductos.append(div);
      
        });
        const div = document.createElement("div");
      } else {
        contenedorCarritoVacio.classList.remove("disable");
        contenedorCarritoComprado.classList.add("disable");
        contenedorCarritoAcciones.classList.add("disable");
        contenedorCarritoProductos.classList.add("disable");
      }

      actualizaBotonesEliminar();
      actualizarTotal() 
}

cargarProductosCarrito()

function actualizarNumerito() {
    const numerito = productosEnCarrito.reduce((total, producto) => total + producto.cantidad, 0);
    numeritoTexto.innerText = numerito;
  }

  function calcularTotales(){
    productosEnCarrito.reduce((total,producto) => total + (producto.precio * producto.cantidad), 0);
  }

  function actualizaBotonesEliminar() {
    botonesBorrar = document.querySelectorAll(".carrito-producto-eliminar");
    botonesBorrar.forEach((boton) => {
      boton.addEventListener("click", eliminarDelCarrito);
    });
  }

  function eliminarDelCarrito(e) {
    const id = e.currentTarget.id;
    const indice = productosEnCarrito.findIndex(producto => producto.id === id);
    productosEnCarrito.splice(indice, 1);
    cargarProductosCarrito();
    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
  }

  botonVaciarCarrito.addEventListener("click", () => {
    productosEnCarrito.length = 0;
    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
    cargarProductosCarrito();
  })

  botonComprarCarrito.addEventListener("click", () => {
    productosEnCarrito.length = 0;
    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
    cargarProductosCarrito();
    contenedorCarritoVacio.classList.add("disable");
    contenedorCarritoComprado.classList.remove("disable");
    contenedorCarritoAcciones.classList.add("disable");
    contenedorCarritoProductos.classList.add("disable");
    actualizarNumerito() 
  })

  function actualizarTotal() {
    const totalCalculado = productosEnCarrito.reduce((total, producto) => total + (producto.precio * producto.cantidad), 0);
    console.log(totalCalculado);
    total.innerText = `$${totalCalculado}`;
  }
