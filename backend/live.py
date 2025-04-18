from fastapi import APIRouter, HTTPException
from dotenv import load_dotenv
from livekit import api
from apimodels import TokenRequest
import os
import uuid

load_dotenv()

router = APIRouter()

LIVEKIT_API_KEY = os.getenv("LIVEKIT_API_KEY")
LIVEKIT_API_SECRET = os.getenv("LIVEKIT_API_SECRET")

if not LIVEKIT_API_KEY or not LIVEKIT_API_SECRET:
    raise HTTPException(status_code=500, detail="Missing LiveKit API credentials.")

@router.post("/create-token")
async def create_token(req: TokenRequest):
    try:
        # If room name isn't provided, generate a unique one
        room_name = req.room_name or f"appointment_{str(uuid.uuid4())[:8]}"

        # Create a VideoGrant for this room
        grant = api.VideoGrant(room_join=True, room=room_name)

        # Generate access token
        token = api.AccessToken(
            LIVEKIT_API_KEY,
            LIVEKIT_API_SECRET,
            identity=req.user_id,  # this is unique per user
            name=req.user_id       # optional, for display name
        )
        token.add_grant(grant)

        return {
            "token": token.to_jwt(),
            "room": room_name
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))