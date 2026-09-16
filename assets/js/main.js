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
        author: "(Богданович)",
        price: 500,
        category: "Підручники",
        image: "image6.jpg",
    },

    {
        id: 7,
        title: "Маленький принц",
        author: "Антуан де Сент-Экзюпери",
        price: 300,
        category: "Дитяча література",
        image: "image7.jpg",
    },

    {
        id: 8,
        title: "Подарунковий набір \"Відьмак\"",
        author: "Анджей Сапковський",
        price: 2000,
        category: "Подарункові набори",
        image: "image8.jpg",
    },
];

const container = document.querySelector(".products-container");

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