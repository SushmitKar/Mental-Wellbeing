from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from pydantic import BaseModel
import bcrypt

app = FastAPI()

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = MongoClient("mongodb://localhost:27017")
db = client["mental_health"]
moods_collection = db["moods"]
users_collection = db["users"]

class UserSignup(BaseModel):
    firstName: str
    lastName: str
    email: str
    password: str

class UserSignin(BaseModel):
    email: str
    password: str

# Pydantic Model for Input Validation
class MoodRequest(BaseModel):
    mood: str

@app.get("/")  
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
def signup(user: UserSignup):
    # Check if user already exists
    if users_collection.find_one({"email": user.email}):
        raise HTTPException(status_code=400, detail="Email already registered")

    # Hash the password
    hashed_password = bcrypt.hashpw(user.password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    # Store user in DB
    users_collection.insert_one({
        "firstName": user.firstName,
        "lastName": user.lastName,
        "email": user.email,
        "password": hashed_password
    })

    return {"message": "User registered successfully"}

@app.post("/signin")
def signin(user: UserSignin):
    # Find user in DB using email instead of username
    existing_user = users_collection.find_one({"email": user.email})  

    if not existing_user:
        raise HTTPException(status_code=400, detail="Invalid email or password")

    # Verify password
    if not bcrypt.checkpw(user.password.encode("utf-8"), existing_user["password"].encode("utf-8")):
        raise HTTPException(status_code=400, detail="Invalid email or password")

    return {"message": "Login successful"}

    
    
