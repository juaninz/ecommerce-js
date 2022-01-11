import {
    productos
} from "./productos.js";


class ItemCarrito {
    constructor(cantidad, item) {
        this.cantidad = cantidad
        this.item = item
    }
}

let total = 0
let carrito = JSON.parse(localStorage.getItem('carrito')) || []

for (const producto of productos) {
    let count = 1
    $('#items').append(
        `
        <div class="card-body">
            <h5 class="card-title">${ producto.nombre}</h5>
            <div class="product-card">
            <img class="img-fluid" src="${producto.imagen}">
            <p class="card-text">$ ${producto.precio}<p>
            <div class="card-title agregar-producto">

            Cantidad:
            <select id="select-count-${producto.id}">
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
            </select>
            <button id="btn-add-${producto.id}" class="btn btn-primary addProduct"> Agregar </button>
            </div>
            </div>
        </div>
        `
    )



    //Acceder al select de cantidad para cada producto
    $(`#select-count-${producto.id}`).change((event) => {
        count = +event.target.value
    })

    //acceder evento agregar producto
    $(`#btn-add-${producto.id}`).on('click', () => {
        const itemCarrito = new ItemCarrito(count, producto)
        addItemCarrito(itemCarrito)
    })
}

const addItemCarrito = (item) => {
    const itemCarrito = carrito.find(el => el.item.id === item['item']['id'])
    if (!itemCarrito) {
        carrito.push(item)
        console.log(carrito)

    } else {
        itemCarrito['cantidad'] = item.cantidad
        console.log(carrito)
    }

    localStorage.setItem('carrito', JSON.stringify(carrito))

    renderCarrito()

}

const renderCarrito = () => {

    $('#generable-carrito').empty()
    $('#generable-carrito').append(
        `
            <h2> Carrito </h2>
        `
    )
    for (let el of carrito) {

        $('#generable-carrito').append(
            `
                <li class='list-group-item text-right mx-2'> ${el.item.nombre} - Cantidad: ${el.cantidad} <button id="quitar-${el.item.id}"  class="btn btn-danger"> Quitar </button></li>
                
            `
        )
        $(`#quitar-${el.item.id}`).on('click', () => {
            carrito = carrito.filter((itemCarrito) => {
                let carritoSinItem = itemCarrito.item.id !== el.item.id;
                return carritoSinItem
            })
            localStorage.setItem('carrito', JSON.stringify(carrito))
            renderCarrito()
        })
    }
    //Le agrego para que se actualice el total también
    calcularTotal();
}

renderCarrito()

//CALCULAR TOTAL DE MIS PRODUCTOS
function calcularTotal() {
    // Limpiamos precio anterior
    total = 0;
    // Recorremos el array del carrito
    carrito.forEach((item) => {
        // De cada elemento obtenemos su precio
        console.log(item);
        total = total + item.item.precio * item.cantidad; // Sumo el precio al total

    });
    // Renderizamos el precio en el HTML
    // Hago el append directamente en la sección carrito
    $('#generable-carrito').append(
        `   
            <p class="total">Total:$ <span id="total">${total.toFixed(2)}</span></p>
            
        `
    ) // Uso directamente lo que quiero que se agregue (Lo saqué del html)
}

//agrego funcion vaciar carrito y el evento del boton vaciar

function vaciarCarrito() {
    // Limpiamos los Productos guardados
    carrito = [];
    localStorage.clear();
    // Renderizamos los cambios
    renderCarrito();
}


$(`#boton-vaciar`).on('click', () => {
    vaciarCarrito()
    $("#generable-carrito").append('<p id="mensaje">Carrito vaciado!</p>');
    $("#mensaje").css("color", "red")
        .slideDown(5000)
        .slideUp(3000);
    $(".total").hide()
})

$(`#boton-comprar`).on('click', () => {
    vaciarCarrito()
    $("#generable-carrito").append('<p id="mensaje">Compra Realizada!</p>');
    $("#mensaje").css("color", "green")
        .slideDown(5000)
        .slideUp(3000);
    $(".total").hide()
})

$("#generable-carrito").hide();
$("#boton-vaciar").hide();
$("#boton-comprar").hide();
$(".addProduct").click(() => {
    $("#generable-carrito").slideDown("fast");
    $("#boton-vaciar").slideDown("fast");
    $("#boton-comprar").slideDown("fast");
});

