from fastapi import FastAPI, HTTPException, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from pydantic import BaseModel
import bcrypt, base64
from datetime import datetime
from JWTAuth import SECRET_KEY, create_token, jwt
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from tensorflow.keras.models import load_model  
import numpy as np
import cv2, os, io
from PIL import Image
from io import BytesIO

# Load your trained model
model_path = "C:/Users/hp/Desktop/mind/backend/Mood_Dataset_extracted/emotion_model.keras"
print(f"Path to model: {model_path}")
model = load_model(model_path)
class_labels = ['Angry', 'Disgust', 'Fear', 'Happy', 'Neutral', 'Sad', 'Surprise']



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

def preprocess_image(image_data):
    img = Image.open(BytesIO(base64.b64decode(image_data.split(",")[1])))
    img = img.resize((224, 224))
    img_array = np.array(img) / 255.0
    return np.expand_dims(img_array, axis=0)

@app.post("/predict_mood")
def predict_mood(data: dict):
    try:
        image_data = data.get("image")
        if not image_data:
            raise HTTPException(status_code=400, detail="No image data provided")
        
        # Preprocess image and predict
        processed_img = preprocess_image(image_data)
        predictions = model.predict(processed_img)
        predicted_class = np.argmax(predictions[0])
        mood = class_labels[predicted_class]

        moods_collection.insert_one({"mood": mood})        
        return {"mood": mood}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


#Protect Mood Endpoint Using JWT
def verify_token(credentials: HTTPAuthorizationCredentials):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


security = HTTPBearer()
#Allows tracking of user mood history and plotting mood trends.
@app.post("/mood")
def save_mood(mood_data: MoodRequest, user_id: str, credentials: HTTPAuthorizationCredentials = security):
    payload = verify_token(credentials)
    user_id = payload["user_id"]

    #Saving mood with associated user ID
    try:
        moods_collection.insert_one({
            "user_id": user_id,
            'mood': mood_data.mood,
            'timestamp': datetime.now()
        })
        return {"message": "Mood saved successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database Error: {str(e)}")
    

@app.get("/mood_history/{user_id}")
def get_mood_history(user_id: str):
    moods = list(
        moods_collection.find(
            {"user_id": user_id},
            {"_id": 0, "timestamp": 1, "mood": 1},
        )
    )

    return {"mood_history": moods}



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
    existing_user = users_collection.find_one({"email": user.email})  

    if not existing_user:
        raise HTTPException(status_code=400, detail="Invalid email or password")

    # Verify password
    if not existing_user or bcrypt.checkpw(user.password.encode("utf-8"), existing_user["password"].encode("utf-8")):
        raise HTTPException(status_code=400, detail="Invalid email or password")

    token = create_token({
        "user_id": str(existing_user["_id"]),
        "email": existing_user["email"]
    })

    # Return user info
    return {
        "message": "Login successful",
        "user": {
            "id": str(existing_user["_id"]),
            "firstName": existing_user["firstName"],
            "lastName": existing_user["lastName"],
            "email": existing_user["email"],
            "token": token
        }
    }