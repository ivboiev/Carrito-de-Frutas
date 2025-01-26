const { createApp } = Vue;

createApp({
  template: `
    
    <div>
      <!-- Icono de carrito en la esquina derecha -->
      <i class="fa fa-shopping-cart" @click="cambiarEstadoCarrito" style="font-size: 50px; color: black; text-shadow: 2px 2px 4px #000000; position: fixed; top: 20px; right: 20px; cursor: pointer;"></i>
    
      <div id="app">



        <h1>Lista de Productos</h1>
        <ul>             
           <li v-for="product in paginatedFruits" class="product">                    <!-- El Bucle renderiza cada producto usando v-for -->            
          <img :src="product.imagen" :alt="product.fruta" width="100" height="100" /> <!-- Imagen  -->   
            <h2>{{ product.nombre }}</h2>                                            <!--  Nombre -->   
            <p>Precio por kilo: {{ product.precioKg }} €</p>                         <!--   Precio -->   

            <!-- Selector de cantidad -->
            <input type="number" v-model="product.quantity" min="1" :max="5" />
            <button @click="addToCart(product)">Añadir al carrito</button>        <!--  Boton añadir al carrito -->
          </li>
        </ul>


         <!-- Sidebar del carrito -->
      <div v-if="mostrarCarrito" class="sidebar">  <!-- mostrarCarrito es un boolean que usamos en metodo cerrarSidebar() para cerrar Carrito  -->
        <div class="cart-content">

          <!-- Lista de elementos en el carrito -->

          <h2>Carrito de Compras</h2>
          <ul v-if="carrito.length > 0">
            <li v-for="item in carrito" class="cart-item">
              {{ item.nombre }} - Cantidad: {{ item.quantity }} - Total: {{ (item.quantity * item.precioKg).toFixed(2) }} €<br>    <!-- Información del producto -->

                <!-- Botón de eliminar con ícono de basura -->
                <i class="fa fa-trash" @click="removeFromCart(index)" style="font-size: 25px; cursor: pointer;"></i>
            </li>
          </ul>
          <p v-else>El carrito está vacío</p>  <!-- Mensaje cuando el carrito está vacío -->  
          <p v-if="totalPrice > 0">Total del carrito: {{ totalPrice.toFixed(2) }} €</p> <!-- Precio total del carrito -->

          <button @click="cerrarSidebar">Cerrar</button>
        </div>
      </div>
   
      <!-- Controles de paginación -->

      <div class="pagination">
        <button @click="prevPage" :disabled="currentPage === 1">Anterior</button>
        <span>Página {{ currentPage }} de {{ totalPages }}</span>
        <button @click="nextPage" :disabled="currentPage === totalPages">Siguiente</button>
      </div>
  `,

  data() {                 // Cada producto tiene un id, nombre, precio por kilo, imagen y cantidad inicial
    return {
      fruits: [                                                                         
        { id: 1, nombre: "Manzana", precioKg: 3, imagen: "img/apple.webp", quantity: 1 },
        { id: 2, nombre: "Avocado", precioKg: 8, imagen: "img/avocado.webp", quantity: 1 },
        { id: 3, nombre: "Banana", precioKg: 2, imagen: "img/banana.webp", quantity: 1 },
        { id: 4, nombre: "Mora", precioKg: 9, imagen: "img/blackberries.webp", quantity: 1 },
        { id: 5, nombre: "Arándanos", precioKg: 7, imagen: "img/blueberries.webp", quantity: 1 },
        { id: 6, nombre: "Cereza", precioKg: 6, imagen: "img/cherries.webp", quantity: 1 },
        { id: 7, nombre: "Pomelo", precioKg: 2, imagen: "img/grapefruit.webp", quantity: 1 },
        { id: 8, nombre: "Uva", precioKg: 6, imagen: "img/grapes.webp", quantity: 1 },
        { id: 9, nombre: "Kiwi", precioKg: 4, imagen: "img/kiwi.webp", quantity: 1 },
        { id: 10, nombre: "Naranja", precioKg: 2, imagen: "img/orange.webp", quantity: 1 },
        { id: 11, nombre: "Melocón", precioKg: 3, imagen: "img/peach.webp", quantity: 1 },
        { id: 12, nombre: "Pera", precioKg: 2, imagen: "img/pears.webp", quantity: 1 },
        { id: 13, nombre: "Ciruelas", precioKg: 2, imagen: "img/plums.webp", quantity: 1 },
        { id: 14, nombre: "Grandas", precioKg: 7, imagen: "img/pomegranates.webp", quantity: 1 },
        { id: 15, nombre: "Fresa", precioKg: 7, imagen: "img/strawberries.webp", quantity: 1 }

      ],
      carrito: [],    // Lista de productos añadidos al carrito
      currentPage: 1, // Página actual en la paginación
      itemsPerPage: 5,  // Cantidad de productos por página
      mostrarCarrito: false, // Controla la visibilidad del carrito
    };
  },
  computed: {
    totalPages() {   // Calcula el número total de páginas según el tamaño de la lista y los elementos por página
      return Math.ceil(this.fruits.length / this.itemsPerPage);
    },
    paginatedFruits() {   // Calcula los productos que se deben mostrar en la página actual
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.fruits.slice(start, end);
    },
    totalPrice() {  // Calcula el precio total del carrito
      return this.carrito.reduce((sum, item) => sum + item.precioKg * item.quantity, 0);
    },
  },
  methods: {
    nextPage() {  // Navega a la página siguiente
      if (this.currentPage < this.totalPages)
        this.currentPage++;
    },
    prevPage() {  // Navega a la página anterior
      if (this.currentPage > 1)
        this.currentPage--;
    },
    incrementar() { 
      this.valor++;
    },
    descrementar() {
      this.valor--;
    },
    addToCart(product) {  // Añade un producto al carrito
      const existingItem = this.carrito.find((item) => item.id === product.id);  // Verifica si el producto ya está en el carrito
      if (existingItem) {
        existingItem.quantity += product.quantity; // Incrementa la cantidad si ya está en el carrito
      } else {
        this.carrito.push({ ...product, quantity: product.quantity });  // Añade el producto al carrito
      }
      product.quantity = 1; // Reinicia la cantidad seleccionada a 1
    },
    cambiarEstadoCarrito() {
      this.mostrarCarrito = !this.mostrarCarrito; // Abre o cierra el carrito
    },
    cerrarSidebar() {
      this.mostrarCarrito = false; // Cierra el sidebar manualmente
    },
    removeFromCart(index) {
      // Elimina el producto en la posición dada
      this.carrito.splice(index, 1);
    }
  },
}).mount('#app');