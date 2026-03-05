/**
 * Recipe Detail Page JavaScript
 */

const API_BASE_URL = 'http://localhost:8000';

// Demo recipe data
const demoRecipes = {
    '1': {
        id: '1',
        title: 'Masala Dosa',
        description: 'A crispy, savory crepe made from fermented rice and lentil batter, filled with a spiced potato mixture. This iconic South Indian breakfast dish is enjoyed throughout India and around the world.',
        cuisine: 'South Indian',
        category: 'breakfast',
        prep_time: 30,
        cook_time: 20,
        servings: 4,
        difficulty: 'medium',
        ingredients: [
            { name: 'Rice', quantity: '2', unit: 'cups' },
            { name: 'Urad Dal', quantity: '1', unit: 'cup' },
            { name: 'Potatoes', quantity: '4', unit: 'medium' },
            { name: 'Onion', quantity: '1', unit: 'large' },
            { name: 'Green Chilies', quantity: '2-3', unit: 'pieces' },
            { name: 'Curry Leaves', quantity: '10-12', unit: 'leaves' },
            { name: 'Mustard Seeds', quantity: '1', unit: 'tsp' },
            { name: 'Turmeric Powder', quantity: '1/2', unit: 'tsp' },
            { name: 'Salt', quantity: 'to', unit: 'taste' },
            { name: 'Oil', quantity: '2-3', unit: 'tbsp' }
        ],
        instructions: [
            { step: 'Soak rice and urad dal separately for 4-6 hours.' },
            { step: 'Grind urad dal to a smooth batter, then grind rice to a slightly grainy batter.' },
            { step: 'Mix both batters together with salt and ferment overnight.' },
            { step: 'For filling: Boil potatoes and mash them.' },
            { step: 'Heat oil, add mustard seeds, curry leaves, and sliced onions.' },
            { step: 'Add turmeric, green chilies, and salt. Cook until onions are soft.' },
            { step: 'Add mashed potatoes and mix well. Set aside.' },
            { step: 'Heat a flat pan (tawa). Pour a ladleful of batter and spread thin.' },
            { step: 'Drizzle oil around the edges. Cook until crispy and golden.' },
            { step: 'Place potato filling in the center, fold, and serve hot with sambar and chutney.' }
        ],
        culturalStory: 'Masala Dosa originated in the southern state of Karnataka and became popular throughout South India. The fermentation process used in making dosa not only gives it a unique tangy flavor but also makes iteasier to digest. Today, it is one of the most recognized Indian dishes worldwide, representing the rich culinary heritage of South India.',
        image_url: 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=800'
    },
    '2': {
        id: '2',
        title: 'Butter Chicken',
        description: 'A rich, creamy curry made with tender chicken pieces in a tomato-based sauce. This beloved North Indian dish is known for its rich flavor and vibrant orange color.',
        cuisine: 'North Indian',
        category: 'dinner',
        prep_time: 30,
        cook_time: 45,
        servings: 4,
        difficulty: 'medium',
        ingredients: [
            { name: 'Chicken', quantity: '500', unit: 'gms' },
            { name: 'Yogurt', quantity: '1', unit: 'cup' },
            { name: 'Tomatoes', quantity: '4', unit: 'medium' },
            { name: 'Cream', quantity: '1/2', unit: 'cup' },
            { name: 'Butter', quantity: '4', unit: 'tbsp' },
            { name: 'Garlic', quantity: '6-8', unit: 'cloves' },
            { name: 'Ginger', quantity: '1', unit: 'inch' },
            { name: 'Garam Masala', quantity: '1', unit: 'tsp' },
            { name: 'Kashmiri Red Chili', quantity: '1', unit: 'tbsp' },
            { name: 'Salt', quantity: 'to', unit: 'taste' }
        ],
        instructions: [
            { step: 'Marinate chicken in yogurt, salt, and half the spices for 2 hours.' },
            { step: 'Grill or pan-fry the marinated chicken until charred. Set aside.' },
            { step: 'In a pan, melt butter and sauté ginger-garlic paste.' },
            { step: 'Add tomatoes and cook until soft and mushy.' },
            { step: 'Add spices and cook for 5 minutes. Let it cool and blend to a smooth paste.' },
            { step: 'Return the paste to the pan, add cream and butter.' },
            { step: 'Add the grilled chicken pieces and simmer for 15-20 minutes.' },
            { step: 'Finish with a drizzle of cream and serve hot with naan or rice.' }
        ],
        culturalStory: 'Butter Chicken was invented in Delhi in the 1950s at the famous Moti Mahal restaurant. The story goes that leftover tandoori chicken was simmered in a tomato and cream sauce, creating this beloved dish. It has since become one of the most popular Indian dishes globally, representing the rich Mughlai cuisine of North India.',
        image_url: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800'
    },
    '3': {
        id: '3',
        title: 'Dhokla',
        description: 'A soft, fluffy steamed cake made from fermented batter of rice and fermented urad dal. This healthy Gujarati snack is perfect for breakfast or as an evening snack.',
        cuisine: 'Gujarati',
        category: 'snacks',
        prep_time: 15,
        cook_time: 25,
        servings: 4,
        difficulty: 'easy',
        ingredients: [
            { name: 'Rice', quantity: '1', unit: 'cup' },
            { name: 'Urad Dal', quantity: '1/4', unit: 'cup' },
            { name: 'Yogurt', quantity: '2', unit: 'tbsp' },
            { name: 'Eno Fruit Salt', quantity: '1', unit: 'tsp' },
            { name: 'Sugar', quantity: '1', unit: 'tsp' },
            { name: 'Salt', quantity: 'to', unit: 'taste' },
            { name: 'Mustard Seeds', quantity: '1', unit: 'tsp' },
            { name: 'Green Chilies', quantity: '2', unit: 'chopped' },
            { name: 'Curry Leaves', quantity: '8-10', unit: 'leaves' },
            { name: 'Oil', quantity: '2', unit: 'tbsp' }
        ],
        instructions: [
            { step: 'Soak rice and urad dal for 4-5 hours.' },
            { step: 'Grind to a smooth batter with yogurt.' },
            { step: 'Add salt and sugar, let it ferment for 4-6 hours.' },
            { step: 'Before steaming, add Eno fruit salt and mix gently.' },
            { step: 'Grease a steamer plate and pour the batter.' },
            { step: 'Steam for 15-20 minutes until a toothpick comes out clean.' },
            { step: 'For tempering: Heat oil, add mustard seeds, green chilies, and curry leaves.' },
            { step: 'Pour the tempering over the dhokla and cut into pieces. Serve with green chutney.' }
        ],
        culturalStory: 'Dhokla is believed to have originated in the state of Gujarat and is a staple food in Gujarati households. It is often prepared during festivals and special occasions. The word "dhokla" comes from the Gujarati word "dhokalo" meaning "to bounce," which describes the soft, spongy texture of this steamed snack.',
        image_url: 'https://images.unsplash.com/photo-1695504236952-16e6d11f6c44?w=800'
    }
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadRecipe();
});

