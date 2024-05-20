import { AirComponent, createState, html, airCss } from '../air-js/core/air.js';

export const RecipeFinder = AirComponent('recipe-finder', function() {
  const [recipes, setRecipes] = createState([]);
  const [selectedRecipe, setSelectedRecipe] = createState(null);
  const [searchTerm, setSearchTerm] = createState('');

  const componentTheme = {
    colors: {
      primary: '#4CAF50',
      secondary: '#FFC107'
    },
    fontSize: '14pt',
    background: {
      color: '#f9f9f9'
    }
  };
  
  const { colors: { primary, secondary }, fontSize, background } = componentTheme;

  const styles = {
    appStyles: airCss({
        background: {
          ...background
        },
        font: {
          size: fontSize,
          color: '#333'
        },
        padding: {
          left: '15px',
          right: '15px',
          top: '10px',
          bottom: '10px'
        },
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
    }),
    recipeListStyles: airCss({
        padding: '0',
        margin: '0',
        font: {
            size: '12pt',
            color: '#555'
        }
    }),
    liStyle: airCss({
        padding: '10px',
        margin: '5px 0',
        backgroundColor: '#fff',
        borderRadius: '5px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        cursor: 'pointer',
        __hover:{
            font:{
                color: "magenta",
                size: "69pt"
            },
            opacity: "0.5",
            backgroundColor: "black !important"
        }
    })
}

  
  const handleSearch = () => {
    // Dummy data to simulate recipe search
    const dummyRecipes = [
      { name: 'Spaghetti Carbonara', ingredients: 'Spaghetti, Eggs, Cheese, Bacon', instructions: 'Boil pasta, cook bacon, mix with eggs and cheese.' },
      { name: 'Chicken Salad', ingredients: 'Chicken, Lettuce, Tomatoes, Cucumber', instructions: 'Mix all ingredients together with dressing.' },
      { name: 'Beef Stew', ingredients: 'Beef, Potatoes, Carrots, Onion', instructions: 'Slow cook beef with vegetables.' }
    ];
    const filteredRecipes = dummyRecipes.filter(recipe => recipe.ingredients.toLowerCase().includes(searchTerm.toLowerCase()));
    console.log("filtered: ", filteredRecipes)
    setRecipes(filteredRecipes);
  };
  //selectedRecipe.onUpdate(e=>console.log("set recipe to: ", selectedRecipe))
  return ()=>html`
    <div class="recipe-finder" style="${styles.appStyles}">
      <h1 class="title">Recipe Finder</h1>
      <input 
        type="text" 
        placeholder="Search by ingredient..." 
        oninput="${(e) => setSearchTerm(e.target.value)}" 
        style="padding: 10px; width: calc(100% - 22px); border-radius: 5px; border: 1px solid #ccc; margin-bottom: 20px;"
      />
      <button onclick="${handleSearch}" style="padding: 10px 20px; background-color: ${primary}; color: #fff; border: none; border-radius: 5px; cursor: pointer;">Search</button>
      <ul class="recipe-list" style="${styles.recipeListStyles}">
        ${recipes.map(recipe => html`
          <li style="${styles.liStyle}" onclick="${() => setSelectedRecipe(recipe)}">${recipe.name}</li>
        `)}
      </ul>
      ${selectedRecipe.get ? html`
        <div class="recipe-details" style="margin-top: 20px;">
          <h2>${selectedRecipe.name}</h2>
          <p><strong>Ingredients:</strong> ${selectedRecipe.ingredients}</p>
          <p><strong>Instructions:</strong> ${selectedRecipe.instructions}</p>
        </div>
      ` : ''}
    </div>
  `;
});
