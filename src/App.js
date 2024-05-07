import React, { useState } from "react";
import recipes from "./recipes.json";
import "./App.css";

const App = () => {
  const [ingredients, setIngredients] = useState({});
  const [canMake, setCanMake] = useState([]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setIngredients({ ...ingredients, [name]: Number(value) });
  };

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

  const ingredientList = Array.from(
    new Set(Object.values(recipes).flat())
  ).sort();

  return (
    <div className="App">
      <h1>Potion Maker</h1>
      <h2>Enter your ingredient quantities:</h2>
      <div className="ingredient-inputs">
        {ingredientList.map((ingredient) => (
          <div key={ingredient}>
            <label>{ingredient}:</label>
            <input
              type="number"
              name={ingredient}
              min="0"
              value={ingredients[ingredient] || ""}
              onChange={handleInputChange}
            />
          </div>
        ))}
      </div>
      <button onClick={checkPotions}>Check Potions</button>
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
    </div>
  );
};

export default App;
