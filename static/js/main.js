document.addEventListener('DOMContentLoaded', function() {
    // Tab Navigation
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all tabs
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked tab
            button.classList.add('active');
            const tabId = button.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    // Recipe Functionality
    loadRecipes();
    
    // Add event listener for random recipe button
    const randomRecipeBtn = document.getElementById('random-recipe');
    if (randomRecipeBtn) {
        randomRecipeBtn.addEventListener('click', displayRandomRecipe);
    }
    
    // Food Database Functionality
    loadFoodDatabase();
    
    // Add event listener for food search
    const searchBtn = document.getElementById('search-btn');
    if (searchBtn) {
        searchBtn.addEventListener('click', searchFood);
    }
    
    // Allow searching by pressing Enter
    const foodSearchInput = document.getElementById('food-search');
    if (foodSearchInput) {
        foodSearchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchFood();
            }
        });
    }
    
    // Weather icons based on condition
    updateWeatherIcons();
});

// Global variables to store data
let recipes = [];
let foodDatabase = {};

// Load recipes from JSON file
function loadRecipes() {
    fetch('/static/data/recipes.json')
        .then(response => response.json())
        .then(data => {
            recipes = data;
            displayRandomRecipe();
        })
        .catch(error => {
            console.error('Error loading recipes:', error);
            displaySampleRecipes();
        });
}

// Display a random recipe
function displayRandomRecipe() {
    const recipeContainer = document.querySelector('.recipe-container');
    
    if (recipes.length > 0) {
        // Shuffle recipes and take 3 random ones
        const shuffledRecipes = [...recipes].sort(() => 0.5 - Math.random());
        const selectedRecipes = shuffledRecipes.slice(0, 3);
        
        // Clear container and display recipes
        recipeContainer.innerHTML = '';
        selectedRecipes.forEach(recipe => {
            recipeContainer.appendChild(createRecipeCard(recipe));
        });
    } else {
        // If recipes failed to load, display sample recipes
        displaySampleRecipes();
    }
    
    // Add animation class to container
    recipeContainer.classList.add('fade-in');
    setTimeout(() => {
        recipeContainer.classList.remove('fade-in');
    }, 500);
}

// Create a recipe card element
function createRecipeCard(recipe) {
    const card = document.createElement('div');
    card.className = 'recipe-card';
    
    const iconClass = getRecipeIcon(recipe.type);
    
    card.innerHTML = `
        <div class="recipe-header">
            <i class="${iconClass}"></i>
            <h3>${recipe.name}</h3>
        </div>
        <div class="recipe-body">
            <div class="recipe-ingredients">
                <h4><i class="fas fa-list"></i> Zutaten</h4>
                <ul>
                    ${recipe.ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
                </ul>
            </div>
            <div class="recipe-instructions">
                <h4><i class="fas fa-utensils"></i> Zubereitung</h4>
                <ol>
                    ${recipe.instructions.map(step => `<li>${step}</li>`).join('')}
                </ol>
            </div>
        </div>
        <div class="recipe-footer">
            <div class="recipe-time">
                <i class="fas fa-clock"></i>
                <span>${recipe.time} Min.</span>
            </div>
            <div class="recipe-difficulty">
                <i class="fas fa-star"></i>
                <span>${recipe.difficulty}</span>
            </div>
        </div>
    `;
    
    return card;
}

// Get an appropriate icon for the recipe type
function getRecipeIcon(type) {
    switch (type.toLowerCase()) {
        case 'frühstück':
            return 'fas fa-egg';
        case 'mittagessen':
            return 'fas fa-carrot';
        case 'snack':
            return 'fas fa-apple-alt';
        case 'dessert':
            return 'fas fa-ice-cream';
        default:
            return 'fas fa-utensils';
    }
}

// Display sample recipes if JSON fails to load
function displaySampleRecipes() {
    const sampleRecipes = [
        {
            name: 'Haferbrei mit Löwenzahn',
            type: 'Frühstück',
            ingredients: [
                '50g Haferflocken',
                '150ml Wasser',
                'Eine Handvoll frische Löwenzahnblätter',
                'Ein Teelöffel Leinsamen'
            ],
            instructions: [
                'Haferflocken mit Wasser in einem Topf vermischen.',
                'Bei mittlerer Hitze 3-5 Minuten köcheln lassen.',
                'Löwenzahnblätter waschen und klein schneiden.',
                'Vom Herd nehmen und Löwenzahn untermischen.',
                'Mit Leinsamen bestreuen und servieren.'
            ],
            time: 10,
            difficulty: 'Einfach'
        },
        {
            name: 'Apfelstückchen mit Kräutern',
            type: 'Snack',
            ingredients: [
                '1 Apfel',
                'Frische Petersilie',
                'Frischer Dill',
                'Ein Spritzer Zitronensaft'
            ],
            instructions: [
                'Apfel waschen und in kleine Stücke schneiden.',
                'Kräuter waschen und fein hacken.',
                'Apfelstücke mit Kräutern vermischen.',
                'Mit einem Spritzer Zitronensaft beträufeln.',
                'Sofort servieren oder im Kühlschrank aufbewahren.'
            ],
            time: 5,
            difficulty: 'Sehr einfach'
        },
        {
            name: 'Gemüse-Entensalat',
            type: 'Mittagessen',
            ingredients: [
                'Eine Handvoll Salat (Rucola oder Feldsalat)',
                '1 kleine Gurke',
                '1 kleine Karotte',
                'Einige Erbsen',
                'Ein paar Traubenstücke'
            ],
            instructions: [
                'Salat waschen und in mundgerechte Stücke zupfen.',
                'Gurke und Karotte in kleine Würfel schneiden.',
                'Erbsen kurz in heißem Wasser blanchieren.',
                'Alle Zutaten in einer Schüssel mischen.',
                'Mit ein paar Traubenstücken garnieren.'
            ],
            time: 15,
            difficulty: 'Mittel'
        }
    ];
    
    const recipeContainer = document.querySelector('.recipe-container');
    recipeContainer.innerHTML = '';
    
    sampleRecipes.forEach(recipe => {
        recipeContainer.appendChild(createRecipeCard(recipe));
    });
}

