/**
 * Categories Page JavaScript
 */

const API_BASE_URL = 'http://localhost:8000';
let currentCategory = 'all';
let currentPage = 1;
let totalPages = 1;

// Demo recipes data
const demoRecipes = [
    { id: '1', title: 'Masala Dosa', description: 'Crispy rice and lentil crepe', cuisine: 'South Indian', category: 'breakfast', prep_time: 30, cook_time: 20, difficulty: 'medium', image_url: 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=400' },
    { id: '2', title: 'Idli Sambar', description: 'Steamed rice cakes with lentil curry', cuisine: 'South Indian', category: 'breakfast', prep_time: 20, cook_time: 30, difficulty: 'easy', image_url: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=400' },
    { id: '3', title: 'Poha', description: 'Flattened rice with vegetables', cuisine: 'Maharashtrian', category: 'breakfast', prep_time: 15, cook_time: 15, difficulty: 'easy', image_url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400' },
    { id: '4', title: 'Paneer Butter Masala', description: 'Cottage cheese in creamy tomato sauce', cuisine: 'North Indian', category: 'lunch', prep_time: 20, cook_time: 30, difficulty: 'medium', image_url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400' },
    { id: '5', title: 'Biryani', description: 'Fragrant rice with spices and meat', cuisine: 'Hyderabadi', category: 'lunch', prep_time: 45, cook_time: 60, difficulty: 'hard', image_url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400' },
    { id: '6', title: 'Dal Tadka', description: 'Spiced lentil curry', cuisine: 'North Indian', category: 'lunch', prep_time: 10, cook_time: 25, difficulty: 'easy', image_url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400' },
    { id: '7', title: 'Chicken Curry', description: 'Traditional chicken in spicy gravy', cuisine: 'Indian', category: 'dinner', prep_time: 30, cook_time: 45, difficulty: 'medium', image_url: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400' },
    { id: '8', title: 'Palak Paneer', description: 'Cottage cheese in spinach gravy', cuisine: 'North Indian', category: 'dinner', prep_time: 15, cook_time: 25, difficulty: 'easy', image_url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400' },
    { id: '9', title: 'Pav Bhaji', description: 'Spiced mashed vegetables with bread', cuisine: 'Maharashtrian', category: 'dinner', prep_time: 20, cook_time: 30, difficulty: 'medium', image_url: 'https://images.unsplash.com/photo-1626132647523-66dbeac34534?w=400' },
    { id: '10', title: 'Samosa', description: 'Crispy pastry with spiced filling', cuisine: 'North Indian', category: 'snacks', prep_time: 40, cook_time: 25, difficulty: 'medium', image_url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400' },
    { id: '11', title: 'Pakora', description: 'Fried vegetable fritters', cuisine: 'Indian', category: 'snacks', prep_time: 20, cook_time: 15, difficulty: 'easy', image_url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400' },
    { id: '12', title: 'Vada Pav', description: 'Potato fritter in bread', cuisine: 'Maharashtrian', category: 'snacks', prep_time: 30, cook_time: 20, difficulty: 'easy', image_url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400' },
    { id: '13', title: 'Gulab Jamun', description: 'Fried milk balls in syrup', cuisine: 'Indian', category: 'desserts', prep_time: 20, cook_time: 30, difficulty: 'medium', image_url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400' },
    { id: '14', title: 'Rasgulla', description: 'Soft cheese balls in syrup', cuisine: 'Bengali', category: 'desserts', prep_time: 20, cook_time: 30, difficulty: 'medium', image_url: 'https://images.unsplash.com/photo-1559305616-3f99cd43e353?w=400' },
    { id: '15', title: 'Jalebi', description: 'Crispy fried spirals in syrup', cuisine: 'Indian', category: 'desserts', prep_time: 15, cook_time: 20, difficulty: 'hard', image_url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400' },
    { id: '16', title: 'Dosa', description: 'Crispy rice crepe', cuisine: 'South Indian', category: 'regional', prep_time: 20, cook_time: 15, difficulty: 'medium', image_url: 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=400' },
    { id: '17', title: 'Puran Poli', description: 'Sweet stuffed flatbread', cuisine: 'Maharashtrian', category: 'regional', prep_time: 30, cook_time: 30, difficulty: 'hard', image_url: 'https://images.unsplash.com/photo-1567337710282-00832b415979?w=400' },
    { id: '18', title: 'Dhokla', description: 'Steamed savory cake', cuisine: 'Gujarati', category: 'regional', prep_time: 15, cook_time: 25, difficulty: 'easy', image_url: 'https://images.unsplash.com/photo-1695504236952-16e6d11f6c44?w=400' }
];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initFilterTabs();
    loadCategoryFromURL();
    loadRecipes();
});

function initFilterTabs() {
    const tabs = document.querySelectorAll('.filter-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentCategory = tab.dataset.category;
            currentPage = 1;
            loadRecipes();
        });
    });
}

function loadCategoryFromURL() {
    const params = new URLSearchParams(window.location.search);
    const category = params.get('category');
    if (category) {
        currentCategory = category;
        const tabs = document.querySelectorAll('.filter-tab');
        tabs.forEach(tab => {
            if (tab.dataset.category === category) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });
    }
}

async function loadRecipes() {
    const grid = document.getElementById('recipesGrid');
    if (!grid) return;

    try {
        const deviceType = localStorage.getItem('device_type');
        const endpoint = deviceType === 'mobile' ? '/api/recipes/mobile' : '/api/recipes';
        
        let url = `${API_BASE_URL}${endpoint}?page=${currentPage}&page_size=12`;
        if (currentCategory !== 'all') {
            url += `&category=${currentCategory}`;
        }
        
        const response = await fetch(url);
        
        if (response.ok) {
            const data = await response.json();
            displayRecipes(grid, data.recipes || []);
            totalPages = data.total_pages || 1;
            updatePagination();
        } else {
            displayDemoRecipes(grid);
        }
    } catch (error) {
        console.error('Error loading recipes:', error);
        displayDemoRecipes(grid);
    }
}

function displayRecipes(container, recipes) {
    if (recipes.length === 0) {
        container.innerHTML = '<p class="no-recipes">No recipes found in this category</p>';
        return;
    }
    container.innerHTML = recipes.map(recipe => createRecipeCard(recipe)).join('');
}

function displayDemoRecipes(container) {
    let filtered = demoRecipes;
    if (currentCategory !== 'all') {
        filtered = demoRecipes.filter(r => r.category === currentCategory);
    }
    
    if (filtered.length === 0) {
        container.innerHTML = '<p class="no-recipes">No recipes found in this category</p>';
        return;
    }
    
    container.innerHTML = filtered.map(recipe => createRecipeCard(recipe)).join('');
    totalPages = Math.ceil(filtered.length / 12);
    updatePagination();
}

function createRecipeCard(recipe) {
    const totalTime = (recipe.prep_time || 0) + (recipe.cook_time || 0);
    
    return `
        <div class="recipe-card" onclick="viewRecipe('${recipe.id}')">
            <div class="recipe-image">
                <img src="${recipe.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400'}" alt="${recipe.title}">
                <span class="recipe-badge">${recipe.difficulty || 'Easy'}</span>
            </div>
            <div class="recipe-content">
                <h3>${recipe.title}</h3>
                <p>${recipe.description || ''}</p>
                <div class="recipe-meta">
                    <span><i class="fas fa-clock"></i> ${totalTime} min</span>
                    <span><i class="fas fa-fire"></i> ${recipe.difficulty || 'Easy'}</span>
                </div>
                <span class="recipe-region">${recipe.cuisine || 'Indian'}</span>
            </div>
        </div>
    `;
}

function updatePagination() {
    const pagination = document.getElementById('pagination');
    if (!pagination) return;
    
    if (totalPages <= 1) {
        pagination.innerHTML = '';
        return;
    }
    
    let html = '';
    
    if (currentPage > 1) {
        html += `<button class="page-btn" onclick="changePage(${currentPage - 1})"><i class="fas fa-chevron-left"></i></button>`;
    }
    
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
            html += `<button class="page-btn ${i === currentPage ? 'active' : ''}" onclick="changePage(${i})">${i}</button>`;
        } else if (i === currentPage - 2 || i === currentPage + 2) {
            html += `<span class="page-ellipsis">...</span>`;
        }
    }
    
    if (currentPage < totalPages) {
        html += `<button class="page-btn" onclick="changePage(${currentPage + 1})"><i class="fas fa-chevron-right"></i></button>`;
    }
    
    pagination.innerHTML = html;
}

function changePage(page) {
    currentPage = page;
    loadRecipes();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function viewRecipe(id) {
    window.location.href = `recipe.html?id=${id}`;
}

