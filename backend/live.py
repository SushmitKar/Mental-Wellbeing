from fastapi import APIRouter, HTTPException
from dotenv import load_dotenv
from pymongo import MongoClient
from livekit import api
from database import users_collection
from apimodels import TokenRequest
import os

load_dotenv()

router = APIRouter()

LIVEKIT_API_KEY = os.getenv("LIVEKIT_API_KEY")
LIVEKIT_API_SECRET = os.getenv("LIVEKIT_API_SECRET")

@router.post("/get-token")
async def get_livekit_token(payload: TokenRequest):
    # Fetch user from the database
    user = users_collection.find_one({"_id": payload.user_id})  # Use ObjectId if necessary

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Create a dynamic room name based on the user or session
    room_name = f"appointment-{payload.user_id}"

    # Create an AccessToken object with the necessary credentials
    token = api.AccessToken(
        api_key=LIVEKIT_API_KEY,
        api_secret=LIVEKIT_API_SECRET,
        identity=str(user["_id"]),
        name=user.get("name", "MindHub User")
    )
    
    # Grant video permissions for the dynamic room
    token.with_grants(api.VideoGrant(room_join=True, room=room_name))

    # Generate the JWT token
    jwt = token.to_jwt()

    return {"token": jwt, "room": room_name}  # Return the room name as well