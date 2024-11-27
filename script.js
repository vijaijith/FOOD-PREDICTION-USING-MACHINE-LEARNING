// const searchBtn = document.getElementById('search-btn');
// const mealList = document.getElementById('meal');
// const mealDetailsContent = document.querySelector('.meal-details-content');
// const recipeCloseBtn = document.getElementById('recipe-close-btn');

// // event listeners
// searchBtn.addEventListener('click', getMealList);
// mealList.addEventListener('click', getMealRecipe);
// recipeCloseBtn.addEventListener('click', () => {
//     mealDetailsContent.parentElement.classList.remove('showRecipe');
// });


// // get meal list that matches with the ingredients
// function getMealList(){
//     let searchInputTxt = document.getElementById('search-input').value.trim();
//     fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${searchInputTxt}`)
//     .then(response => response.json())
//     .then(data => {
//         let html = "";
//         if(data.meals){
//             data.meals.forEach(meal => {
//                 html += `
//                     <div class = "meal-item" data-id = "${meal.idMeal}">
//                         <div class = "meal-img">
//                             <img src = "${meal.strMealThumb}" alt = "food">
//                         </div>
//                         <div class = "meal-name">
//                             <h3>${meal.strMeal}</h3>
//                             <a href = "#" class = "recipe-btn">Get Recipe</a>
//                         </div>
//                     </div>
//                 `;
//             });
//             mealList.classList.remove('notFound');
//         } else{
//             html = "Sorry, we didn't find any meal!";
//             mealList.classList.add('notFound');
//         }

//         mealList.innerHTML = html;
//     });
// }


// // get recipe of the meal
// function getMealRecipe(e){
//     e.preventDefault();
//     if(e.target.classList.contains('recipe-btn')){
//         let mealItem = e.target.parentElement.parentElement;
//         fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealItem.dataset.id}`)
//         .then(response => response.json())
//         .then(data => mealRecipeModal(data.meals));
//     }
// }

// // create a modal
// function mealRecipeModal(meal){
//     console.log(meal);
//     meal = meal[0];
//     let html = `
//         <h2 class = "recipe-title">${meal.strMeal}</h2>
//         <p class = "recipe-category">${meal.strCategory}</p>
//         <div class = "recipe-instruct">
//             <h3>Instructions:</h3>
//             <p>${meal.strInstructions}</p>
//         </div>
//         <div class = "recipe-meal-img">
//             <img src = "${meal.strMealThumb}" alt = "">
//         </div>
//         <div class = "recipe-link">
//             <a href = "${meal.strYoutube}" target = "_blank">Watch Video</a>
//         </div>
//     `;
//     mealDetailsContent.innerHTML = html;
//     mealDetailsContent.parentElement.classList.add('showRecipe');
// }


// DOM elements
const searchBtn = document.getElementById('search-btn');
const mealList = document.getElementById('meal');
const mealDetailsContent = document.querySelector('.meal-details-content');
const recipeCloseBtn = document.getElementById('recipe-close-btn');

// Event listeners
searchBtn.addEventListener('click', getMealList);
mealList.addEventListener('click', getMealRecipe);
recipeCloseBtn.addEventListener('click', closeMealDetails);

