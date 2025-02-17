import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

/**
 * Displays the meal plan data in tabs:
 *   1) Daily Meals (table, Monday→Sunday if present)
 *   2) Nutritional Info (table "per day" but uses the same data for each day)
 *   3) Shopping List (table)
 *   4) Recipes (object with recipe name => details)
 */

function MealPlanDisplay() {
  const navigate = useNavigate();
  const location = useLocation();
  const data = location.state || {};

  // If no "meal_plan," we assume no data was provided
  if (!data.meal_plan) {
    return (
      <div style={{ padding: "1rem" }}>
        <h2>No Meal Plan Data</h2>
        <p>We didn't receive valid data from the server. Please fill out the form first.</p>
        <button onClick={() => navigate("/")}>Go back to Form</button>
      </div>
    );
  }

  const { meal_plan, nutritional_info, shopping_list, recipes } = data;

  const [activeTab, setActiveTab] = useState("Daily Meals");

  // We'll define the standard order of days:
  const dayOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const sortedDays = dayOrder.filter((day) => meal_plan.hasOwnProperty(day));

  // Some simple styles:
  const thStyle = {
    border: "1px solid #ccc",
    padding: "8px",
    background: "#f0f0f0",
    textAlign: "left"
  };
  const tdStyle = {
    border: "1px solid #ccc",
    padding: "8px",
    verticalAlign: "top"
  };

  // Tabs:
  const tabs = ["Daily Meals", "Nutritional Info", "Shopping List", "Recipes"];

  // Render daily meals in a table, sorted Monday → Sunday
  function renderDailyMeals() {
    const mealNames = ["Breakfast", "Lunch", "Dinner"];
    return (
      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <th style={thStyle}>Day</th>
            {mealNames.map((mn) => (
              <th style={thStyle} key={mn}>{mn}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedDays.map((day) => {
            const dayMeals = meal_plan[day] || {};
            return (
              <tr key={day}>
                <td style={tdStyle}><strong>{day}</strong></td>
                {mealNames.map((mn) => (
                  <td style={tdStyle} key={mn}>
                    {dayMeals[mn] ? dayMeals[mn] : "N/A"}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  }

  /**
   * Render nutritional_info in separate tables, per day. 
   * Because your sample snippet doesn't have day-specific numeric data,
   * we repeat the same daily_totals + meal_breakdown for each day in sortedDays.
   */
  function renderNutritionalInfo() {
    if (!nutritional_info) {
      return <p>No nutritional info provided.</p>;
    }

    const { daily_totals, meal_breakdown } = nutritional_info;
    if (!daily_totals && !meal_breakdown) {
      return <p>No nutritional info provided.</p>;
    }

    return (
      <div>
        {sortedDays.length === 0 && <p>No days found in meal_plan to display data.</p>}

        {sortedDays.map((day) => (
          <div key={day} style={{ marginBottom: "2rem" }}>
            <h4 style={{ marginBottom: "0.5rem" }}>{day}</h4>

            {/* Daily Totals Table */}
            {daily_totals ? (
              <table style={{ borderCollapse: "collapse", width: "100%", marginBottom: "1rem" }}>
                <thead>
                  <tr>
                    <th style={thStyle} colSpan={2}>Daily Totals for {day}</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(daily_totals).map(([key, value]) => {
                    if (typeof value === "object" && value !== null) {
                      // Possibly "Macronutrients" or "Micronutrients"
                      return (
                        <tr key={key}>
                          <td style={tdStyle}><strong>{key}</strong></td>
                          <td style={tdStyle}>
                            {Object.entries(value).map(([subK, subV]) => (
                              <div key={subK}>
                                <strong>{subK}:</strong> {subV}
                              </div>
                            ))}
                          </td>
                        </tr>
                      );
                    }
                    return (
                      <tr key={key}>
                        <td style={tdStyle}><strong>{key}</strong></td>
                        <td style={tdStyle}>{value}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <p>No daily totals provided.</p>
            )}

            {/* Meal Breakdown Table */}
            {meal_breakdown ? (
              <table style={{ borderCollapse: "collapse", width: "100%" }}>
                <thead>
                  <tr>
                    <th style={thStyle} colSpan={5}>Meal Breakdown for {day}</th>
                  </tr>
                  <tr>
                    <th style={thStyle}>Meal</th>
                    <th style={thStyle}>Calories</th>
                    <th style={thStyle}>Carbohydrates</th>
                    <th style={thStyle}>Proteins</th>
                    <th style={thStyle}>Fats</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(meal_breakdown).map(([mealName, info]) => {
                    const {
                      Calories = "N/A",
                      Carbohydrates = "N/A",
                      Proteins = "N/A",
                      Fats = "N/A",
                    } = info;
                    return (
                      <tr key={mealName}>
                        <td style={tdStyle}>{mealName}</td>
                        <td style={tdStyle}>{Calories}</td>
                        <td style={tdStyle}>{Carbohydrates}</td>
                        <td style={tdStyle}>{Proteins}</td>
                        <td style={tdStyle}>{Fats}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <p>No meal breakdown data provided.</p>
            )}
          </div>
        ))}
      </div>
    );
  }

  // Shopping List as a table:
  function renderShoppingList() {
    if (!Array.isArray(shopping_list) || shopping_list.length === 0) {
      return <p>No shopping list provided.</p>;
    }
    return (
      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <th style={thStyle}>Ingredient</th>
            <th style={thStyle}>Quantity</th>
          </tr>
        </thead>
        <tbody>
          {shopping_list.map((item, idx) => (
            <tr key={idx}>
              <td style={tdStyle}>{item.ingredient}</td>
              <td style={tdStyle}>{item.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  /**
   * The sample JSON has "recipes" as an object:
   * {
   *   "Chinese Tomato & Egg Stir-Fry with Toast (Monday Breakfast)": {
   *     "ingredients": [...],
   *     "instructions": "..."
   *   },
   *   ...
   * }
   */
  function renderRecipes() {
    if (!recipes || typeof recipes !== "object" || Array.isArray(recipes)) {
      return <p>No recipes provided or invalid format.</p>;
    }
    const recipeEntries = Object.entries(recipes);
    if (recipeEntries.length === 0) {
      return <p>No recipes provided.</p>;
    }
    return (
      <div>
        {recipeEntries.map(([title, details], idx) => {
          if (!details || !details.ingredients || !details.instructions) {
            return (
              <div key={idx} style={{ marginBottom: "1rem" }}>
                <h4>{title}</h4>
                <p>Recipe details incomplete.</p>
              </div>
            );
          }
          return (
            <div key={idx} style={{ marginBottom: "1rem" }}>
              <h4>{title}</h4>
              <p><strong>Ingredients:</strong></p>
              <ul>
                {details.ingredients.map((ing, i2) => (
                  <li key={i2}>{ing}</li>
                ))}
              </ul>
              <p><strong>Instructions:</strong></p>
              <p style={{ whiteSpace: "pre-wrap" }}>{details.instructions}</p>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div style={{ padding: "1rem", maxWidth: "800px", margin: "0 auto" }}>
      <h2>Your Meal Plan</h2>

      <div style={{ marginBottom: "1rem" }}>
        {tabs.map((tabName) => (
          <button
            key={tabName}
            onClick={() => setActiveTab(tabName)}
            style={{
              marginRight: "0.5rem",
              padding: "0.5rem 1rem",
              background: activeTab === tabName ? "#ccc" : "#eee",
            }}
          >
            {tabName}
          </button>
        ))}
      </div>

      <div style={{ border: "1px solid #ccc", padding: "1rem", minHeight: "300px" }}>
        {activeTab === "Daily Meals" && renderDailyMeals()}
        {activeTab === "Nutritional Info" && renderNutritionalInfo()}
        {activeTab === "Shopping List" && renderShoppingList()}
        {activeTab === "Recipes" && renderRecipes()}
      </div>

      <div style={{ marginTop: "1rem" }}>
        <button onClick={() => navigate("/")}>Go back to Form</button>
      </div>
    </div>
  );
}

export default MealPlanDisplay;
