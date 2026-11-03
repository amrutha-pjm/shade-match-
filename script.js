
// MAKEUP PRODUCT DATA

const products = [
    {
        id: 1,
        name: "Rose Nude",
        category: "Lipstick",
        shade: "#bd777b",
        description: "A soft rose colour for everyday looks.",
        icon: "💄"
    },
    {
        id: 2,
        name: "Berry Kiss",
        category: "Lipstick",
        shade: "#8e3d58",
        description: "A rich berry shade for bold looks.",
        icon: "💄"
    },
    {
        id: 3,
        name: "Peach Glow",
        category: "Blush",
        shade: "#efad96",
        description: "A fresh peach shade for a natural glow.",
        icon: "🌸"
    },
    {
        id: 4,
        name: "Soft Pink",
        category: "Blush",
        shade: "#e9a4b3",
        description: "A delicate pink shade for a soft look.",
        icon: "🌸"
    },
    {
        id: 5,
        name: "Warm Beige",
        category: "Foundation",
        shade: "#c99772",
        description: "A warm beige foundation shade.",
        icon: "✨"
    },
    {
        id: 6,
        name: "Golden Sand",
        category: "Foundation",
        shade: "#b98255",
        description: "A golden-toned foundation shade.",
        icon: "✨"
    }
];


// SAVED FAVOURITES

let favorites = JSON.parse(localStorage.getItem("shadeFavorites")) || [];

let currentFilter = "All";


// NAVIGATION BETWEEN PAGES

function showPage(pageName) {

    const pages = document.querySelectorAll(".page");

    pages.forEach(page => {
        page.classList.add("hidden");
    });

    document.getElementById(pageName).classList.remove("hidden");

    if (pageName === "explore") {
        renderProducts();
    }

    if (pageName === "collection") {
        renderCollection();
    }

    if (pageName === "profile") {
        updateProfile();
    }

    window.scrollTo(0, 0);
}


// CATEGORY FILTER

function setFilter(category, button) {

    currentFilter = category;

    document.querySelectorAll(".filter-btn").forEach(btn => {
        btn.classList.remove("active");
    });

    button.classList.add("active");

    renderProducts();
}


// OPEN EXPLORE WITH A SELECTED CATEGORY

function filterAndExplore(category) {

    showPage("explore");

    currentFilter = category;

    document.querySelectorAll(".filter-btn").forEach(btn => {
        btn.classList.toggle(
            "active",
            btn.textContent.trim() === category
        );
    });

    renderProducts();
}


// DISPLAY PRODUCTS

function createProductCard(product) {

    const isFavorite = favorites.includes(product.id);

    return `
        <div class="product-card">

            <div class="product-art" style="background:#f7e9e5">

                <div class="shade-circle"
                     style="background:${product.shade}">
                </div>

            </div>

            <div class="product-info">

                <span class="tag">${product.category}</span>

                <h3>${product.name}</h3>

                <p>${product.description}</p>

                <div class="product-actions">

                    <button class="view-btn"
                        onclick="viewProduct(${product.id})">
                        View Details
                    </button>

                    <button class="fav-btn"
                        onclick="toggleFavorite(${product.id})">
                        ${isFavorite ? "♥" : "♡"}
                    </button>

                </div>

            </div>

        </div>
    `;
}


// SEARCH AND FILTER PRODUCTS

function renderProducts() {

    const searchText = document
        .getElementById("searchInput")
        .value.toLowerCase();

    const filteredProducts = products.filter(product => {

        const matchesCategory =
            currentFilter === "All" ||
            product.category === currentFilter;

        const matchesSearch =
            product.name.toLowerCase().includes(searchText) ||
            product.category.toLowerCase().includes(searchText);

        return matchesCategory && matchesSearch;
    });

    const grid = document.getElementById("productGrid");

    if (filteredProducts.length === 0) {

        grid.innerHTML = `
            <div class="empty-message">
                <h3>No shades found ♡</h3>
                <p>Try searching for another product.</p>
            </div>
        `;

        return;
    }

    grid.innerHTML = filteredProducts
        .map(createProductCard)
        .join("");
}


// ADD OR REMOVE FAVOURITES

function toggleFavorite(id) {

    if (favorites.includes(id)) {

        favorites = favorites.filter(item => item !== id);

    } else {

        favorites.push(id);

    }

    localStorage.setItem(
        "shadeFavorites",
        JSON.stringify(favorites)
    );

    renderProducts();
    renderCollection();
    updateProfile();
}


// DISPLAY SAVED COLLECTION

function renderCollection() {

    const grid = document.getElementById("collectionGrid");

    const savedProducts = products.filter(product =>
        favorites.includes(product.id)
    );

    if (savedProducts.length === 0) {

        grid.innerHTML = `
            <div class="empty-message">
                <h3>Your collection is empty ♡</h3>
                <p>Explore shades and add your favourites!</p>
                <button class="primary-btn"
                    onclick="showPage('explore')">
                    Explore Products
                </button>
            </div>
        `;

        return;
    }

    grid.innerHTML = savedProducts
        .map(createProductCard)
        .join("");
}


// VIEW PRODUCT DETAILS

function viewProduct(id) {

    const product = products.find(item => item.id === id);

    const modal = document.getElementById("productModal");

    document.getElementById("modalDetails").innerHTML = `

        <span class="tag">${product.category}</span>

        <div class="product-art" style="background:#f7e9e5">
            <div class="shade-circle"
                style="background:${product.shade}">
            </div>
        </div>

        <h2>${product.name}</h2>

        <p>${product.description}</p>

        <p><strong>Shade:</strong> ${product.shade}</p>

        <button class="primary-btn"
            onclick="toggleFavorite(${product.id}); viewProduct(${product.id})">
            ${favorites.includes(product.id)
                ? "♥ Remove Favourite"
                : "♡ Add to Favourites"}
        </button>

    `;

    modal.classList.remove("hidden");
}


// CLOSE PRODUCT POPUP

function closeModal() {

    document.getElementById("productModal")
        .classList.add("hidden");
}


// UPDATE PROFILE STATISTICS

function updateProfile() {

    document.getElementById("favoriteCount")
        .textContent = favorites.length;
}


// CLOSE POPUP WHEN CLICKING OUTSIDE

document.getElementById("productModal").addEventListener("click", function(event) {

    if (event.target === this) {
        closeModal();
    }

});


// INITIALIZE APPLICATION

renderProducts();
renderCollection();
updateProfile();
