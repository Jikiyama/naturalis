import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * A multi-step form that collects user info, sends it to Flask on submit, 
 * and redirects to a page showing the meal plan. 
 * 
 * The "Submit" button is locked (disabled) while waiting for the server's response.
 */

function MealPrepForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (stepId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [stepId]: value,
    }));
  };

  // The "steps" array: each object is one question (page).
  const steps = [
    {
      stepId: "dobAge",
      question: "Enter your date of birth or age:",
      type: "text",
      placeholder: "e.g. 33 or 01/01/1990",
    },
    {
      stepId: "gender",
      question: "Gender (Select one):",
      type: "radio",
      options: ["Male", "Female", "Other / Prefer not to say"],
    },
    {
      stepId: "femaleStatus",
      question: "If you are female, select current status (mutually exclusive):",
      type: "radio",
      options: [
        "Not pregnant or breastfeeding",
        "Pregnant",
        "Breastfeeding",
        "Both pregnant and breastfeeding",
      ],
    },
    {
      stepId: "weight",
      question: "Weight (in kg or lbs):",
      type: "text",
      placeholder: "e.g. 70 kg or 154 lbs",
    },
    {
      stepId: "height",
      question: "Height (in cm or inches):",
      type: "text",
      placeholder: "e.g. 170 cm or 5'7\"",
    },
    {
      stepId: "medicalConditions",
      question: "Medical Conditions (Select all that apply):",
      type: "checkbox",
      options: [
        "None",
        "Dyslipidemia",
        "Hypertension",
        "Cardiovascular Disease",
        "Chronic Kidney Disease (CKD)",
        "Type 2 Diabetes",
        "Other (please specify)",
      ],
    },
    {
      stepId: "ckdEGFR",
      question: "For individuals with CKD: eGFR range?",
      type: "radio",
      options: [
        "Greater than 90 (Stage 1)",
        "60–89 (Stage 2)",
        "30–59 (Stage 3)",
        "15–29 (Stage 4)",
        "Less than 15 (Stage 5)",
        "I don’t know",
        "Not applicable",
      ],
    },
    {
      stepId: "dialysis",
      question: "Are you on dialysis?",
      type: "radio",
      options: ["Yes", "No", "Not applicable"],
    },
    {
      stepId: "vitaminD",
      question: "Are you taking a vitamin D supplement? (Yes/No, short text):",
      type: "text",
      placeholder: "Yes, No, or maybe a short note",
    },
    {
      stepId: "doctorToldPotassium",
      question: "CKD 3-5 or dialysis: reduce potassium as told by doctor?",
      type: "radio",
      options: ["Yes", "No", "Not applicable"],
    },
    {
      stepId: "doctorToldPhosphorus",
      question: "Reduce phosphorus as told by doctor?",
      type: "radio",
      options: ["Yes", "No", "Not applicable"],
    },
    {
      stepId: "hba1c",
      question: "For diabetes: Hba1c (%), or type 'I don’t know':",
      type: "text",
      placeholder: "7.2, 8, or 'I don't know'",
    },
    {
      stepId: "sglt2",
      question: "Taking an SGLT-2 inhibitor? (Empagliflozin, etc.)",
      type: "radio",
      options: ["Yes", "No", "I don’t know"],
    },
    {
      stepId: "htnMedications",
      question: "For hypertension, are you on any of these meds? (Select all):",
      type: "checkbox",
      options: [
        "spironolactone",
        "trimethoprim-sulfamethoxazole",
        "cyclosporine",
        "tacrolimus",
        "amiloride",
        "triamterene",
        "heparin",
      ],
    },
    {
      stepId: "physicalActivity",
      question: "Physical Activity Level (Select one):",
      type: "radio",
      options: [
        "Sedentary (little to no exercise)",
        "Lightly Active",
        "Moderately Active",
        "Very Active",
        "Super Active",
      ],
    },
    {
      stepId: "sportType",
      question: "If athlete, what sport do you do?",
      type: "text",
      placeholder: "e.g. sprinting, swimming, etc.",
    },
    {
      stepId: "dietaryGoals",
      question: "Primary Dietary Goal(s): (Select one or more):",
      type: "checkbox",
      options: [
        "Weight Loss",
        "Improve Blood Pressure",
        "Improve Blood Sugar Control",
        "Improve Lipid Control",
        "Prevent Progression of Current Conditions",
        "General Health & Wellness",
      ],
    },

    // Section 2
    {
      stepId: "timeToCook",
      question: "How much time to cook each day?",
      type: "radio",
      options: ["Less than 15 minutes", "15–30 minutes", "30–60 minutes", "Over 60 minutes"],
    },
    {
      stepId: "recipeComplexity",
      question: "Preferred Recipe Complexity:",
      type: "radio",
      options: ["Quick & Simple Recipes", "Moderately Complex Recipes", "Elaborate Recipes"],
    },
    {
      stepId: "daysForMealPlan",
      question: "Which days do you want a plan for?",
      type: "checkbox",
      options: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    },
    {
      stepId: "snacksPerDay",
      question: "Number of Snacks per Day:",
      type: "radio",
      options: ["0", "1", "2", "3 or more"],
    },
    {
      stepId: "peopleCookingFor",
      question: "Number of People You’re Cooking For:",
      type: "radio",
      options: ["Just myself", "2 people", "3 people", "4 or more (please specify)"],
    },
    {
      stepId: "breakfastPref",
      question: "Breakfast Preferences:",
      type: "radio",
      options: [
        "A different breakfast every day",
        "Batch cook breakfast for 2 days",
        "Batch cook breakfast for 3 days",
        "Batch cook breakfast for 4 days",
        "Batch cook breakfast for 5 days",
      ],
    },
    {
      stepId: "lunchPref",
      question: "Lunch Preferences:",
      type: "radio",
      options: [
        "Cook fresh each day",
        "Have leftovers from previous day dinner",
        "Batch cook for lunch and dinner",
        "Batch cook for 2 lunches and 2 dinners",
        "Batch cook for 2 lunches",
        "Batch cook for 3 lunches",
      ],
    },
    {
      stepId: "dinnerPref",
      question: "Dinner Preferences:",
      type: "radio",
      options: [
        "Cook fresh each day",
        "Batch cook for dinner and next day lunch",
        "Batch cook for 2 lunches and 2 dinners",
        "Batch cook for 2 dinners",
        "Batch cook for 3 dinners",
      ],
    },
    {
      stepId: "budget",
      question: "Budget Considerations:",
      type: "radio",
      options: ["I am on a budget", "Budget is not a concern"],
    },
    {
      stepId: "foodLikes",
      question: "Food Likes (e.g. cuisines, etc.):",
      type: "text",
      placeholder: "e.g. Chinese, Italian, etc.",
    },
    {
      stepId: "ethnicCuisines",
      question: "Ethnic Cuisines (multiple if you like):",
      type: "text",
      placeholder: "American, Italian, Mexican, etc.",
    },
    {
      stepId: "foodDislikes",
      question: "Food Dislikes (any details you'd like to share?):",
      type: "text",
      placeholder: "I dislike spicy foods, mushrooms, etc.",
    },

    // Section 3
    {
      stepId: "foodAllergies",
      question: "Food Allergies or Intolerances (Select all that apply):",
      type: "checkbox",
      options: [
        "None",
        "Peanuts",
        "Dairy",
        "Gluten",
        "Soy",
        "Shellfish",
        "Other (please specify)",
      ],
    },
    {
      stepId: "religiousRestrictions",
      question: "Religious or Cultural Dietary Restrictions (Select all):",
      type: "checkbox",
      options: [
        "None",
        "Kosher",
        "Halal",
        "Vegetarian",
        "Vegan",
        "No meat on Fridays",
        "Other (please specify)",
      ],
    },
    {
      stepId: "otherRestrictions",
      question: "Other Dietary Restrictions or Preferences?",
      type: "text",
      placeholder: "None or specify details.",
    },

    // Section 4
    {
      stepId: "overallStrictness",
      question: "Overall Strictness: how strict do you want to be?",
      type: "radio",
      options: ["Very Strict", "Moderately Strict", "Flexible"],
    },
    {
      stepId: "sodiumApproach",
      question: "Gradual Sodium Reduction? (step-by-step or immediate?):",
      type: "radio",
      options: [
        "Yes, reduce sodium gradually",
        "No, prefer immediate reduction",
        "I’m not sure; I'd like advice",
      ],
    },
    {
      stepId: "calorieReduction",
      question: "Caloric Intake Reduction Preference?",
      type: "radio",
      options: [
        "Gradual Reduction (100–150 kcal/week)",
        "Immediate Reduction",
        "I’m not sure; please advise",
      ],
    },
    {
      stepId: "mealPlanFlexibility",
      question: "How much flexibility do you need in your meal plan?",
      type: "radio",
      options: [
        "Structured plan (specific targets & recipes)",
        "Guidelines but with some flexibility",
        "Very flexible day-to-day",
      ],
    },
    {
      stepId: "extraConcerns",
      question: "Any additional thoughts or concerns regarding dietary changes?",
      type: "text",
      placeholder: "e.g. 'I'm allergic to...' or 'I hate kale' etc.",
    },
  ];

  const step = steps[currentStep];

  // Handlers for navigation:
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };
  const isLastStep = currentStep === steps.length - 1;

  const handleSubmit = async () => {
    // Lock the button:
    setSubmitting(true);

    const url = "http://localhost:5000/api/mealplan";
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(answers),
      });
      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }
      const data = await response.json();
      // Once we get data, navigate to "/mealplan" 
      // and pass the JSON via state.
      navigate("/mealplan", { state: data });
    } catch (error) {
      console.error("Error while sending form data:", error);
      alert("Error submitting form. Check console for details.");
    } finally {
      // Re-enable the button in case we want to re-submit or something
      // (if in your flow you never want them to re-submit, you can omit).
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "1rem" }}>
      <h2>Question {currentStep + 1} of {steps.length}</h2>
      <p style={{ whiteSpace: "pre-wrap" }}>{step.question}</p>

      {/* Render input(s) depending on question type */}
      {step.type === "text" && (
        <textarea
          rows={4}
          style={{ width: "100%" }}
          placeholder={step.placeholder || ""}
          value={answers[step.stepId] || ""}
          onChange={(e) => handleChange(step.stepId, e.target.value)}
        />
      )}

      {step.type === "radio" && step.options && (
        step.options.map((opt) => (
          <div key={opt}>
            <label>
              <input
                type="radio"
                name={step.stepId}
                value={opt}
                checked={answers[step.stepId] === opt}
                onChange={() => handleChange(step.stepId, opt)}
              />
              {" "}{opt}
            </label>
          </div>
        ))
      )}

      {step.type === "checkbox" && step.options && (
        step.options.map((opt) => {
          const currentVal = answers[step.stepId] || [];
          const checked = currentVal.includes(opt);
          const toggleCheck = () => {
            if (checked) {
              handleChange(step.stepId, currentVal.filter((x) => x !== opt));
            } else {
              handleChange(step.stepId, [...currentVal, opt]);
            }
          };
          return (
            <div key={opt}>
              <label>
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={toggleCheck}
                />
                {" "}{opt}
              </label>
            </div>
          );
        })
      )}

      <div style={{ marginTop: "1rem" }}>
        {currentStep > 0 && (
          <button onClick={handleBack} style={{ marginRight: "0.5rem" }}>
            Back
          </button>
        )}
        {!isLastStep && (
          <button onClick={handleNext} style={{ marginRight: "0.5rem" }}>
            Next
          </button>
        )}
        {isLastStep && (
          <button onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Submitting..." : "Submit"}
          </button>
        )}
      </div>
    </div>
  );
}

export default MealPrepForm;
