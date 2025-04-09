import json
import cv2
import numpy as np
import threading
import time
import mediapipe as mp
import dlib
import warnings
import os
import io
import bcrypt
from PIL import Image
from collections import Counter
from deepface import DeepFace
from concurrent.futures import ThreadPoolExecutor
from scipy.spatial import distance as dist
from datetime import datetime
from typing import Dict
from io import BytesIO

# FastAPI imports
from fastapi import FastAPI, HTTPException, File, UploadFile, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, JSONResponse, RedirectResponse
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pymongo import MongoClient
from pydantic import BaseModel
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, EmailStr
from pymongo import MongoClient
from bson.objectid import ObjectId

# JWT imports
from JWTAuth import SECRET_KEY, create_token, jwt

# Suppress Warnings
warnings.filterwarnings("ignore")

# Initialize FastAPI Application
app = FastAPI()

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB setup
client = MongoClient("mongodb://localhost:27017")
db = client["mental_health"]
moods_collection = db["moods"]
users_collection = db["users"]
journals_collection = db["journals"]

# Initialize Mediapipe Modules
mp_face_detection = mp.solutions.face_detection
mp_face_mesh = mp.solutions.face_mesh
mp_pose = mp.solutions.pose
mp_hands = mp.solutions.hands

face_detection = mp_face_detection.FaceDetection(min_detection_confidence=0.2)
face_mesh = mp_face_mesh.FaceMesh(max_num_faces=5, min_detection_confidence=0.6)
pose = mp_pose.Pose(min_detection_confidence=0.6, min_tracking_confidence=0.6)
hands = mp_hands.Hands(min_detection_confidence=0.6, min_tracking_confidence=0.6)

# OpenCV Haar Cascade (Backup)
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_alt2.xml")

# Dlib for High Precision Face Landmark Detection
DLIB_LANDMARK_PATH = "models/shape_predictor_68_face_landmarks.dat"
try:
    dlib_detector = dlib.get_frontal_face_detector()
    dlib_predictor = dlib.shape_predictor(DLIB_LANDMARK_PATH)
except Exception as e:
    print(f"⚠️ Dlib Error: {e}")
    dlib_detector = None
    dlib_predictor = None

# Store emotions per face in a thread-safe dictionary
emotion_data = {"faces": {}, "lock": threading.Lock()}
last_known_faces = []  # Stores last detected faces

# If No Faces Are Detected, Keep Last Known Faces for a While
NO_FACE_LIMIT = 30  # Number of frames to retain last known faces

# Thread Pool for Emotion Analysis
executor = ThreadPoolExecutor(max_workers=4)

# Gaze Tracking Variables
EYE_AR_THRESH = 0.30  # Eye aspect ratio threshold for gaze detection

# Colors for different landmarks
COLORS = {
    "eyes": (0, 255, 255),
    "mouth": (255, 0, 0),
    "face": (0, 255, 0),
    "hands": (0, 0, 255),
    "body": (255, 255, 0)
}

# Create emotion log file if it doesn't exist
if not os.path.exists("emotion_log.json"):
    with open("emotion_log.json", "w") as f:
        json.dump([], f)

# Pydantic Models for API
class UserSignup(BaseModel):
    firstName: str
    lastName: str
    email: str
    password: str

class UserSignin(BaseModel):
    email: str
    password: str

class JournalEntry(BaseModel):
    emoji: str
    text: str


class MoodRequest(BaseModel):
    mood: str

router = APIRouter()

class ProfileUpdate(BaseModel):
    user_id : str
    name : str
    email : EmailStr
    bio : str

@router.put("/update_profile")
async def update_profile(data: ProfileUpdate):
    result = users_collection.update_one(
        {"_id": ObjectId(data.user_id)},
        {"$set":{
            "name": data.name,
            "email":data.email,
            "bio":data.bio
        }}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="User not found or no changes detected")
    return {"message": "Profile updated successfully"}

# JWT Security
security = HTTPBearer()

@app.post("/journal")
def save_journal(entry: JournalEntry, credentials: HTTPAuthorizationCredentials = Depends(security)):
    user_data = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=["HS256"])
    user_id = user_data["user_id"]

    journals_collection.insert_one({
        "user_id": user_id,
        "emoji": entry.emoji,
        "text": entry.text,
        "timestamp": datetime.utcnow()
    })
    return {"message": "Journal entry saved"}

