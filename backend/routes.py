import os
from fastapi import APIRouter, UploadFile, File, Form
from openai import OpenAI
import base64, json, requests

router = APIRouter()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
STORAGE_BUCKET = os.getenv("STORAGE_BUCKET","photos")

@router.post("/analyze")
async def analyze_kibbe(file: UploadFile = File(...), quiz_answers: str = Form(...), user_id: str = Form(...), photo_filename: str = Form(...)):
    img = await file.read()
    b64 = base64.b64encode(img).decode()
    url = f"data:image/jpeg;base64,{b64}"
    quiz = json.loads(quiz_answers)
    res = client.chat.completions.create(model="gpt-4-vision-preview", messages=[
        {"role":"system","content":"You are a Kibbe body typing expert."},
        {"role":"user","content":f"Image: {url}\nQuiz: {quiz}"}
    ])
    analysis = res.choices[0].message.content
    sty = client.chat.completions.create(model="gpt-4", messages=[
        {"role":"system","content":"You are a Kibbe style consultant."},
        {"role":"user","content":f"Based on: {analysis}, give me a style guide."}
    ]).choices[0].message.content

    # upload image
    upload_url = f"{SUPABASE_URL}/storage/v1/object/{STORAGE_BUCKET}/{user_id}/{photo_filename}"
    requests.post(upload_url, headers={"Authorization":f"Bearer {SUPABASE_KEY}"}, data=img)

    # save result
    requests.post(f"{SUPABASE_URL}/rest/v1/results",
        headers={"apikey":SUPABASE_KEY,"Authorization":f"Bearer {SUPABASE_KEY}","Content-Type":"application/json"},
        json={"user_id":user_id,"photo_url":upload_url,"quiz_answers":quiz,"gpt_result":analysis,"style_guide":sty}
    )
    return {"analysis":analysis,"style":sty}
