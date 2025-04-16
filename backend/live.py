from fastapi import APIRouter, HTTPException
from dotenv import load_dotenv
from livekit import api
from database import users_collection,appointment_collection 
from apimodels import TokenRequest
import os

load_dotenv()

router = APIRouter()

LIVEKIT_API_KEY = os.getenv("LIVEKIT_API_KEY")
LIVEKIT_API_SECRET = os.getenv("LIVEKIT_API_SECRET")

@router.post("/get-token")
async def get_livekit_token(payload: TokenRequest):
    user = users_collection.find_one({"_id": payload.user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    room_name = payload.room_name or f"appointment-{payload.user_id}"

    token = api.AccessToken(
        api_key=LIVEKIT_API_KEY,
        api_secret=LIVEKIT_API_SECRET,
        identity=str(user["_id"]),
        name=user.get("name", "MindHub User")
    )
    token.with_grants(api.VideoGrant(room_join=True, room=room_name))

    jwt = token.to_jwt()
    return {"token": jwt, "room": room_name}