@app.get("/journal")
def get_journals(credentials: HTTPAuthorizationCredentials = Depends(security)):
    user_data = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=["HS256"])
    user_id = user_data["user_id"]

    entries = list(journals_collection.find({"user_id": user_id}, {"_id": 0}))
    return {"journal": entries}


# Helper Functions
def verify_token(credentials: HTTPAuthorizationCredentials):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

# Emotion Analysis Functions
def analyze_emotion(face_id, face_roi):
    current_time = time.time()

    with emotion_data["lock"]:
        # Ensure log list exists
        if "log" not in emotion_data:
            emotion_data["log"] = []

        emotion_data["last_update"] = current_time

    try:
        resized_face = cv2.resize(face_roi, (224, 224))
        emotion_result = DeepFace.analyze(resized_face, actions=['emotion'], enforce_detection=False, detector_backend='opencv')

        with emotion_data["lock"]:
            emotions = emotion_result[0]['emotion']
            timestamp = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime(current_time))  # Format timestamp

            # Store emotions and timestamp
            emotion_data["faces"][face_id] = emotions
            emotion_data["log"].append({"timestamp": timestamp, "emotions": emotions})

            # Print emotions with timestamp
            print(f"🕒 {timestamp} - Emotions: {emotions}")

        # Save to JSON file (thread-safe)
        with emotion_data["lock"]:
            with open("emotion_log.json", "w") as f:
                json.dump(emotion_data["log"], f, indent=4)

    except Exception as e:
        print(f"⚠️ Emotion detection error: {e}")

def analyze_emotion_ensemble(face_roi):
    models = ["VGG-Face", "ResNet50", "EfficientNetB0"]  # Using better models
    predictions = []
    
    try:
        # Convert face ROI to grayscale and resize
        face_roi = cv2.resize(face_roi, (224, 224))  # Correct for VGG-Face, ResNet, etc.
        face_roi = cv2.cvtColor(face_roi, cv2.COLOR_BGR2RGB)  # Convert to RGB
        # face_roi = np.stack((face_roi,) * 3, axis=-1)  # Convert back to 3 channels
        print(f"Shape before analyze: {face_roi.shape}")

        for model in models:
            result = DeepFace.analyze(face_roi, actions=["emotion"], enforce_detection=False, detector_backend="opencv")

            if result and len(result) > 0:
                dominant_emotion = result[0]["dominant_emotion"]
                predictions.append(dominant_emotion)

        # Get most frequent emotion from models
        if predictions:
            most_common = Counter(predictions).most_common(1)
            if most_common:
                most_common_emotion, count = most_common[0]
                return most_common_emotion
            else:
                return "Neutral"
        else:
            return "Neutral"


    except Exception as e:
        print(f"⚠ Error analyzing emotion: {e}")
        return "Neutral"

def analyze_multiple_frames(frame_list):
    emotions_list = []

    for frame in frame_list:
        try:
            # Get face ROI from frame
            rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            results = face_detection.process(rgb_frame)
            face_bboxes = []

            if results.detections:
                for detection in results.detections:
                    bboxC = detection.location_data.relative_bounding_box
                    h, w, _ = frame.shape
                    x, y, w_box, h_box = int(bboxC.xmin * w), int(bboxC.ymin * h), int(bboxC.width * w), int(bboxC.height * h)
                    face_bboxes.append((x, y, w_box, h_box))
                    break  # Only process the first detected face

            # If MediaPipe fails, use Haar Cascade
            if not face_bboxes:
                gray_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
                face_bboxes = face_cascade.detectMultiScale(gray_frame, scaleFactor=1.1, minNeighbors=4, minSize=(50, 50))

            if face_bboxes:
                x, y, w_box, h_box = face_bboxes[0]
                face_roi = frame[y:y + h_box, x:x + w_box]
                if face_roi.size > 0:
                    dominant_emotion = analyze_emotion_ensemble(face_roi)
                    emotions_list.append(dominant_emotion)
        except Exception as e:
            print(f"⚠ Error analyzing frame: {e}")
            continue

    # Get most frequent emotion from frames
    if emotions_list:
        most_common = Counter(emotions_list).most_common(1)
        print(f"Most common result: {most_common}")
        
        if most_common: 
            most_common_emotion, count = most_common[0]
            print(f"Unpacked Emotion: {most_common_emotion}, Count: {count}")
            return most_common_emotion
        else:
            return "Neutral"
    else:
        return "Neutral"
    