// Load food database from JSON file
function loadFoodDatabase() {
    fetch('/static/data/duck_food.json')
        .then(response => response.json())
        .then(data => {
            foodDatabase = data;
        })
        .catch(error => {
            console.error('Error loading food database:', error);
            // Use sample data if JSON fails to load
            foodDatabase = {
                "Apfel": true,
                "Schokolade": false,
                "Gurke": true,
                "Chips": false,
                "Haferflocken": true,
                "Brot": false,
                "Salat": true,
                "Karotte": true,
                "Trauben": true,
                "Erbsen": true,
                "Petersilie": true,
                "Löwenzahn": true,
                "Zitrone": true,
                "Leinsamen": true,
                "Kürbis": true,
                "Reis": true,
                "Nudeln": false,
                "Käse": false,
                "Milch": false,
                "Samen": true,
                "Körner": true,
                "Sonnenblumenkerne": true
            };
        });
}

// Search for a food item in the database
function searchFood() {
    const searchInput = document.getElementById('food-search');
    const resultContainer = document.getElementById('food-result');
    
    if (!searchInput || !resultContainer) return;
    
    const searchTerm = searchInput.value.trim().toLowerCase();
    
    if (searchTerm === '') {
        resultContainer.innerHTML = `
            <div class="default-message">
                <i class="fas fa-info-circle"></i>
                <p>Gib ein Nahrungsmittel ein, um zu prüfen, ob es für Enten geeignet ist.</p>
            </div>
        `;
        return;
    }
    
    // Check if food exists in database
    let found = false;
    let isEdible = false;
    
    // Convert search term for first letter uppercase (for exact matching)
    const formattedSearchTerm = searchTerm.charAt(0).toUpperCase() + searchTerm.slice(1);
    
    if (foodDatabase.hasOwnProperty(formattedSearchTerm)) {
        found = true;
        isEdible = foodDatabase[formattedSearchTerm];
    } else {
        // Try to find a close match
        for (const food in foodDatabase) {
            if (food.toLowerCase().includes(searchTerm) || searchTerm.includes(food.toLowerCase())) {
                found = true;
                isEdible = foodDatabase[food];
                break;
            }
        }
    }
    
    // Display result
    if (found) {
        if (isEdible) {
            resultContainer.innerHTML = `
                <div class="result-positive">
                    <i class="fas fa-check-circle fa-3x"></i>
                    <div>
                        <h3>Ja, das dürfen Enten essen!</h3>
                        <p>${formattedSearchTerm} ist ein geeignetes Nahrungsmittel für Enten.</p>
                    </div>
                </div>
            `;
            resultContainer.className = 'search-result result-positive';
        } else {
            resultContainer.innerHTML = `
                <div class="result-negative">
                    <i class="fas fa-times-circle fa-3x"></i>
                    <div>
                        <h3>Nein, das sollten Enten nicht essen!</h3>
                        <p>${formattedSearchTerm} ist kein geeignetes Nahrungsmittel für Enten.</p>
                    </div>
                </div>
            `;
            resultContainer.className = 'search-result result-negative';
        }
    } else {
        resultContainer.innerHTML = `
            <div class="result-unknown">
                <i class="fas fa-question-circle fa-3x"></i>
                <div>
                    <h3>Keine Info – lieber nicht geben!</h3>
                    <p>Wir haben keine Informationen zu "${searchTerm}" in unserer Datenbank. Aus Sicherheitsgründen empfehlen wir, dieses Nahrungsmittel nicht zu füttern.</p>
                </div>
            </div>
        `;
        resultContainer.className = 'search-result result-unknown';
    }
    
    // Add animation
    resultContainer.classList.add('fade-in');
    setTimeout(() => {
        resultContainer.classList.remove('fade-in');
    }, 500);
}

// Update weather icons based on condition text
function updateWeatherIcons() {
    const weatherIcon = document.querySelector('.weather-icon i');
    const forecastIcons = document.querySelectorAll('.forecast-day i');
    
    if (weatherIcon) {
        const condition = document.querySelector('.condition').textContent.toLowerCase();
        
        if (condition.includes('sonnig')) {
            weatherIcon.className = 'fas fa-sun';
        } else if (condition.includes('wolke') || condition.includes('bewölkt')) {
            weatherIcon.className = 'fas fa-cloud';
        } else if (condition.includes('regen')) {
            weatherIcon.className = 'fas fa-cloud-rain';
        } else if (condition.includes('schnee')) {
            weatherIcon.className = 'fas fa-snowflake';
        } else if (condition.includes('gewitter')) {
            weatherIcon.className = 'fas fa-bolt';
        } else if (condition.includes('nebel') || condition.includes('neblig')) {
            weatherIcon.className = 'fas fa-smog';
        } else if (condition.includes('wind') || condition.includes('windig')) {
            weatherIcon.className = 'fas fa-wind';
        } else {
            weatherIcon.className = 'fas fa-cloud-sun';
        }
    }
    
    // Forecast icons are already set in HTML
}
