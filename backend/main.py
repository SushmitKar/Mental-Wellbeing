from fastapi import FastAPI
from pymongo import MongoClient

app = FastAPI()

client = MongoClient("mongodb://localhost:27017")
db = client["mental_health"]
moods_collection = db["moods"]

@app.post("/mood")
def save_mood(mood: str):
    moods_collection.insert_one({"mood": mood})
    return {"message": "Mood saved successfully"}
