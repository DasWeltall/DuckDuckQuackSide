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
    
    // Add event listener for more recipes button
    const moreRecipesBtn = document.getElementById('more-recipes');
    if (moreRecipesBtn) {
        moreRecipesBtn.addEventListener('click', loadMoreRecipes);
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
    updateCurrentTime();
    setInterval(updateCurrentTime, 60000); // Update time every minute
    
    // Calendar Functionality
    initCalendarTabs();
    
    // Checklist Functionality
    initChecklist();
});

// Global variables to store data
let recipes = [];
let foodDatabase = {};
let additionalRecipes = false;

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
    
    const additionalSampleRecipes = [
        {
            name: 'Entenfreundlicher Kürbisbrei',
            type: 'Mittagessen',
            ingredients: [
                'Eine Tasse gewürfelter Kürbis',
                '1/4 Tasse Haferflocken',
                'Etwas Petersilie',
                'Ein paar Tropfen Olivenöl'
            ],
            instructions: [
                'Kürbis kochen oder dämpfen, bis er weich ist.',
                'Mit einer Gabel zerdrücken und abkühlen lassen.',
                'Haferflocken und gehackte Petersilie untermischen.',
                'Mit ein paar Tropfen Olivenöl verfeinern.',
                'In kleine Portionen teilen und servieren.'
            ],
            time: 20,
            difficulty: 'Mittel'
        },
        {
            name: 'Beerenmischung mit Samen',
            type: 'Dessert',
            ingredients: [
                'Eine Handvoll gemischte Beeren',
                'Ein Teelöffel Sonnenblumenkerne',
                'Ein Teelöffel Leinsamen',
                'Etwas Minze'
            ],
            instructions: [
                'Beeren waschen und halbieren oder vierteln (je nach Größe).',
                'Samen vorsichtig untermischen.',
                'Minzblätter in feine Streifen schneiden.',
                'Alles vorsichtig vermengen und servieren.'
            ],
            time: 8,
            difficulty: 'Einfach'
        },
        {
            name: 'Kräuter-Gemüsebällchen',
            type: 'Mittagessen',
            ingredients: [
                'Eine kleine Karotte',
                'Eine halbe Zucchini',
                'Frische Kräuter (Dill, Petersilie)',
                'Ein Teelöffel Haferflocken',
                'Ein Spritzer Zitronensaft'
            ],
            instructions: [
                'Karotte und Zucchini fein reiben.',
                'Kräuter waschen und fein hacken.',
                'Alle Zutaten in einer Schüssel vermischen.',
                'Mit den Händen kleine Bällchen formen.',
                'Auf einem Teller anrichten und servieren.'
            ],
            time: 15,
            difficulty: 'Mittel'
        },
        {
            name: 'Wasserkresse-Salat',
            type: 'Vorspeise',
            ingredients: [
                'Eine Handvoll Wasserkresse',
                'Einige Gurken- und Karottenscheiben',
                'Einige Traubenstücke',
                'Einige Löwenzahnblätter'
            ],
            instructions: [
                'Alle Zutaten gründlich waschen.',
                'Gurke und Karotte in dünne Scheiben schneiden.',
                'Trauben halbieren.',
                'Alles vorsichtig mischen und sofort servieren.'
            ],
            time: 10,
            difficulty: 'Einfach'
        },
        {
            name: 'Entennest aus Körnern',
            type: 'Snack',
            ingredients: [
                'Eine Handvoll gemischter Körner (Hirse, Buchweizen)',
                'Etwas Apfel, fein gewürfelt',
                'Einige Traubenstücke',
                'Ein Spritzer Wasser'
            ],
            instructions: [
                'Körner in eine kleine Schüssel geben.',
                'Apfel und Trauben in sehr kleine Stücke schneiden.',
                'Alle Zutaten mischen und mit etwas Wasser befeuchten.',
                'Die Mischung in eine Nestform bringen.',
                'Kalt servieren.'
            ],
            time: 12,
            difficulty: 'Einfach'
        }
    ];
    
    const recipeContainer = document.querySelector('.recipe-container');
    recipeContainer.innerHTML = '';
    
    // Display default or additional recipes
    const recipesToShow = additionalRecipes ? additionalSampleRecipes : sampleRecipes;
    
    recipesToShow.forEach(recipe => {
        recipeContainer.appendChild(createRecipeCard(recipe));
    });
}

