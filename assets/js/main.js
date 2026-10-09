let globalStoreProducts = [];
let cart = [];

const container = document.getElementById("product-container");

container.addEventListener("click", (event) => {
    if (event.target.classList.contains("btn-buy")) {
        const productId = Number(event.target.dataset.id);

        const selectedProduct = globalStoreProducts.find((p) => p.id === productId);
        
        if(selectedProduct) {
            addToCart(selectedProduct);
        }
    }       
});

function addToCart(product) {
    const existingItem = cart.find((item)=> item.id === product.id);

    if(existingItem){
        existingItem.quantity +=1;
    }
    else{
        cart.push({...product, quantity: 1});
    }
    updateUI();// оновлення екрану
}

function calculateTotal() {
    return cart.reduce(
        (total, item) => total+item.price * item.quantity,
        0,
    ); //підрахунок суми
}

function updateUI(){
    const cartCounter = document.querySelector(".cart-counter");
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    if(cartCounter){
        cartCounter.textContent = totalItems;
    }

    renderCartItems(); // Оновлюємо список товарів у кошику
}

async function fetchProducts() {
    try {
        // Надсилаємо мережевий GET-запит
        const response = await fetch(
        "https://fakestoreapi.com/products?limit=8",
        );

        // Перевіряємо чи статус відповіді ОК (200-299)
        if (!response.ok) {
        throw new Error(`HTTP помилка: ${response.status}`);
        }

        // Розпаковуємо тіло відповіді з JSON у звичайний масив JavaScript
        const realProducts = await response.json();

        // console.log("Дані з сервера:", realProducts);

        // Повертаємо масив, щоб ним міг скористатися initShop()
        return realProducts;
    } 

    catch (error) {
        console.error("Помилка завантаження товарів:", error.message);
        // Прокидаємо помилку далі, щоб спінер зник і користувач побачив "Помилка мережі"
        throw error;
    }
}

async function initShop(){
    const loader = document.getElementById("loader");

    loader.classList.remove("hidden");
    container.innerHTML="";//очищення сітки

    try{
        //чекаємо півтори секунди
        const data = await fetchProducts();

        globalStoreProducts = data; //записуємо дані в глобальну змінну
        //спінер хоавається, якщо відповідь від сервера позитивна
        loader.classList.add("hidden");
            //картки товарів
        const htmlString = data
        .map((product) => {
            return `
            <article class="product-card">
                <img src="${product.image}" alt="${product.title}">
                <h3>${product.title}</h3>
                <p class="author"> Категорія: ${product.category}</p>
                <p class="price"> $${product.price.toFixed(2)}</p>
                <button class="btn btn-buy" data-id="${product.id}"> Купити </button>
            </article>
            `;
        }).join("");

        container.innerHTML = htmlString;
    } catch (error){
        //якщо сталася помилка сервера, реджект
        loader.classList.add("hidden");
        container.innerHTML = `<p class="error">Помилка: ${error.message}</p>`;
    }
}

const cartButton = document.querySelector(".btn-cart"); // Ваша кнопка в Header з SVG (ПР №7)
const cartOverlay = document.getElementById("cartOverlay");
const closeBtn = document.getElementById("closeCartBtn");
const cartTotalSum = document.getElementById("cartTotalSum");

// Функція відкриття
function openCartModal() {
  cartOverlay.classList.remove("hidden");
  renderCartItems(); // Оновлюємо список перед тим як показати
}

// Функція закриття
function closeCartModal() {
  cartOverlay.classList.add("hidden");
}

// Вішаємо слухачі
cartButton.addEventListener("click", openCartModal);
closeBtn.addEventListener("click", closeCartModal);

// Закриття кліком по темному фону (оверлею) повз вікно
cartOverlay.addEventListener("click", (event) => {
  if (event.target === cartOverlay) {
    closeCartModal();
  }
});

function renderCartItems() { 
    const cartItemsContainer = document.getElementById("cartItemsContainer");

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `<p class="cart-empty">Кошик порожній</p>`;
        cartTotalSum.textContent = calculateTotal(); // 0
        return;
    }
    cartItemsContainer.innerHTML = ""; // Очищаємо контейнер перед рендером

    cart.forEach((item) =>{
        const cartItem = document.createElement("div");
        cartItem.classList.add("cart-item");
        cartItem.innerHTML = `
             <img src="${item.image}" alt="${item.title}" width="60" height="60">
            <p>${item.title} — $${item.price.toFixed(2)} × ${item.quantity}</p>
            <div class="cart-item-controls">
                <button class="qty-btn" type="button" data-action="decrease" data-id="${item.id}" aria-label="Зменшити кількість: ${item.title}">−</button>
                <span>${item.quantity}</span>
                <button class="qty-btn" type="button" data-action="increase" data-id="${item.id}" aria-label="Збільшити кількість: ${item.title}">+</button>
            </div>
            <p>$${(item.price * item.quantity).toFixed(2)}</p>
        `;
        cartItemsContainer.appendChild(cartItem);
    });

    cartTotalSum.textContent = calculateTotal().toFixed(2); // Оновлюємо загальну суму
}

document.getElementById("cartItemsContainer").addEventListener("click", (event) => {
    const button = event.target.closest(".qty-btn");

    if (!button) {
        return;
    }

    const productId = Number(button.dataset.id);
    const cartItem = cart.find((item) => item.id === productId);

    if (!cartItem) {
        return;
    }

    if (button.dataset.action === "increase") {
        cartItem.quantity += 1;
    } else if (button.dataset.action === "decrease") {
        cartItem.quantity -= 1;

        if (cartItem.quantity === 0) {
            cart = cart.filter((item) => item.id !== productId);
        }
    } else {
        return;
    }
    updateUI();
});
initShop();