const searchBox = document.getElementById("searchBox");
const searchBtn = document.getElementById("searchBtn");
const recipeContainer = document.querySelector(".recipeContainer");
const recipeCloseBtn = document.querySelector(".recipeCloseBtn");
const recipeDetailsContent = document.querySelector(".recipeDetailsContent");

let fetchRecipes = async (query) => {
    recipeContainer.innerHTML = "<h2> Fetching details...</h2>";
    try {
        let data = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`)
        let response = await data.json();
        console.log(response);

        recipeContainer.innerHTML = ""
        response.meals.forEach(meal => {
            let displayRecipes = document.createElement("div");
            displayRecipes.classList.add("recipes");
            displayRecipes.innerHTML = `
        <img src = "${meal.strMealThumb}">
        <h3>${meal.strMeal}</h3>
        <p><span>${meal.strArea}</span> Dish</p>
        <p>Belongs to <span>${meal.strCategory} </span> Category</p>
        `

            let button = document.createElement("button");
            button.textContent = "View Recipe";

            displayRecipes.appendChild(button);
            recipeContainer.appendChild(displayRecipes);

            button.addEventListener("click", () => {
                openDisplayPopup(meal);
            })
        })
    } catch (error) {
        recipeContainer.innerHTML = "<h2>Error in fetching meal...</h2>"
    }
}

const fetchRecipesIngredients = (meal) => {
    let ingredientList = "";
    for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        if (ingredient) {
            const measure = meal[`strMeasure${i}`];
            ingredientList += `<li>${measure} ${ingredient}</li>`
        } else {
            break;
        }
    }
    return ingredientList;
}

const openDisplayPopup = (meal) => {
    recipeDetailsContent.innerHTML = `
    <h2 class="recipeName">${meal.strMeal}</h2>
    <h3>Ingredients :</h3>
    <ul class="ingredientList">${fetchRecipesIngredients(meal)}</ul><br>
    <div class="recipeInstructions">
        <h3>Instructions :</h3>
        <p>${meal.strInstructions}</p>
    </div>
    `
    recipeDetailsContent.parentElement.style.display = "block";
}

recipeCloseBtn.addEventListener("click", () => {
    recipeDetailsContent.parentElement.style.display = "none";
})

searchBtn.addEventListener("click", (e) => {
    e.preventDefault();
    let searchValue = searchBox.value.trim();
    if (!searchValue) {
        recipeContainer.innerHTML = "<h2>Please enter meal in the search box.</h2>";
        return;
    }
    fetchRecipes(searchValue);
})