// Function to load more recipes
function loadMoreRecipes() {
    additionalRecipes = !additionalRecipes;
    const moreRecipesBtn = document.getElementById('more-recipes');
    
    if (additionalRecipes) {
        moreRecipesBtn.innerHTML = '<i class="fas fa-chevron-left"></i> Zurück zu Standardrezepten';
    } else {
        moreRecipesBtn.innerHTML = '<i class="fas fa-plus"></i> Mehr Rezepte';
    }
    
    displaySampleRecipes();
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

// Update current time in the weather section
function updateCurrentTime() {
    const currentTimeElement = document.getElementById('current-time');
    const windSpeedElement = document.getElementById('wind-speed');
    
    if (currentTimeElement) {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        currentTimeElement.textContent = `${hours}:${minutes}`;
        
        // Update wind speed randomly for simulation
        if (windSpeedElement) {
            const windLevels = ['Leicht', 'Mäßig', 'Stark'];
            const randomWindIndex = Math.floor(Math.random() * 3);
            windSpeedElement.textContent = windLevels[randomWindIndex];
        }
    }
}

// Initialize tabs for seasonal foods in the calendar section
function initCalendarTabs() {
    const seasonTabs = document.querySelectorAll('.season-tab');
    const seasonContents = document.querySelectorAll('.season-content');
    
    if (seasonTabs.length > 0) {
        seasonTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Remove active class from all tabs and contents
                seasonTabs.forEach(t => t.classList.remove('active'));
                seasonContents.forEach(content => content.classList.remove('active'));
                
                // Add active class to clicked tab and corresponding content
                tab.classList.add('active');
                const season = tab.getAttribute('data-season');
                document.getElementById(`${season}-content`).classList.add('active');
            });
        });
    }
    
    // Add event listeners for calendar navigation
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');
    
    if (prevMonthBtn && nextMonthBtn) {
        const months = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
        let currentMonthIndex = 4; // May (0-based index)
        let currentYear = 2025;
        
        prevMonthBtn.addEventListener('click', () => {
            currentMonthIndex = currentMonthIndex > 0 ? currentMonthIndex - 1 : 11;
            if (currentMonthIndex === 11) currentYear--;
            updateCalendarHeader();
        });
        
        nextMonthBtn.addEventListener('click', () => {
            currentMonthIndex = currentMonthIndex < 11 ? currentMonthIndex + 1 : 0;
            if (currentMonthIndex === 0) currentYear++;
            updateCalendarHeader();
        });
        
        function updateCalendarHeader() {
            const calendarTitle = document.querySelector('.calendar-nav h3');
            if (calendarTitle) {
                calendarTitle.textContent = `${months[currentMonthIndex]} ${currentYear}`;
            }
        }
    }
}

// Initialize checklist functionality
function initChecklist() {
    const taskCheckboxes = document.querySelectorAll('.task-checkbox');
    const resetButton = document.getElementById('reset-checklist');
    const dailyProgressBar = document.getElementById('daily-progress');
    const weeklyProgressBar = document.getElementById('weekly-progress');
    
    // Load saved state from localStorage if available
    loadChecklistState();
    
    if (taskCheckboxes.length > 0) {
        taskCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                updateProgress();
                saveChecklistState();
            });
        });
    }
    
    if (resetButton) {
        resetButton.addEventListener('click', () => {
            taskCheckboxes.forEach(checkbox => {
                checkbox.checked = false;
            });
            updateProgress();
            saveChecklistState();
        });
    }
    
    function updateProgress() {
        const dailyTasks = document.querySelectorAll('.daily-checklist .task-checkbox');
        const weeklyTasks = document.querySelectorAll('.weekly-checklist .task-checkbox');
        
        const dailyCompleted = Array.from(dailyTasks).filter(task => task.checked).length;
        const weeklyCompleted = Array.from(weeklyTasks).filter(task => task.checked).length;
        
        const dailyPercentage = Math.round((dailyCompleted / dailyTasks.length) * 100);
        const weeklyPercentage = Math.round((weeklyCompleted / weeklyTasks.length) * 100);
        
        if (dailyProgressBar) {
            dailyProgressBar.style.width = `${dailyPercentage}%`;
            dailyProgressBar.textContent = `${dailyPercentage}%`;
        }
        
        if (weeklyProgressBar) {
            weeklyProgressBar.style.width = `${weeklyPercentage}%`;
            weeklyProgressBar.textContent = `${weeklyPercentage}%`;
        }
    }
    
    function saveChecklistState() {
        const state = {};
        taskCheckboxes.forEach(checkbox => {
            state[checkbox.id] = checkbox.checked;
        });
        localStorage.setItem('duckCareChecklist', JSON.stringify(state));
    }
    
    function loadChecklistState() {
        const savedState = localStorage.getItem('duckCareChecklist');
        if (savedState) {
            const state = JSON.parse(savedState);
            taskCheckboxes.forEach(checkbox => {
                if (state[checkbox.id] !== undefined) {
                    checkbox.checked = state[checkbox.id];
                }
            });
            updateProgress();
        }
    }
}