function loadRecipe() {
    const params = new URLSearchParams(window.location.search);
    const recipeId = params.get('id');
    
    if (!recipeId) {
        showError('Recipe not found');
        return;
    }
    
    // Try API first
    fetchRecipeFromAPI(recipeId).catch(() => {
        // Fallback to demo data
        loadDemoRecipe(recipeId);
    });
}

async function fetchRecipeFromAPI(id) {
    const response = await fetch(`${API_BASE_URL}/api/recipes/${id}`);
    
    if (!response.ok) {
        throw new Error('Recipe not found');
    }
    
    const recipe = await response.json();
    displayRecipe(recipe);
}

function loadDemoRecipe(id) {
    const recipe = demoRecipes[id];
    
    if (!recipe) {
        // If no demo data, show a default recipe
        displayRecipe(demoRecipes['1']);
        return;
    }
    
    displayRecipe(recipe);
}

function displayRecipe(recipe) {
    // Update hero section
    document.getElementById('recipeImage').src = recipe.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800';
    document.getElementById('recipeTitle').textContent = recipe.title;
    
    const totalTime = (recipe.prep_time || 0) + (recipe.cook_time || 0);
    document.getElementById('totalTime').textContent = `${totalTime} min`;
    document.getElementById('recipeDifficulty').textContent = recipe.difficulty || 'Easy';
    document.getElementById('recipeServings').textContent = `${recipe.servings || 4} servings`;
    
    // Update sidebar
    document.getElementById('recipeCuisine').textContent = recipe.cuisine || 'Indian';
    document.getElementById('recipeCategory').textContent = recipe.category || 'Main Course';
    document.getElementById('prepTime').textContent = `${recipe.prep_time || 15} min`;
    document.getElementById('cookTime').textContent = `${recipe.cook_time || 20} min`;
    document.getElementById('difficulty').textContent = recipe.difficulty || 'Easy';
    document.getElementById('recipeAuthor').textContent = recipe.author || 'Tech Nova';
    
    // Update description
    document.getElementById('recipeDescription').textContent = recipe.description || 'No description available.';
    
    // Update ingredients
    const ingredientsList = document.getElementById('ingredientsList');
    const ingredients = recipe.ingredients || [];
    ingredientsList.innerHTML = ingredients.map(ing => `
        <li>
            <span class="ingredient-bullet"></span>
            <span>${ing.quantity || ''} ${ing.unit || ''} ${ing.name}</span>
        </li>
    `).join('');
    
    // Update instructions
    const instructionsList = document.getElementById('instructionsList');
    const instructions = recipe.instructions || [];
    instructionsList.innerHTML = instructions.map(inst => `
        <li>
            <span class="instruction-text">${inst.step}</span>
        </li>
    `).join('');
    
    // Update cultural story
    document.getElementById('culturalStory').textContent = recipe.culturalStory || 
        'Every dish in Indian cuisine carries with it centuries of tradition, family memories, and cultural significance. This recipe has been passed down through generations.';
}

function showError(message) {
    document.getElementById('recipeTitle').textContent = 'Recipe Not Found';
    document.getElementById('recipeDescription').textContent = message;
}

