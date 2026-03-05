/**
 * Search Page JavaScript
 */

const API_BASE_URL = 'http://localhost:8000';

// Demo recipes for search
const demoRecipes = [
    { id: '1', title: 'Masala Dosa', description: 'Crispy rice and lentil crepe', cuisine: 'South Indian', category: 'breakfast', prep_time: 30, cook_time: 20, difficulty: 'medium', tags: ['vegetarian', 'vegan'], image_url: 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=400' },
    { id: '2', title: 'Idli Sambar', description: 'Steamed rice cakes', cuisine: 'South Indian', category: 'breakfast', prep_time: 20, cook_time: 30, difficulty: 'easy', tags: ['vegetarian', 'vegan'], image_url: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=400' },
    { id: '3', title: 'Poha', description: 'Flattened rice', cuisine: 'Maharashtrian', category: 'breakfast', prep_time: 15, cook_time: 15, difficulty: 'easy', tags: ['vegetarian', 'vegan'], image_url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400' },
    { id: '4', title: 'Paneer Butter Masala', description: 'Cottage cheese curry', cuisine: 'North Indian', category: 'lunch', prep_time: 20, cook_time: 30, difficulty: 'medium', tags: ['vegetarian'], image_url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400' },
    { id: '5', title: 'Chicken Biryani', description: 'Fragrant rice dish', cuisine: 'Hyderabadi', category: 'lunch', prep_time: 45, cook_time: 60, difficulty: 'hard', tags: ['non-vegetarian'], image_url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400' },
    { id: '6', title: 'Dal Tadka', description: 'Spiced lentil curry', cuisine: 'North Indian', category: 'lunch', prep_time: 10, cook_time: 25, difficulty: 'easy', tags: ['vegetarian', 'vegan'], image_url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400' },
    { id: '7', title: 'Chicken Curry', description: 'Spicy chicken gravy', cuisine: 'Indian', category: 'dinner', prep_time: 30, cook_time: 45, difficulty: 'medium', tags: ['non-vegetarian'], image_url: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400' },
    { id: '8', title: 'Palak Paneer', description: 'Spinach curry', cuisine: 'North Indian', category: 'dinner', prep_time: 15, cook_time: 25, difficulty: 'easy', tags: ['vegetarian'], image_url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400' },
    { id: '9', title: 'Samosa', description: 'Crispy pastry', cuisine: 'North Indian', category: 'snacks', prep_time: 40, cook_time: 25, difficulty: 'medium', tags: ['vegetarian'], image_url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400' },
    { id: '10', title: 'Pakora', description: 'Vegetable fritters', cuisine: 'Indian', category: 'snacks', prep_time: 20, cook_time: 15, difficulty: 'easy', tags: ['vegetarian', 'vegan'], image_url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400' },
    { id: '11', title: 'Gulab Jamun', description: 'Sweet dumplings', cuisine: 'Indian', category: 'desserts', prep_time: 20, cook_time: 30, difficulty: 'medium', tags: ['vegetarian'], image_url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400' },
    { id: '12', title: 'Rasgulla', description: 'Cheese balls', cuisine: 'Bengali', category: 'desserts', prep_time: 20, cook_time: 30, difficulty: 'medium', tags: ['vegetarian'], image_url: 'https://images.unsplash.com/photo-1559305616-3f99cd43e353?w=400' },
    { id: '13', title: 'Puran Poli', description: 'Sweet flatbread', cuisine: 'Maharashtrian', category: 'regional', prep_time: 30, cook_time: 30, difficulty: 'hard', tags: ['vegetarian'], image_url: 'https://images.unsplash.com/photo-1567337710282-00832b415979?w=400' },
    { id: '14', title: 'Dhokla', description: 'Steamed cake', cuisine: 'Gujarati', category: 'regional', prep_time: 15, cook_time: 25, difficulty: 'easy', tags: ['vegetarian', 'vegan'], image_url: 'https://images.unsplash.com/photo-1695504236952-16e6d11f6c44?w=400' },
    { id: '15', title: 'Daal Baati', description: 'Lentils with bread', cuisine: 'Rajasthani', category: 'regional', prep_time: 20, cook_time: 45, difficulty: 'medium', tags: ['vegetarian'], image_url: 'https://images.unsplash.com/photo-1599043513900-489f22695880?w=400' }
];

let currentSearchTerm = '';
let currentFilters = {
    region: '',
    category: '',
    difficulty: '',
    vegetarian: false,
    vegan: false
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadFromURL();
    initSearch();
    initFilters();
});

function loadFromURL() {
    const params = new URLSearchParams(window.location.search);
    const query = params.get('q');
    const region = params.get('region');
    const category = params.get('category');
    
    if (query) {
        document.getElementById('searchInput').value = query;
        currentSearchTerm = query;
    }
    
    if (region) {
        document.getElementById('regionFilter').value = region;
        currentFilters.region = region;
    }
    
    if (category) {
        document.getElementById('categoryFilter').value = category;
        currentFilters.category = category;
    }
    
    if (query || region || category) {
        performSearch();
    } else {
        displayDemoResults();
    }
}

function initSearch() {
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
}

function initFilters() {
    document.getElementById('regionFilter').addEventListener('change', (e) => {
        currentFilters.region = e.target.value;
        performSearch();
    });
    
    document.getElementById('categoryFilter').addEventListener('change', (e) => {
        currentFilters.category = e.target.value;
        performSearch();
    });
    
    document.getElementById('difficultyFilter').addEventListener('change', (e) => {
        currentFilters.difficulty = e.target.value;
        performSearch();
    });
    
    document.getElementById('vegetarianFilter').addEventListener('change', (e) => {
        currentFilters.vegetarian = e.target.checked;
        performSearch();
    });
    
    document.getElementById('veganFilter').addEventListener('change', (e) => {
        currentFilters.vegan = e.target.checked;
        performSearch();
    });
}

function performSearch() {
    currentSearchTerm = document.getElementById('searchInput').value.trim().toLowerCase();
    
    const resultsContainer = document.getElementById('searchResults');
    const resultsCount = document.getElementById('resultsCount');
    
    // Try API first
    searchAPI(resultsContainer, resultsCount).catch(() => {
        // Fallback to demo data
        searchDemoData(resultsContainer, resultsCount);
    });
}

async function searchAPI(container, countEl) {
    const params = new URLSearchParams();
    
    if (currentSearchTerm) params.append('search', currentSearchTerm);
    if (currentFilters.category) params.append('category', currentFilters.category);
    if (currentFilters.cuisine) params.append('cuisine', currentFilters.cuisine);
    if (currentFilters.difficulty) params.append('difficulty', currentFilters.difficulty);
    
    const response = await fetch(`${API_BASE_URL}/api/recipes?${params}`);
    
    if (!response.ok) throw new Error('API error');
    
    const data = await response.json();
    const recipes = data.recipes || [];
    
    displayResults(container, countEl, recipes);
}

function searchDemoData(container, countEl) {
    let results = [...demoRecipes];
    
    // Filter by search term
    if (currentSearchTerm) {
        results = results.filter(r => 
            r.title.toLowerCase().includes(currentSearchTerm) ||
            r.description.toLowerCase().includes(currentSearchTerm) ||
            r.cuisine.toLowerCase().includes(currentSearchTerm) ||
            r.tags.some(t => t.toLowerCase().includes(currentSearchTerm))
        );
    }
    
    // Filter by region
    if (currentFilters.region) {
        results = results.filter(r => 
            r.cuisine.toLowerCase().includes(currentFilters.region.toLowerCase())
        );
    }
    
    // Filter by category
    if (currentFilters.category) {
        results = results.filter(r => r.category === currentFilters.category);
    }
    
    // Filter by difficulty
    if (currentFilters.difficulty) {
        results = results.filter(r => r.difficulty === currentFilters.difficulty);
    }
    
    // Filter by vegetarian
    if (currentFilters.vegetarian) {
        results = results.filter(r => r.tags.includes('vegetarian'));
    }
    
    // Filter by vegan
    if (currentFilters.vegan) {
        results = results.filter(r => r.tags.includes('vegan'));
    }
    
    displayResults(container, countEl, results);
}

function displayResults(container, countEl, recipes) {
    countEl.textContent = `${recipes.length} recipes found`;
    
    if (recipes.length === 0) {
        container.innerHTML = '<p class="no-recipes">No recipes found. Try different search terms or filters.</p>';
        return;
    }
    
    container.innerHTML = recipes.map(recipe => createRecipeCard(recipe)).join('');
}

function displayDemoResults() {
    const container = document.getElementById('searchResults');
    const countEl = document.getElementById('resultsCount');
    displayResults(container, countEl, demoRecipes);
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

function viewRecipe(id) {
    window.location.href = `recipe.html?id=${id}`;
}

