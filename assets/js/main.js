const products=[
    {
        id: 1,
        title: "Я бачу, вас цікавить пітьма.",
        author: "Ілларіон Павлюк",
        price: 700,
        category: "Художня література",
        image: "image1.jpg",
    },

    {
        id: 2,
        title: "Блокнот у лінійку",
        author: "",
        price: 200,
        category: "Канцелярія",
        image: "image2.jpg",
    },

    {
        id: 3,
        title: "Остання подорож дівчат",
        author: "Цукумідзу",
        price: 180,
        category: "Манга",
        image: "image3.jpg",
    },

    {
        id: 4,
        title: "Людина розумна",
        author: "Ювал Ной Харарі",
        price: 600,
        category: "Наукова література",
        image: "image4.jpg",
    },

    {
        id: 5,
        title: "Атлас, географія, 7 клас",
        author: "",
        price: 250,
        category: "Навчальні матеріали",
        image: "image5.jpg",
    },

    {
        id: 6,
        title: "Математика 4 клас 2026",
        author: "Богданович",
        price: 500,
        category: "Підручники",
        image: "image6.jpg",
    },

    {
        id: 7,
        title: "Маленький принц",
        author: "Антуан де Сент-Екзюпері",
        price: 300,
        category: "Дитяча література",
        image: "image7.jpg",
    },

    {
        id: 8,
        title: "Подарунковий набір «Відьмак»",
        author: "Анджей Сапковський",
        price: 2000,
        category: "Подарункові набори",
        image: "image8.jpg",
    },
];

let cart = [];

const container = document.querySelector(".products-grid");

const htmlString = products
.map((product) => {
    return `
        <article class="product-card">
            <img src="${product.image}" alt="${product.title}">
            <h3>${product.title}</h3>
            <p class="price"> ${product.price} грн </p>
            <button class="btn btn-buy" data-id="${product.id}"> Купити </button>
        </article>
    `;
}).join("");

container.innerHTML = htmlString;


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

    console.log("Поточний кошик: ", cart);
    console.log("Загальна сума: ", calculateTotal(), "грн");
}
