const products=[
    {
        id: 1,
        title: "Я бачу, вас цікавить пітьма.",
        author: "Ілларіон Павлюк",
        price: 700,
        category: "Художня література",
        image: "https://placehold.co/300x200",
    },

    {
        id: 2,
        title: "Блокнот у лінійку",
        author: "",
        price: 200,
        category: "Канцелярія",
        image: "https://placehold.co/300x200",
    },

    {
        id: 3,
        title: "Остання подорож дівчат",
        author: "Цукумідзу",
        price: 180,
        category: "Манга",
        image: "https://placehold.co/300x200",
    },

    {
        id: 4,
        title: "Людина розумна",
        author: "Ювал Ной Харарі",
        price: 600,
        category: "Наукова література",
        image: "https://placehold.co/300x200",
    },

    {
        id: 5,
        title: "Атлас, географія, 7 клас",
        author: "",
        price: 250,
        category: "Навчальні матеріали",
        image: "https://placehold.co/100x200",
    },

    {
        id: 6,
        title: "Математика 4 клас 2026",
        author: "Богданович",
        price: 500,
        category: "Підручники",
        image: "https://placehold.co/100x200",
    },

    {
        id: 7,
        title: "Маленький принц",
        author: "Антуан де Сент-Екзюпері",
        price: 300,
        category: "Дитяча література",
        image: "https://placehold.co/100x200",
    },

    {
        id: 8,
        title: "Подарунковий набір «Відьмак»",
        author: "Анджей Сапковський",
        price: 2000,
        category: "Подарункові набори",
        image: "https://placehold.co/100x200",
    },
];

let cart = [];

const container = document.getElementById("product-container");

container.addEventListener("click", (event) => {
  if (event.target.classList.contains("btn-buy")) {
    const productId = Number(event.target.dataset.id);

    const selectedProduct = products.find((p) => p.id === productId);

    addToCart(selectedProduct);
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

function fetchProducts(){
    return new Promise((resolve, reject)=>{
        setTimeout(()=>{
            resolve(products);// штучне стимулювання позитивної відповіді

            //reject(new Error("Помилка при завантаженні товарів"));
        }, 1500);
    });
}

async function initShop(){
    const loader = document.getElementById("loader");

    loader.classList.remove("hidden");
    container.innerHTML="";//очищення сітки

    try{
        //чекаємо півтори секунди
        const data = await fetchProducts();

        //спінер хоавається, якщо відповідь від сервера позитивна
        loader.classList.add("hidden");
            //картки товарів
        const htmlString = data
        .map((product) => {
            return `
            <article class="product-card">
                <img src="${product.image}" alt="${product.title}">
                <h3>${product.title}</h3>
                <p class="author">Автор: ${product.author || "Невідомий автор"}</p>
                <p class="price"> ${product.price} грн </p>
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
            <p>${item.title} — ${item.price} грн × ${item.quantity}</p>
            <div class="cart-item-controls">
                <button class="qty-btn" type="button" data-action="decrease" data-id="${item.id}" aria-label="Зменшити кількість: ${item.title}">−</button>
                <span>${item.quantity}</span>
                <button class="qty-btn" type="button" data-action="increase" data-id="${item.id}" aria-label="Збільшити кількість: ${item.title}">+</button>
            </div>
            <p>${item.price * item.quantity} грн</p>
        `;
        cartItemsContainer.appendChild(cartItem);
    });

    cartTotalSum.textContent = calculateTotal();
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