# Gaze Tracking Functions
def eye_aspect_ratio(eye):
    # Compute the Euclidean distances between the two sets of vertical eye landmarks
    A = dist.euclidean(eye[1], eye[5])
    B = dist.euclidean(eye[2], eye[4])
    # Compute the Euclidean distance between the horizontal eye landmarks
    C = dist.euclidean(eye[0], eye[3])
    # Compute the eye aspect ratio
    ear = (A + B) / (2.0 * C)
    return ear

def draw_gaze(frame, mesh_results):
    if mesh_results.multi_face_landmarks:
        for face_landmarks in mesh_results.multi_face_landmarks:
            landmarks = face_landmarks.landmark
            # Extract left and right eye landmarks
            left_eye = [(landmarks[33].x, landmarks[33].y), (landmarks[160].x, landmarks[160].y),
                        (landmarks[158].x, landmarks[158].y), (landmarks[133].x, landmarks[133].y),
                        (landmarks[153].x, landmarks[153].y), (landmarks[144].x, landmarks[144].y)]
            right_eye = [(landmarks[362].x, landmarks[362].y), (landmarks[385].x, landmarks[385].y),
                         (landmarks[387].x, landmarks[387].y), (landmarks[263].x, landmarks[263].y),
                         (landmarks[373].x, landmarks[373].y), (landmarks[380].x, landmarks[380].y)]
            # Convert to pixel coordinates
            left_eye = [(int(l[0] * frame.shape[1]), int(l[1] * frame.shape[0])) for l in left_eye]
            right_eye = [(int(r[0] * frame.shape[1]), int(r[1] * frame.shape[0])) for r in right_eye]
            # Draw eyes
            for (x, y) in left_eye + right_eye:
                cv2.circle(frame, (x, y), 2, COLORS["eyes"], -1)
            # Calculate eye aspect ratio
            left_ear = eye_aspect_ratio(left_eye)
            right_ear = eye_aspect_ratio(right_eye)
            ear = (left_ear + right_ear) / 2.0
            # Display gaze direction
            if ear < EYE_AR_THRESH:
                cv2.putText(frame, "Looking forward", (10, 100), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
            else:
                cv2.putText(frame, "Looking away", (10, 100), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)

# Visualization Functions
def draw_face_mesh(frame, mesh_results):
    if mesh_results.multi_face_landmarks:
        for face_landmarks in mesh_results.multi_face_landmarks:
            for landmark in face_landmarks.landmark:
                x_l, y_l = int(landmark.x * frame.shape[1]), int(landmark.y * frame.shape[0])
                cv2.circle(frame, (x_l, y_l), 1, COLORS["face"], -1)

def draw_body_landmarks(frame, pose_results):
    if pose_results.pose_landmarks:
        for landmark in pose_results.pose_landmarks.landmark:
            x_b, y_b = int(landmark.x * frame.shape[1]), int(landmark.y * frame.shape[0])
            cv2.circle(frame, (x_b, y_b), 5, COLORS["body"], -1)

def draw_hand_landmarks(frame, hand_results):
    if hand_results.multi_hand_landmarks:
        for hand_landmarks in hand_results.multi_hand_landmarks:
            for landmark in hand_landmarks.landmark:
                x_h, y_h = int(landmark.x * frame.shape[1]), int(landmark.y * frame.shape[0])
                cv2.circle(frame, (x_h, y_h), 5, COLORS["hands"], -1)

# Video Streaming Functions
def generate_frames():
    cap = cv2.VideoCapture(0, cv2.CAP_DSHOW)
    if not cap.isOpened():
        raise HTTPException(status_code=500, detail="❌ Camera not detected")

    cap.set(cv2.CAP_PROP_FRAME_WIDTH, 1280)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 720)

    # Variables for FPS calculation
    fps = 0
    frame_count = 0
    start_time = time.time()
    frame_skip = 3  # Optimized FPS
    no_face_counter = 0
    last_known_faces = []

    frame_buffer = []
    FRAME_BATCH_SIZE = 5

    try:
        while True:
            ret, frame = cap.read()
            if not ret:
                print("❌ Frame not captured. Retrying...")
                continue

            frame = cv2.flip(frame, 1)  # Flip the frame horizontally
            frame_count += 1
            rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            gray_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

            # Face Detection
            results = face_detection.process(rgb_frame)
            face_bboxes = []

            if results.detections:
                for detection in results.detections:
                    bboxC = detection.location_data.relative_bounding_box
                    h, w, _ = frame.shape
                    x, y, w_box, h_box = int(bboxC.xmin * w), int(bboxC.ymin * h), int(bboxC.width * w), int(bboxC.height * h)
                    face_bboxes.append((x, y, w_box, h_box))
                    break  # Only process the first detected face

            # If Mediapipe Fails, Use Haar Cascade
            if not face_bboxes:
                face_bboxes = face_cascade.detectMultiScale(gray_frame, scaleFactor=1.1, minNeighbors=4, minSize=(50, 50))

            # If Still No Face, Use Last Known Position
            if not face_bboxes:
                face_bboxes = last_known_faces

            # Store Last Known Face Positions
            if face_bboxes:
                last_known_faces = face_bboxes  # Update last known faces
                no_face_counter = 0  # Reset counter
            else:
                no_face_counter += 1  # Increase the counter
                if no_face_counter < NO_FACE_LIMIT:
                    face_bboxes = last_known_faces  # Use last known positions

            # Face Mesh
            mesh_results = face_mesh.process(rgb_frame)

            # Body & Hand Detection
            pose_results = pose.process(rgb_frame)
            hand_results = hands.process(rgb_frame)

            # Process Only the First Face
            if frame_count % frame_skip == 0 and face_bboxes:
                x, y, w_box, h_box = face_bboxes[0]
                face_roi = frame[y:y + h_box, x:x + w_box]
                if face_roi.size > 0:
                    executor.submit(analyze_emotion, 0, face_roi)
            
            # Store frame for batch processing
            frame_buffer.append(frame.copy())
            if len(frame_buffer) >= FRAME_BATCH_SIZE:
                # Analyze emotions from multiple frames in background
                executor.submit(analyze_multiple_frames, frame_buffer)
                frame_buffer = []

            # Draw Face Boxes & Emotions
            with emotion_data["lock"]:
                detected_faces = emotion_data["faces"]

                for i, (x, y, w_box, h_box) in enumerate(face_bboxes):
                    if i == 0:  # Only process the first face
                        cv2.rectangle(frame, (x, y), (x + w_box, y + h_box), COLORS["face"], 2)

                        # Draw Face Mesh
                        draw_face_mesh(frame, mesh_results)

                        # Display Emotions
                        if i in detected_faces:
                            emotions = detected_faces[i]
                            text_x = x + w_box + 10
                            text_y = y + 20
                            for emotion, confidence in emotions.items():
                                text = f"{emotion.upper()}: {round(confidence, 2)}%"
                                cv2.putText(frame, text, (text_x, text_y), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 255), 2)
                                text_y += 25

            # Draw Gaze Direction
            draw_gaze(frame, mesh_results)

            # Draw Body Landmarks
            draw_body_landmarks(frame, pose_results)

            # Draw Hand Landmarks
            draw_hand_landmarks(frame, hand_results)

            # Display FPS
            elapsed_time = time.time() - start_time
            fps = round(frame_count / elapsed_time, 2)
            cv2.putText(frame, f"FPS: {fps}", (20, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 255), 2)

            # Encode and yield the frame
            _, buffer = cv2.imencode(".jpg", frame)
            frame_bytes = buffer.tobytes()
            yield (b"--frame\r\n" b"Content-Type: image/jpeg\r\n\r\n" + frame_bytes + b"\r\n")

    except Exception as e:
        print(f"Error in video streaming: {e}")
        if 'cap' in locals():
            cap.release()

