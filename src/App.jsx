import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MealPrepForm from "./MealPrepForm";
import MealPlanDisplay from "./MealPlanDisplay";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Home route shows the meal prep form */}
        <Route path="/" element={<MealPrepForm />} />

        {/* The meal plan display route, used after the form is submitted */}
        <Route path="/mealplan" element={<MealPlanDisplay />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
