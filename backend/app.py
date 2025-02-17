# backend/app.py

from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os
from openai import OpenAI  # pip install openai

app = Flask(__name__)
CORS(app)

@app.route('/api/mealplan', methods=['POST'])
def generate_meal_plan():
    print("Received request for meal plan generation")
    api_key = os.getenv('OPENAI_API_KEY')
    client = OpenAI(api_key=api_key)
    
    data = request.json
    print("Extracted JSON data from request:", data)
    
    prompt = f"""
You are an expert dietitian. I need you to generate a meal plan for individuals based on:

1) Initial Consultation
   - Gather age, sex, weight, height, pregnancy/breastfeeding status
   - Medical conditions including dyslipidemia, hypertension, cardiovascular disease, chronic kidney disease (with eGFR + dialysis info)
   - Physical activity level
   - BMI calculation and WHO classification for obesity
   - If CKD, gather eGFR/dialysis info
   - Dietary goals, e.g. lose weight, improve glucose control, etc.

2) Nutritional Needs Analysis
   - Use DRI-based calculations for calories/macros
   - Adjust for obesity, hypertension, CVD, T2D, CKD, etc.
   - Use evidence-based dietary guidelines

3) Additional details:
   - Type 2 Diabetes: focus on MNT, healthy eating patterns, limit saturated fats, reduce added sugar, etc.
   - CKD: limit protein as recommended, limit sodium, possibly increase or moderate potassium, etc.
   - Hypertension: consider DASH diet, limit sodium, encourage potassium (unless contraindicated), watch alcohol
   - Dyslipidemia: reduce saturated fats, encourage fiber, unsaturated fats, consider TG-lowering steps
   - CVD: heart-healthy diet (fruits, vegetables, whole grains, fish, etc.), limit saturated fats, sodium
   - Obesity: create a 500–750 kcal/day deficit, or tailor to user’s needs

4) Food Preference Assessment
   - Time available to cook
   - Foods liked/disliked
   - Number of meal-plan days
   - Number of snacks
   - Servings/people
   - Breakfast/lunch/dinner preferences (batch, leftovers, daily fresh)
   - Budget

5) Dietary Restrictions
   - Allergies, intolerances, religious restrictions

6) Data Integrity
   - If uncertain, do not guess

7) Output Format
   - Provide a meal plan with daily schedule: Breakfast, (Snacks if applicable), Lunch, Dinner
   - Provide a table of nutritional info for each meal with the exact capitalized keys:
       "Calories", "Protein", "Carbs", "Fat", "Sodium", "Fiber"
     Also provide total daily nutrition with those same keys.
   - Provide recipes (PDF style explanation, but text is sufficient), explained simply
   - Provide a grocery shopping list as an array of objects, each object containing:
       "ingredient" (string), "quantity" (string)
   - MUST respond in valid JSON with exactly these keys:
       "meal_plan"
       "nutritional_info"
       "shopping_list"
       "recipes"
8) Additional Recommendation:
1- 
2-
Use Python for your calculations.
NOTE: If you don’t have enough info, state so rather than guessing.

Below is the patient's data in JSON form:
{json.dumps(data, indent=2)}

REMEMBER: Return only valid JSON with the keys:
- "meal_plan"
- "nutritional_info"
- "shopping_list"
- "recipes"

And no other keys.
"""


    print("Generated prompt for OpenAI API")
    
    try:
        response = client.chat.completions.create(
            model="o3-mini",
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        )
        
        print("Received response from OpenAI API")

        raw_answer = response.choices[0].message.content.strip()
        print("Raw response received:", raw_answer[:500], "...")  # Print first 500 characters for debugging
        
        with open("output.txt", "w", encoding="utf-8") as output:
            output.write(raw_answer)

        print("Saved raw response to output.txt")

        parsed_response = json.loads(raw_answer)
        print("Successfully parsed JSON response")

        return jsonify(parsed_response), 200

    except json.JSONDecodeError as e:
        print("Error parsing JSON from OpenAI:", e)
        print("Raw response:", raw_answer)
        return jsonify({
            "error": "The AI response was not valid JSON. Please try again."
        }), 500

    except Exception as e:
        print("Error calling OpenAI:", e)
        return jsonify({
            "error": str(e)
        }), 500

if __name__ == '__main__':
    print("Starting Flask app...")
    app.run(debug=True)