# API Endpoints
@app.get("/")
def read_root():
    return {"message": ""}

@app.get("/webcam")
def webcam_feed():
    return StreamingResponse(generate_frames(), media_type="multipart/x-mixed-replace; boundary=frame")

@app.get("/emotion_data")
def get_emotion_data() -> Dict:
    with emotion_data["lock"]:
        if "faces" in emotion_data and 0 in emotion_data["faces"]:
            return {"emotions": emotion_data["faces"][0]}
        return {"emotions": {}}

@app.get("/emotion_history")
def get_emotion_history():
    try:
        with open("emotion_log.json", "r") as f:
            log_data = json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        log_data = []
    return {"history": log_data}

@app.get("/stop_webcam")
def stop_webcam():
    cv2.destroyAllWindows()
    return {"message": "Webcam stopped successfully"}

@app.post("/mood_detect")
def detect_mood(file: UploadFile = File(...), credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        # Read image and preprocess
        contents = file.file.read()
        nparr = np.frombuffer(contents, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        # Get face ROI
        rgb_img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        results = face_detection.process(rgb_img)
        face_roi = img
        
        if results.detections:
            detection = results.detections[0]  # Use the first face
            bboxC = detection.location_data.relative_bounding_box
            h, w, _ = img.shape
            x, y, w_box, h_box = int(bboxC.xmin * w), int(bboxC.ymin * h), int(bboxC.width * w), int(bboxC.height * h)
            face_roi = img[y:y + h_box, x:x + w_box]
        
        # Perform emotion detection
        emotion = analyze_emotion_ensemble(face_roi)

        # Decode JWT to get user ID
        token_data = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=["HS256"])
        user_id = token_data["user_id"]

        # Save mood history
        moods_collection.insert_one({
            "user_id": user_id,
            "mood": emotion,
            "timestamp": datetime.utcnow()
        })

        return {"mood": emotion}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing mood: {str(e)}")

@app.post("/mood")
def save_mood(mood_data: MoodRequest, credentials: HTTPAuthorizationCredentials = Depends(security)):
    payload = verify_token(credentials)
    user_id = payload["user_id"]

    try:
        moods_collection.insert_one({
            "user_id": user_id,
            'mood': mood_data.mood,
            'timestamp': datetime.now()
        })
        return {"message": "Mood saved successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database Error: {str(e)}")

@app.get("/mood_history")
def get_mood_history(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token_data = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=["HS256"])
    user_id = token_data["user_id"]

    history = list(moods_collection.find({"user_id": user_id}, {"_id": 0, "timestamp": 1, "mood": 1}).sort('timestamp',-1))

    for item in history:
        item['timestamp'] = item['timestamp'].isoformat()

    return {"history": history}

@app.post("/signup")
def signup(user: UserSignup):
    email = user.email.lower()
    if users_collection.find_one({"email": email}):
        raise HTTPException(status_code=400, detail="Email already registered")

    # Hash the password
    hashed_password = bcrypt.hashpw(user.password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    # Store user in DB
    users_collection.insert_one({
        "firstName": user.firstName,
        "lastName": user.lastName,
        "email": email,
        "password": hashed_password
    })

    return {"message": "User registered successfully"}

@app.post("/signin")
def signin(user: UserSignin):
    # Convert email to lowercase before querying
    existing_user = users_collection.find_one({"email": user.email.lower()})

    if not existing_user:
        raise HTTPException(status_code=400, detail="Invalid email or password")

    # Verify password correctly
    if not bcrypt.checkpw(user.password.encode("utf-8"), existing_user["password"].encode("utf-8")):
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

# Function to compute average emotions
def compute_average_emotions():
    try:
        with open("emotion_log.json", "r") as f:
            log_data = json.load(f)

        if log_data:
            emotion_sums = {}
            emotion_counts = {}
            
            for entry in log_data:
                for emotion, confidence in entry["emotions"].items():
                    if emotion in emotion_sums:
                        emotion_sums[emotion] += confidence
                        emotion_counts[emotion] += 1
                    else:
                        emotion_sums[emotion] = confidence
                        emotion_counts[emotion] = 1

            average_emotions = {emotion: round(emotion_sums[emotion] / emotion_counts[emotion], 2) for emotion in emotion_sums}
            print("\n📊 **Average Detected Emotions:**")
            for emotion, avg_confidence in average_emotions.items():
                print(f"  {emotion.upper()}: {avg_confidence}%")
            return average_emotions
        else:
            print("⚠️ No emotion data recorded.")
            return {}
    except Exception as e:
        print(f"Error computing average emotions: {e}")
        return {}

@app.get("/average_emotions")
def get_average_emotions():
    return {"average_emotions": compute_average_emotions()}

# Add shutdown event handler
@app.on_event("shutdown")
async def shutdown_event():
    print("Shutting down application...")
    compute_average_emotions()
    executor.shutdown()
    cv2.destroyAllWindows()