// src/MealPrepApp.jsx
import React, { useState } from 'react';
import axios from 'axios';

// Helper to calculate age from a Date object
function calculateAgeFromDOB(dob) {
  const today = new Date();
  const birthDate = new Date(dob);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

// Common lists for checkboxes and selects
const COMMON_MEDICAL_CONDITIONS = [
  'Hypertension',
  'Dyslipidemia',
  'Elevated Fasting Glucose',
  'Chronic Kidney Disease',
  'Heart Disease',
  'Diabetes',
  'None',
];

const PHYSICAL_ACTIVITY_LEVELS = [
  'Sedentary',
  'Lightly Active',
  'Moderately Active',
  'Very Active',
  'Extra Active',
];

const DIETARY_GOALS = [
  'Lose weight',
  'Gain muscle',
  'Maintain weight',
  'Improve blood pressure',
  'Improve fasting blood glucose',
  'Manage cholesterol',
];

const COOKING_TIME_OPTIONS = [
  'Very Quick (15 min or less)',
  'Quick (15-30 min)',
  'Moderate (30-45 min)',
  'Long (45+ min)',
];

const CUISINE_OPTIONS = [
  'American',
  'Mexican',
  'Italian',
  'Chinese',
  'Indian',
  'Mediterranean',
  'French',
  'Japanese',
  'Thai',
  'Other',
];

const COMMON_FOODS = [
  'Spinach',
  'Bananas',
  'Broccoli',
  'Peanuts',
  'Seafood',
  'Dairy',
  'Eggs',
  'Wheat',
];

const COMMON_ALLERGIES = [
  'Peanuts',
  'Tree Nuts',
  'Dairy',
  'Eggs',
  'Shellfish',
  'Wheat',
  'Soy',
  'Fish',
];

const COMMON_INTOLERANCES = [
  'Lactose',
  'Gluten',
  'FODMAPs',
];

const RELIGIOUS_RESTRICTIONS = [
  'None',
  'Catholic (no meat on Fridays)',
  'Kosher (Jewish)',
  'Halal (Islam)',
  'Hindu (no beef)',
  'Buddhist (often vegetarian)',
];

const steps = [
  'Demographics',
  'Medical Conditions',
  'Physical Activity & Goals',
  'Cooking & Dislikes',
  'Snacks & Meals',
  'Dietary Restrictions',
  'Budget',
];

const MealPrepApp = () => {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [responseData, setResponseData] = useState(null);

  // Form data
  const [formData, setFormData] = useState({
    // Step 0: Demographics
    dateOfBirth: '',
    age: 60,
    sex: 'female',
    weight: 180, // lbs
    heightFeet: 5,
    heightInches: 3,
    isPregnant: false,
    isBreastFeeding: false,

    // Step 1: Medical Conditions
    medicalConditions: [], // e.g. ['Hypertension', 'Diabetes']
    otherMedicalCondition: '',
    eGFR: 25,
    dialysis: false,

    // Step 2: Physical Activity & Goals
    physicalActivity: 'Sedentary',
    dietaryGoals: [],
    otherDietaryGoal: '',

    // Step 3: Cooking Preferences & Dislikes
    cookingTime: 'Quick (15-30 min)',
    preferredCuisine: 'Mexican',
    dislikes: [],
    otherDislike: '',
    mealPlanDays: [],

    // Step 4: Snacks & Meal Preferences
    snacksPerDay: 1,
    servings: 1,
    breakfastPreference: 'different', // or 'batch'
    lunchPreference: 'use leftovers', // or 'cook fresh'
    dinnerPreference: 'cook fresh & save leftovers', // or 'batch cook'

    // Step 5: Dietary Restrictions
    allergies: [],
    otherAllergy: '',
    intolerances: [],
    otherIntolerance: '',
    religiousRestrictions: 'None',

    // Step 6: Budget
    budget: '',
  });

  const handleStepChange = (newStep) => {
    setStep(newStep);
  };

  const handleDOBChange = (e) => {
    const dobValue = e.target.value;
    const newAge = calculateAgeFromDOB(dobValue);
    setFormData({
      ...formData,
      dateOfBirth: dobValue,
      age: newAge,
    });
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: checked,
      });
    } else if (type === 'number') {
      setFormData({
        ...formData,
        [name]: Number(value),
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleCheckboxGroupChange = (e, fieldName) => {
    const { value, checked } = e.target;
    let newArray = [...formData[fieldName]];
    if (checked) {
      // add the item
      newArray.push(value);
    } else {
      // remove the item
      newArray = newArray.filter((item) => item !== value);
    }
    setFormData({
      ...formData,
      [fieldName]: newArray,
    });
  };

  const handleMealPlanDaysChange = (day) => {
    let newDays = [...formData.mealPlanDays];
    if (newDays.includes(day)) {
      newDays = newDays.filter((d) => d !== day);
    } else {
      newDays.push(day);
    }
    setFormData({
      ...formData,
      mealPlanDays: newDays,
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/mealplan', formData);
      setResponseData(res.data);
    } catch (err) {
      console.error('Error generating meal plan:', err);
    }
    setLoading(false);
  };

  // Renders each step of the form
  const renderStep = () => {
    switch (step) {
      case 0:
        // Demographics
        return (
          <div>
            <h2>Demographics</h2>
            <label>
              Date of Birth:
              <input
                name="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={handleDOBChange}
              />
            </label>
            <p>Calculated Age: {formData.age}</p>

            <label>
              Sex:
              <select
                name="sex"
                value={formData.sex}
                onChange={handleFormChange}
              >
                <option value="female">Female</option>
                <option value="male">Male</option>
              </select>
            </label>
            <br />

            <label>
              Weight (lbs):
              <input
                name="weight"
                type="number"
                value={formData.weight}
                onChange={handleFormChange}
              />
            </label>
            <br />

            <label>
              Height:
              <div style={{ display: 'inline-block', marginLeft: '8px' }}>
                <select
                  name="heightFeet"
                  value={formData.heightFeet}
                  onChange={handleFormChange}
                  style={{ width: '60px', marginRight: '5px' }}
                >
                  {[...Array(8)].map((_, i) => (
                    <option key={i} value={i + 1}>
                      {i + 1} ft
                    </option>
                  ))}
                </select>
                <select
                  name="heightInches"
                  value={formData.heightInches}
                  onChange={handleFormChange}
                  style={{ width: '60px' }}
                >
                  {[...Array(12)].map((_, i) => (
                    <option key={i} value={i}>
                      {i} in
                    </option>
                  ))}
                </select>
              </div>
            </label>
            <br />

            <label>
              Pregnant:
              <input
                name="isPregnant"
                type="checkbox"
                checked={formData.isPregnant}
                onChange={handleFormChange}
              />
            </label>
            <br />

            <label>
              Breastfeeding:
              <input
                name="isBreastFeeding"
                type="checkbox"
                checked={formData.isBreastFeeding}
                onChange={handleFormChange}
              />
            </label>
            <br />

            <button onClick={() => handleStepChange(step + 1)}>Next</button>
          </div>
        );

      case 1:
        // Medical Conditions
        return (
          <div>
            <h2>Medical Conditions</h2>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {COMMON_MEDICAL_CONDITIONS.map((condition) => (
                <label key={condition}>
                  <input
                    type="checkbox"
                    value={condition}
                    checked={formData.medicalConditions.includes(condition)}
                    onChange={(e) => handleCheckboxGroupChange(e, 'medicalConditions')}
                  />
                  {condition}
                </label>
              ))}
            </div>
            <label>
              Other:
              <input
                type="text"
                name="otherMedicalCondition"
                value={formData.otherMedicalCondition}
                onChange={handleFormChange}
                placeholder="e.g. PCOS"
              />
            </label>
            <br />

            <label>
              eGFR (if CKD):
              <input
                name="eGFR"
                type="number"
                value={formData.eGFR}
                onChange={handleFormChange}
              />
            </label>
            <br />

            <label>
              Dialysis:
              <input
                name="dialysis"
                type="checkbox"
                checked={formData.dialysis}
                onChange={handleFormChange}
              />
            </label>
            <br />

            <button onClick={() => handleStepChange(step - 1)}>Back</button>
            <button onClick={() => handleStepChange(step + 1)}>Next</button>
          </div>
        );

      case 2:
        // Physical Activity & Dietary Goals
        return (
          <div>
            <h2>Physical Activity & Dietary Goals</h2>
            <label>
              Physical Activity Level:
              <select
                name="physicalActivity"
                value={formData.physicalActivity}
                onChange={handleFormChange}
              >
                {PHYSICAL_ACTIVITY_LEVELS.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </label>
            <br />

            <label>Dietary Goals:</label>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {DIETARY_GOALS.map((goal) => (
                <label key={goal}>
                  <input
                    type="checkbox"
                    value={goal}
                    checked={formData.dietaryGoals.includes(goal)}
                    onChange={(e) => handleCheckboxGroupChange(e, 'dietaryGoals')}
                  />
                  {goal}
                </label>
              ))}
            </div>
            <label>
              Other:
              <input
                type="text"
                name="otherDietaryGoal"
                value={formData.otherDietaryGoal}
                onChange={handleFormChange}
                placeholder="e.g. Lower sodium"
              />
            </label>
            <br />

            <button onClick={() => handleStepChange(step - 1)}>Back</button>
            <button onClick={() => handleStepChange(step + 1)}>Next</button>
          </div>
        );

      case 3:
        // Cooking Time, Cuisine, Foods Disliked, Meal Plan Days
        return (
          <div>
            <h2>Cooking Preferences & Disliked Foods</h2>

            <label>
              Cooking Time Preference:
              <select
                name="cookingTime"
                value={formData.cookingTime}
                onChange={handleFormChange}
              >
                {COOKING_TIME_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
            <br />

            <label>
              Preferred Cuisine:
              <select
                name="preferredCuisine"
                value={formData.preferredCuisine}
                onChange={handleFormChange}
              >
                {CUISINE_OPTIONS.map((cuisine) => (
                  <option key={cuisine} value={cuisine}>
                    {cuisine}
                  </option>
                ))}
              </select>
            </label>
            <br />

            <label>Foods Disliked:</label>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {COMMON_FOODS.map((food) => (
                <label key={food}>
                  <input
                    type="checkbox"
                    value={food}
                    checked={formData.dislikes.includes(food)}
                    onChange={(e) => handleCheckboxGroupChange(e, 'dislikes')}
                  />
                  {food}
                </label>
              ))}
            </div>
            <label>
              Other:
              <input
                type="text"
                name="otherDislike"
                value={formData.otherDislike}
                onChange={handleFormChange}
                placeholder="e.g. Cilantro"
              />
            </label>
            <br />

            <label>Meal Plan Days:</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              {['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'].map((day) => (
                <label key={day}>
                  <input
                    type="checkbox"
                    checked={formData.mealPlanDays.includes(day)}
                    onChange={() => handleMealPlanDaysChange(day)}
                  />
                  {day}
                </label>
              ))}
            </div>
            <br />

            <button onClick={() => handleStepChange(step - 1)}>Back</button>
            <button onClick={() => handleStepChange(step + 1)}>Next</button>
          </div>
        );

      case 4:
        // Snacks, Number of People, Breakfast/Lunch/Dinner Preferences
        return (
          <div>
            <h2>Snacks & Meal Preferences</h2>

            <label>
              Snacks per Day:
              <select
                name="snacksPerDay"
                value={formData.snacksPerDay}
                onChange={handleFormChange}
              >
                {[1,2,3].map((num) => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
            </label>
            <br />

            <label>
              Number of People (servings):
              <select
                name="servings"
                value={formData.servings}
                onChange={handleFormChange}
              >
                {[1,2,3,4,5,6].map((num) => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
            </label>
            <br />

            <label>
              Breakfast Preference:
              <select
                name="breakfastPreference"
                value={formData.breakfastPreference}
                onChange={handleFormChange}
              >
                <option value="different">Different every day</option>
                <option value="batch">Batch prepared</option>
              </select>
            </label>
            <br />

            <label>
              Lunch Preference:
              <select
                name="lunchPreference"
                value={formData.lunchPreference}
                onChange={handleFormChange}
              >
                <option value="use leftovers">Use leftovers</option>
                <option value="cook fresh">Cook fresh daily</option>
              </select>
            </label>
            <br />

            <label>
              Dinner Preference:
              <select
                name="dinnerPreference"
                value={formData.dinnerPreference}
                onChange={handleFormChange}
              >
                <option value="cook fresh & save leftovers">
                  Cook fresh & save leftovers
                </option>
                <option value="batch cook">Batch cook for the week</option>
              </select>
            </label>
            <br />

            <button onClick={() => handleStepChange(step - 1)}>Back</button>
            <button onClick={() => handleStepChange(step + 1)}>Next</button>
          </div>
        );

      case 5:
        // Dietary Restrictions
        return (
          <div>
            <h2>Dietary Restrictions</h2>

            <label>Allergies:</label>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {COMMON_ALLERGIES.map((allergy) => (
                <label key={allergy}>
                  <input
                    type="checkbox"
                    value={allergy}
                    checked={formData.allergies.includes(allergy)}
                    onChange={(e) => handleCheckboxGroupChange(e, 'allergies')}
                  />
                  {allergy}
                </label>
              ))}
            </div>
            <label>
              Other:
              <input
                type="text"
                name="otherAllergy"
                value={formData.otherAllergy}
                onChange={handleFormChange}
                placeholder="e.g. certain fruits"
              />
            </label>
            <br />

            <label>Intolerances:</label>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {COMMON_INTOLERANCES.map((intolerance) => (
                <label key={intolerance}>
                  <input
                    type="checkbox"
                    value={intolerance}
                    checked={formData.intolerances.includes(intolerance)}
                    onChange={(e) => handleCheckboxGroupChange(e, 'intolerances')}
                  />
                  {intolerance}
                </label>
              ))}
            </div>
            <label>
              Other:
              <input
                type="text"
                name="otherIntolerance"
                value={formData.otherIntolerance}
                onChange={handleFormChange}
                placeholder="e.g. spicy foods"
              />
            </label>
            <br />

            <label>
              Religious Dietary Restrictions:
              <select
                name="religiousRestrictions"
                value={formData.religiousRestrictions}
                onChange={handleFormChange}
              >
                {RELIGIOUS_RESTRICTIONS.map((rr) => (
                  <option key={rr} value={rr}>
                    {rr}
                  </option>
                ))}
              </select>
            </label>
            <br />

            <button onClick={() => handleStepChange(step - 1)}>Back</button>
            <button onClick={() => handleStepChange(step + 1)}>Next</button>
          </div>
        );

      case 6:
        // Budget (final page)
        return (
          <div>
            <h2>Budget</h2>
            <label>
              How much can you spend on groceries per week? (USD)
              <input
                name="budget"
                type="number"
                step="0.01"
                value={formData.budget}
                onChange={handleFormChange}
                placeholder="e.g. 100.00"
              />
            </label>
            <br />
            <button onClick={() => handleStepChange(step - 1)}>Back</button>
            <button onClick={handleSubmit}>Submit</button>
          </div>
        );

      default:
        return null;
    }
  };

  const RenderTabs = ({ data }) => {
    const tabs = ['Meal Plan', 'Nutritional Info', 'Shopping List', 'Recipes'];
    const [activeTab, setActiveTab] = useState(tabs[0]);

    return (
      <div>
        <div className="tabs">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={activeTab === tab ? 'active' : ''}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="tab-content">
          {activeTab === 'Meal Plan' && (
            <div>
              <h3>Meal Plan</h3>
              {Object.entries(data.meal_plan).map(([day, meals]) => (
                <div key={day}>
                  <h4>{day}</h4>
                  <table>
                    <thead>
                      <tr>
                        {Object.keys(meals).map((meal) => (
                          <th key={meal}>{meal}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        {Object.values(meals).map((mealItem, idx) => (
                          <td key={idx}>{mealItem}</td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          )}
          {activeTab === 'Nutritional Info' && (
            <div>
              <h3>Nutritional Information</h3>
              {Object.entries(data.nutritional_info).map(([day, meals]) => (
                <div key={day}>
                  <h4>{day}</h4>
                  <table>
                    <thead>
                      <tr>
                        <th>Meal</th>
                        <th>Calories (kcal)</th>
                        <th>Protein (g)</th>
                        <th>Carbs (g)</th>
                        <th>Fat (g)</th>
                        <th>Sodium (mg)</th>
                        <th>Fiber (g)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(meals).map(([meal, info]) => (
                        <tr key={meal}>
                          <td>{meal}</td>
                          <td>{info.Calories}</td>
                          <td>{info.Protein}</td>
                          <td>{info.Carbs}</td>
                          <td>{info.Fat}</td>
                          <td>{info.Sodium}</td>
                          <td>{info.Fiber}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          )}
          {activeTab === 'Shopping List' && (
            <div>
              <h3>Shopping List</h3>
              <ul>
                {data.shopping_list.map((item, idx) => (
                  <li key={idx}>
                    {item.ingredient} – {item.quantity}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {activeTab === 'Recipes' && (
            <div>
              <h3>Recipes</h3>
              {Object.entries(data.recipes).map(([recipe, instructions]) => (
                <div key={recipe}>
                  <h4>{recipe}</h4>
                  <p>{instructions}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="meal-prep-app">
      <h1>Meal Prep Application</h1>
      {loading && <p>Loading...</p>}
      {!responseData ? renderStep() : <RenderTabs data={responseData} />}
    </div>
  );
};

export default MealPrepApp;
