import React, { useState } from "react";
import recipes from "./recipes.json";
import initialIngredients from "./ingredients.json";
import "./App.css";

const App = () => {
  const [ingredients, setIngredients] = useState(initialIngredients);
  const [canMake, setCanMake] = useState([]);

  const getAllIngredients = (supply) => {
    return Object.keys(supply).filter((ingredient) => supply[ingredient] > 0);
  };

  const hasNecessaryIngredients = (requiredIngredients, allIngredients) => {
    let hasCount = 0;
    requiredIngredients.forEach((ingredient) => {
      if (allIngredients.includes(ingredient)) {
        hasCount += 1;
      }
    });
    return hasCount >= 2;
  };

  const trimListToMySupply = (myAvailableIngredients, allUseableIngredients) => {
    const mySupply = myAvailableIngredients.filter((ingredient) =>
      allUseableIngredients.includes(ingredient)
    );
    return mySupply.sort();
  };

  const checkPotions = () => {
    const allAvailableIngredients = getAllIngredients(ingredients);
    const canMakePotions = [];
    for (const potion in recipes) {
      if (hasNecessaryIngredients(recipes[potion], allAvailableIngredients)) {
        canMakePotions.push([
          potion,
          trimListToMySupply(allAvailableIngredients, recipes[potion]),
        ]);
      }
    }
    setCanMake(canMakePotions);
  };

  const resetIngredients = () => {
    const reset = window.confirm(
      "Are you sure you want to clear your ingredients?"
    );
    if (reset) {
      const clearedIngredients = {};
      Object.keys(ingredients).forEach((key) => {
        clearedIngredients[key] = 0;
      });
      setIngredients(clearedIngredients);
      setCanMake([]);
    }
  };

  return (
    <div className="App">
      <h1>Potion Maker</h1>
      <button onClick={checkPotions}>Check Potions</button>
      <button onClick={resetIngredients}>Reset Ingredients</button>
      <h2>Available Potions:</h2>
      {canMake.length === 0 ? (
        <p>No potions can be made</p>
      ) : (
        <ul>
          {canMake.map((potion) => (
            <li key={potion[0]}>
              {potion[0]}: {potion[1].join(", ")}
            </li>
          ))}
        </ul>
      )}
      <h2>Current Ingredients:</h2>
      <ul>
        {Object.entries(ingredients).map(([ingredient, count]) => (
          <li key={ingredient}>
            {ingredient}: {count}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