// Get meal list based on ingredients
function getMealList() {
  const searchInputTxt = document.getElementById('search-input').value.trim();
  const searchIngredients = searchInputTxt.split(',');

  searchIngredients.forEach(ingredient => {
    const ingredientValue = ingredient.trim();
    if (ingredientValue !== '') {
      fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredientValue}`)
        .then(response => response.json())
        .then(data => {
          if (data.meals) {
            displayMealList(data.meals);
          } else {
            displayNoMealsFound();
          }
        })
        .catch(error => {
          console.error('Error:', error);
        });
    }
  });
}

// Display the meal list
function displayMealList(meals) 
{
  let html = '';
  meals.forEach(meal => {
    html += `
      <div class="meal-item" data-id="${meal.idMeal}">
        <div class="meal-img">
          <img src="${meal.strMealThumb}" alt="food">
        </div>
        <div class="meal-name">
          <h3>${meal.strMeal}</h3>
          <a href="#" class="recipe-btn">Get Recipe</a>
        </div>
      </div>
    `;
  });
  mealList.innerHTML = html;
}

// Display a message when no meals are found
function displayNoMealsFound() {
  mealList.innerHTML = "Sorry, we didn't find any meal!";
}

// Get recipe details for a meal
function getMealRecipe(e) {
  e.preventDefault();
  if (e.target.classList.contains('recipe-btn')) {
    const mealItem = e.target.parentElement.parentElement;
    const mealId = mealItem.dataset.id;
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
      .then(response => response.json())
      .then(data => {
        const meal = data.meals[0];
        displayMealRecipe(meal);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }
}

// Display the meal recipe details in a modal
function displayMealRecipe(meal) {
  const html = `
    <h2 class="recipe-title">${meal.strMeal}</h2>
    <p class="recipe-category">${meal.strCategory}</p>
    <div class="recipe-instruct">
      <h3>Instructions:</h3>
      <p>${meal.strInstructions}</p>
    </div>
    <select id="language-select" class="select">
    <option value="de" selected>Select the Language</option>
    <option value="en">English</option>
    <option value="fr">French</option>
    <option value="es">Spanish</option>
    <option value="ml">Malayalam</option>
    <option value="hi">Hindi</option>
</select>
<button id="convert-btn" class="recipe-btn">Convert to Speech</button>
    <div class="recipe-meal-img">
      <img src="${meal.strMealThumb}" alt="">
    </div>
    <div class="recipe-link">
      <a href="${meal.strYoutube}" target="_blank">Watch Video</a>
    </div>
  `;
  mealDetailsContent.innerHTML = html;
  mealDetailsContent.parentElement.classList.add('showRecipe');

  // Add event listener for the speech button
  const speechBtn = document.getElementById('convert-btn');
  speechBtn.addEventListener('click', convertToSpeech);

  // Function to convert text to speech
  function convertToSpeech() {
    const textToSpeak = meal.strInstructions;
    const languageSelect = document.getElementById('language-select');
    const selectedLanguage = languageSelect.value;

    // Create speech synthesis utterance
    const speechUtterance = new SpeechSynthesisUtterance();
    speechUtterance.text = textToSpeak;
    speechUtterance.lang = selectedLanguage;

    // Speak the text
    window.speechSynthesis.speak(speechUtterance);
  }
}

// Close the meal details modal
function closeMealDetails() {
  mealDetailsContent.parentElement.classList.remove('showRecipe');
}
// const searchBtn = document.getElementById('search-btn');
// const mealList = document.getElementById('meal');
// const mealDetailsContent = document.querySelector('.meal-details-content');
// const recipeCloseBtn = document.getElementById('recipe-close-btn');

// // Event listeners
// searchBtn.addEventListener('click', getMealList);
// mealList.addEventListener('click', getMealRecipe);
// recipeCloseBtn.addEventListener('click', closeMealDetails);

// // Get meal list based on ingredients
// function getMealList() {
//   const searchInputTxt = document.getElementById('search-input').value.trim();
//   const searchIngredients = searchInputTxt.split(',');

//   const appId = 'dcd13074';
//   const appKey = '95d4180ea97dbf4cfbc5bbed87bd8570';
//   const url = `https://api.edamam.com/search?app_id=${appId}&app_key=${appKey}&q=${searchIngredients.join(',')}`;

//   fetch(url)
//     .then(response => response.json())
//     .then(data => {
//       if (data.hits.length > 0) {
//         const meals = data.hits.map(hit => hit.recipe);
//         displayMealList(meals);
//       } else {
//         displayNoMealsFound();
//       }
//     })
//     .catch(error => {
//       console.error('Error:', error);
//     });
// }

// // Display the meal list
// function displayMealList(meals) {
//   let html = '';
//   meals.forEach(meal => {
//     html += `
//       <div class="meal-item" data-id="${meal.url}">
//         <div class="meal-img">
//           <img src="${meal.image}" alt="food">
//         </div>
//         <div class="meal-name">
//           <h3>${meal.label}</h3>
//           <a href="#" class="recipe-btn">Get Recipe</a>
//         </div>
//       </div>
//     `;
//   });
//   mealList.innerHTML = html;
// }

// // Display a message when no meals are found
// function displayNoMealsFound() {
//   mealList.innerHTML = "Sorry, we didn't find any meal!";
// }

// // Get recipe details for a meal
// function getMealRecipe(e) {
//   e.preventDefault();
//   if (e.target.classList.contains('recipe-btn')) {
//     const mealItem = e.target.parentElement.parentElement;
//     const mealId = mealItem.dataset.id;
//     fetch(`https://api.edamam.com/search?app_id=${appId}&app_key=${appKey}&r=${encodeURIComponent(mealId)}`)
//       .then(response => response.json())
//       .then(data => {
//         const meal = data[0];
//         displayMealRecipe(meal);
//       })
//       .catch(error => {
//         console.error('Error:', error);
//       });
//   }
// }

// // Display the meal recipe details in a modal
// function displayMealRecipe(meal) {
//   const html = `
//     <h2 class="recipe-title">${meal.label}</h2>
//     <p class="recipe-category">${meal.source}</p>
//     <div class="recipe-instruct">
//       <h3>Instructions:</h3>
//       <p>${meal.instructions}</p>
//     </div>
//     <select id="language-select" class="select">
//       <option value="de" selected>Select the Language</option>
//       <option value="en">English</option>
//       <option value="fr">French</option>
//       <option value="es">Spanish</option>
//       <option value="ml">Malayalam</option>
//       <option value="hi">Hindi</option>
//     </select>
//     <button id="convert-btn" class="recipe-btn">Convert to Speech</button>
//     <div class="recipe-meal-img">
//       <img src="${meal.image}" alt="">
//     </div>
//     <div class="recipe-link">
//       <a href="${meal.url}" target="_blank">View Recipe</a>
//     </div>
//   `;
//   mealDetailsContent.innerHTML = html;
//   mealDetailsContent.parentElement.classList.add('showRecipe');

//   // Add event listener for the speech button
//   const speechBtn = document.getElementById('convert-btn');
//   speechBtn.addEventListener('click', convertToSpeech);

//   // Function to convert text to speech
//   function convertToSpeech() {
//     const textToSpeak = meal.instructions;
//     const languageSelect = document.getElementById('language-select');
//     const selectedLanguage = languageSelect.value;

//     // Create speech synthesis utterance
//     const speechUtterance = new SpeechSynthesisUtterance();
//     speechUtterance.text = textToSpeak;
//     speechUtterance.lang = selectedLanguage;

//     // Speak the text
//     window.speechSynthesis.speak(speechUtterance);
//   }
// }

// // Close the meal details modal
// function closeMealDetails() {
//   mealDetailsContent.parentElement.classList.remove('showRecipe');
// }
