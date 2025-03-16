from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from pydantic import BaseModel
import bcrypt

app = FastAPI()

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Change this if your frontend is hosted elsewhere
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB Connection
client = MongoClient("mongodb://localhost:27017")
db = client["mental_health"]
moods_collection = db["moods"]
users_collection = db["users"]

class User(BaseModel):
    username: str
    password: str
# Pydantic Model for Input Validation
class MoodRequest(BaseModel):
    mood: str

@app.get("/")  # This will fix the 404 error
def read_root():
    return {""}

@app.post("/mood")
def save_mood(mood_data: MoodRequest):
    try:
        moods_collection.insert_one({"mood": mood_data.mood})
        return {"message": "Mood saved successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database Error: {str(e)}")
    

@app.post("/signup")
def signup(user: User):
    # Check if user already exists
    if users_collection.find_one({"username": user.username}):
        raise HTTPException(status_code=400, detail="Username already taken")

    # Hash the password
    hashed_password = bcrypt.hashpw(user.password.encode('utf-8'), bcrypt.gensalt())

    # Store user in DB
    users_collection.insert_one({"username": user.username, "password": hashed_password})

    return {"message": "User registered successfully"}

@app.post("/signin")
def signin(user: User):
    # Find user in DB
    existing_user = users_collection.find_one({"username": user.username})

    if not existing_user:
        raise HTTPException(status_code=400, detail="Invalid username or password")

    # Verify password
    if not bcrypt.checkpw(user.password.encode('utf-8'), existing_user["password"]):
        raise HTTPException(status_code=400, detail="Invalid username or password")

    return {"message": "Login successful"}
    
    
