// Función para cargar el archivo JSON
async function leerProductos() {
  try {
    const response = await fetch("js/productos.json");
    if (!response.ok) {
      throw new Error("Error al cargar el archivo JSON");
    }
    const data = await response.json();
    productos = data.productos;
  } catch (error) {
    console.error("Error:", error);
  }
}

const contenedorProductos = document.querySelector("#contenedor-productos");
const botonesCategoria = document.querySelectorAll(".boton-categoria");
const tituloPagina = document.querySelector("#titulo-principal");
let botonesAgregar = document.querySelectorAll(".producto-agregar");
const numeritoTexto = document.querySelector("#numerito");
let productosEnCarrito;
const cantidadItems = document.getElementById("carrito-contenido-cantidad");
const totalItems = document.getElementById("carrito-contenido-precio");
const contenidoCarrito = document.getElementById("carrito-contenido");
const btnUserLogin = document.getElementById("btnUserLogin");
const userName = document.getElementById("user-name");
const modalForm = document.getElementById("modalForm");
const closeForm = document.getElementById("btnCerrarForm");
const btnLogin = document.getElementById("btnLogin");
const loginName = document.getElementById("user");
const loginpass = document.getElementById("pass");
let user = {};

// Funcion para cargar productos a la pagina
function cargarProductos(productos) {
  contenedorProductos.innerHTML = "";

  for (let i = 0; i < productos.length; i++) {
    const div = document.createElement("div");
    div.classList.add("producto");
    div.innerHTML = `  
        <img class="producto-imagen" src="${productos[i].imagen}" alt="${productos[i].imagen}" />
        <div class="producto-descripcion">
          <h3 class="producto-titulo">${productos[i].nombre}</h3>
          <p class="producto-precio">${productos[i].precio}</p>
          <button class="producto-agregar" id="${productos[i].id}">Agregar</button>
        </div>
    `;
    contenedorProductos.append(div);
  }
  actualizaBotonesAgregar();
}
// Agrego un listener a cada boton comprar
function actualizaBotonesAgregar() {
  botonesAgregar = document.querySelectorAll(".producto-agregar");
  if (user.name !== undefined) {
    botonesAgregar.forEach((boton) => {
      boton.classList.add("habilitado");
      boton.addEventListener("click", agregarAlCarrito);
    });
  } else {
    botonesAgregar.forEach((boton) => {
      boton.classList.remove("habilitado");
      boton.setAttribute("title", "Debes iniciar sesión para poder comprar");
      boton.removeEventListener("click", agregarAlCarrito);
    });
  }
}

function agregarAlCarrito(e) {
  const botonId = e.currentTarget.id;
  const productoAgregado = productos.find((producto) => producto.id == botonId);
  if (productosEnCarrito.some((producto) => producto.id === productoAgregado.id)) {
    const index = productosEnCarrito.findIndex((producto) => producto.id === productoAgregado.id);
    productosEnCarrito[index].cantidad++;
  } else {
    productoAgregado.cantidad = 1;
    productosEnCarrito.push(productoAgregado);
  }
  actualizarDatosCarrito();

  localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
}

function actualizarDatosCarrito() {
  const items = productosEnCarrito.reduce((total, producto) => total + producto.cantidad, 0);
  const total = productosEnCarrito.reduce((total, producto) => total + producto.precio * producto.cantidad, 0);
  if (items === 0) {
    contenidoCarrito.classList.add("disable");
  } else {
    contenidoCarrito.classList.remove("disable");
  }
  numeritoTexto.innerText = items;
  cantidadItems.innerText = items;
  totalItems.innerText = `$${total}`;
}

function actualizarLogin() {
  if (user.name !== undefined) {
    btnUserLogin.addEventListener("click", logOut);
    userName.innerText = `Bienvenido ${user.name}\nClick to logout`;
  } else {
    modalForm.style.display = "flex";
  }
}

function login(e) {
  e.preventDefault();
  console.log(loginName.value);
  modalForm.style.display = "none";
  user.name = loginName.value;
  user.password = loginpass.value;
  localStorage.setItem("user", JSON.stringify(user));
  actualizarUser();
}
function actualizarUser() {
  if (localStorage.getItem("user")) {
    user = JSON.parse(localStorage.getItem("user"));
    userName.innerText = `Bienvenido ${user.name} \nClick to logout`;
    actualizaBotonesAgregar();
  } else {
    userName.innerText = "Iniciar Sesión";
    actualizaBotonesAgregar();
  }
}
function logOut() {
  user = {};
  localStorage.removeItem("user");
  userName.innerText = "Iniciar Sesión";
  actualizaBotonesAgregar();
}
async function main() {
  await leerProductos();
  cargarProductos(productos);

  // Event listeners para los botones de categoria
  for (let i = 0; i < botonesCategoria.length; i++) {
    botonesCategoria[i].addEventListener("click", (e) => {
      botonesCategoria.forEach((boton) => boton.classList.remove("active"));
      e.currentTarget.classList.add("active");
      if (e.currentTarget.id === "todos") {
        cargarProductos(productos);
        tituloPagina.innerText = "Todos los productos";
      } else {
        const productosCategoria = productos.filter((producto) => producto.categoria.nombre === e.currentTarget.id);
        cargarProductos(productosCategoria);
        tituloPagina.innerText = e.currentTarget.innerText;
      }
    });
  }
  actualizarUser();
  btnLogin.addEventListener("click", login);
  closeForm.addEventListener("click", () => {
    modalForm.style.display = "none";
  });
  btnUserLogin.addEventListener("click", actualizarLogin);

  if (localStorage.getItem("productos-en-carrito")) {
    productosEnCarrito = JSON.parse(localStorage.getItem("productos-en-carrito"));
    actualizarDatosCarrito();
  } else {
    productosEnCarrito = [];
  }
}

main();
