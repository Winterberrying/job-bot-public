# from transformers import pipeline
from fastapi import FastAPI, Body
from fastapi.middleware.cors import CORSMiddleware
# from linkedin_api import Linkedin
import re
import json
from pydantic import BaseModel
import google.generativeai as genai

# Initialize the summarizer model
# summarizer = pipeline("summarization")

# Authenticate using any Linkedin user account credentials
# api = Linkedin('limcerise1@gmail.com', 'Limchienhui1!')

# Open the file and read the API key
with open('api_key.txt', 'r') as file:
    api_key = file.read().strip()  # .strip() removes any extra whitespace or newline characters

genai.configure(api_key=api_key)

# Create a FastAPI instance
app = FastAPI()

# Load skills data from JSON file
with open("skills.json", "r") as file:
    skills_data = json.load(file)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins, or specify a list of domains like ["http://localhost:3000"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SummarizeRequest(BaseModel):
    description: str
    instruction: str

# @app.post("/summarize")
# async def summarize_text(text: str = Body(...)):
#     # Run the summarization pipeline
#     summary = summarizer(text, max_length=150, min_length=30, do_sample=False)
#     return {"summary": summary[0]['summary_text']}

# @app.post("/summarize")
# async def summarize_text(request: SummarizeRequest):
#     text = request.description
#     instruction = request.instruction

#     # Combine instruction and input text
#     input_text = f"{instruction}\n{text}"
    
#     # Run the summarization pipeline
#     summary = summarizer(input_text, max_length=150, min_length=30, do_sample=False)
#     print(summary[0]['summary_text'])
#     return {"summary": summary[0]['summary_text']}

@app.post("/experience")
async def extract_experience(text: str = Body(...)):
    # Define the regex pattern to match experience phrases like "5 years of experience"
    pattern = r'(\d{1,2}(?:[-+]\d{1,2})?)\+?\s*years?'
    # pattern = r'(\d{1,2}(?:[-+]\d{1,2})?)\+?\s*years?\b(?:\s+\w+)*?\s+(?:of\s+)?experience'

    # Find all matches
    matches = re.findall(pattern, text, re.IGNORECASE)
    
    # Return the experience values
    if matches:
        # If multiple matches found, return the minimum experience required
        experience_years = [match[0] for match in matches]
        return {"years_of_experience": min(experience_years)}
    else:
        return {"years_of_experience": None}  # Return None if no match found
    

@app.post("/skills")
async def parse_skills(input_text: str = Body(...)):
    all_skills = []

    # Flatten all skills into a single list
    for category in skills_data.values():
        if isinstance(category, dict):
            for subcategory in category.values():
                all_skills.extend(subcategory)
        else:
            all_skills.extend(category)

    # Convert all skills to lowercase
    all_skills = [skill.lower() for skill in all_skills]
    # print(all_skills)

    # Convert input text to lowercase
    words = input_text.split()
    word_set = set(word.lower() for word in all_skills)
    # print(word_set)
    matches = {word.strip('.,!?') for word in words if word.lower().strip('.,!?') in word_set}
    matches_list = list(matches)

    # Find matching skills in input text
    # found_skills = list({skill for skill in all_skills if re.search(r"\\b" + re.escape(skill) + r"\\b", input_text.lower())})
    # print(matches_list)

    return {"found_skills": matches_list}

# @app.post("/company")
# async def company_details(input_text: str = Body(...)):
#     profile = api.get_company(input_text)

#     with open("company_profile.json", "w") as json_file:
#         json.dump(profile, json_file, indent=4) 

#     return {"company_details": profile["description"]} 

@app.post("/summarize_two")
async def summarize_text(request: SummarizeRequest):
    text = request.description
    instruction = request.instruction

    model=genai.GenerativeModel(
      model_name="gemini-1.5-flash",
      system_instruction=instruction)
    
    response = model.generate_content(text)

    return {"summary": response.text}