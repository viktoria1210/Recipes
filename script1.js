// =========================
// Дані рецептів
// =========================
const recipesData = {
    "recipe1": {
        id: "recipe1",
        title: "Суп із гарбуза",
        description: "Ніжний гарбузовий суп для вечері",
        category: "mains",
        ingredients: ["Гарбуз", "Цибуля", "Морква", "Вершки"],
        instructions: ["Нарізати овочі", "Обсмажити цибулю", "Додати гарбуз і воду", "Варити до готовності", "Збити блендером", "Додати вершки"]
    },
    "recipe2": {
        id: "recipe2",
        title: "Салат Цезар",
        description: "Класичний салат з куркою та сухариками",
        category: "starters",
        ingredients: ["Курка", "Салат", "Сир Пармезан", "Сухарики", "Соус Цезар"],
        instructions: ["Приготувати курку", "Порізати салат", "Додати курку і сухарики", "Полити соусом", "Посипати сиром"]
    }
    // Додайте інші рецепти тут
};

// =========================
// Ініціалізація після завантаження DOM
// =========================
document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    renderRecipes();
    initRecipeFiltering();
    initRecipeSearch();
    initFavorites();
    initRecipeModal();
});

// =========================
// Мобільне меню
// =========================
function initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.querySelector('.nav-menu');
    if (!hamburger || !navMenu) return;

    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.innerHTML = navMenu.classList.contains('active')
            ? '<i class="fas fa-times"></i>'
            : '<i class="fas fa-bars"></i>';
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger.innerHTML = '<i class="fas fa-bars"></i>';
        });
    });
}

// =========================
// Рендер рецептів
// =========================
function renderRecipes() {
    const container = document.querySelector('.recipes-container');
    if (!container) return;

    container.innerHTML = '';

    Object.values(recipesData).forEach(recipe => {
        const card = document.createElement('div');
        card.className = 'recipe-card';
        card.dataset.category = recipe.category;
        card.innerHTML = `
            <h3 class="recipe-title">${recipe.title}</h3>
            <p class="recipe-description">${recipe.description}</p>
            <button class="btn-recipe" data-recipe="${recipe.id}">Детальніше</button>
            <button class="fav-btn" data-recipe="${recipe.id}"><i class="far fa-heart"></i></button>
        `;
        container.appendChild(card);
    });
}

// =========================
// Фільтри по категоріях
// =========================
function initRecipeFiltering() {
    const filterTags = document.querySelectorAll('.filter-tag');

    filterTags.forEach(tag => {
        tag.addEventListener('click', function () {
            filterTags.forEach(t => t.classList.remove('active'));
            this.classList.add('active');

            const category = this.dataset.category;
            document.querySelectorAll('.recipe-card').forEach(card => {
                card.style.display = (category === 'all' || card.dataset.category === category) ? 'block' : 'none';
            });
        });
    });
}

// =========================
// Пошук рецептів
// =========================
function initRecipeSearch() {
    const searchInput = document.getElementById('recipeSearch');
    const searchBtn = document.querySelector('.search-btn');

    function performSearch() {
        const term = searchInput.value.toLowerCase();
        document.querySelectorAll('.recipe-card').forEach(card => {
            const title = card.querySelector('.recipe-title').textContent.toLowerCase();
            const desc = card.querySelector('.recipe-description').textContent.toLowerCase();
            card.style.display = (title.includes(term) || desc.includes(term)) ? 'block' : 'none';
        });
    }

    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keyup', e => {
        if (e.key === 'Enter') performSearch();
    });
}

// =========================
// Улюблені рецепти
// =========================
function initFavorites() {
    let favorites = JSON.parse(localStorage.getItem('quicktasteFavorites')) || [];

    document.querySelectorAll('.fav-btn').forEach(btn => {
        const recipeId = btn.dataset.recipe;

        if (favorites.includes(recipeId)) btn.querySelector('i').classList.replace('far', 'fas');

        btn.addEventListener('click', () => {
            const icon = btn.querySelector('i');
            if (icon.classList.contains('far')) {
                icon.classList.replace('far', 'fas');
                favorites.push(recipeId);
            } else {
                icon.classList.replace('fas', 'far');
                favorites = favorites.filter(id => id !== recipeId);
            }
            localStorage.setItem('quicktasteFavorites', JSON.stringify(favorites));
        });
    });
}

// =========================
// Модальне вікно рецептів
// =========================
function initRecipeModal() {
    const modal = document.getElementById('recipeModal');
    const modalBody = document.getElementById('modalBody');

    document.addEventListener('click', e => {
        if (e.target.classList.contains('btn-recipe')) {
            const recipeId = e.target.dataset.recipe;
            const recipe = recipesData[recipeId];

            modalBody.innerHTML = `
                <span class="close" id="closeModal">&times;</span>
                <h2>${recipe.title}</h2>
                <p>${recipe.description}</p>
                <h3>Інгредієнти</h3>
                <ul>${recipe.ingredients.map(i => `<li>${i}</li>`).join('')}</ul>
                <h3>Приготування</h3>
                <ol>${recipe.instructions.map(i => `<li>${i}</li>`).join('')}</ol>
            `;

            modal.classList.add('active');
            document.body.style.overflow = 'hidden';

            document.getElementById('closeModal').addEventListener('click', closeModal);
        }
    });

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
}
