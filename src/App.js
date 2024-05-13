import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import recipes from "./recipes.json";
import "./App.css";

const App = () => {
  const allIngredients = Array.from(new Set(Object.values(recipes).flat())).sort();

  // Initialize ingredients state from cookies or as false
  const initialIngredientsState = allIngredients.reduce((acc, ingredient) => {
    const cookieState = Cookies.get(ingredient);
    acc[ingredient] = cookieState ? cookieState === "true" : false;
    return acc;
  }, {});

  const [ingredients, setIngredients] = useState(initialIngredientsState);
  const [canMake, setCanMake] = useState([]);

  useEffect(() => {
    // Save ingredient state to cookies whenever it changes
    allIngredients.forEach(ingredient => {
      Cookies.set(ingredient, ingredients[ingredient], { expires: 365 }); // Cookie expires in 1 year
    });
  }, [ingredients, allIngredients]);

  const handleIngredientClick = (ingredient) => {
    setIngredients({
      ...ingredients,
      [ingredient]: !ingredients[ingredient],
    });
  };

  const handleReset = () => {
    setIngredients(allIngredients.reduce((acc, ingredient) => {
      acc[ingredient] = false;
      return acc;
    }, {}));
  };

  const handleSelectAll = () => {
    setIngredients(allIngredients.reduce((acc, ingredient) => {
      acc[ingredient] = true;
      return acc;
    }, {}));
  };

  const getActiveIngredients = (supply) => {
    return Object.keys(supply).filter((ingredient) => supply[ingredient]);
  };

  const hasNecessaryIngredients = (requiredIngredients, activeIngredients) => {
    // Filter the required ingredients to only include those the player has
    const count = requiredIngredients.filter(ingredient => activeIngredients.includes(ingredient)).length;
    
    // Check if the player has at least two of the required ingredients
    return count >= 2;
  };
  

  const checkPotions = () => {
    const activeIngredients = getActiveIngredients(ingredients);
    const canMakePotions = [];
    for (const potion in recipes) {
      if (hasNecessaryIngredients(recipes[potion], activeIngredients)) {
        canMakePotions.push(potion);
      }
    }
    setCanMake(canMakePotions);
  };

  return (
    <div className="App">
      <h1>Potion Maker</h1>
      <h2>Select your ingredients:</h2>
      <div className="ingredient-buttons">
        {allIngredients.map((ingredient) => (
          <button
            key={ingredient}
            onClick={() => handleIngredientClick(ingredient)}
            className={ingredients[ingredient] ? "active" : ""}
          >
            {ingredient}
          </button>
        ))}
      </div>
      <button onClick={handleReset}>Reset</button>
      <button onClick={handleSelectAll}>Select All</button>
      <button onClick={checkPotions}>Check Potions</button>
      <h2>Available Potions:</h2>
      <table>
        <thead>
          <tr>
            <th>Potion</th>
            <th>Ingredients</th>
          </tr>
        </thead>
        <tbody>
          {canMake.length === 0 ? (
            <tr>
              <td colSpan="2">No potions can be made</td>
            </tr>
          ) : (
            canMake.map((potion) => (
              <tr key={potion}>
                <td>{potion}</td>
                <td>{recipes[potion].filter((ingredient) => ingredients[ingredient]).join(", ")}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default App;
