# from fastapi import APIRouter, HTTPException
# from dotenv import load_dotenv
# from livekit import api
# from apimodels import TokenRequest
# import os, uuid, traceback

# load_dotenv()

# router = APIRouter()

# LIVEKIT_API_KEY = os.getenv("LIVEKIT_API_KEY")
# LIVEKIT_API_SECRET = os.getenv("LIVEKIT_API_SECRET")

# if not LIVEKIT_API_KEY or not LIVEKIT_API_SECRET:
#     raise HTTPException(status_code=500, detail="Missing LiveKit API credentials.")

# @router.post("/create-token")
# async def create_token(req: TokenRequest):
#     try:

#         print("Request received:", req)
#         print("Using API_KEY:", LIVEKIT_API_KEY)
#         print("Using API_SECRET:", LIVEKIT_API_SECRET)
#         # If room name isn't provided, generate a unique one
#         room_name = req.room_name or f"appointment_{str(uuid.uuid4())[:8]}"
#         print("room_name: ", room_name)

#         # Create a VideoGrant for this room
#         grant = api.VideoGrant(room_join=True, room=room_name)

#         # Generate access token
#         token = api.AccessToken(
#             LIVEKIT_API_KEY,
#             LIVEKIT_API_SECRET,
#             identity=req.user_id,  # this is unique per user
#             name=req.user_id       # optional, for display name
#         )
#         token.add_grant(grant)

#         return {
#             "token": token.to_jwt(),
#             "room": room_name
#         }

#     except Exception as e:
#         print("Error creating token:", str(e))
#         traceback.print_exc()  # ← add this
#         raise HTTPException(status_code=500, detail=str(e))











from fastapi import APIRouter, HTTPException
from dotenv import load_dotenv
import os, uuid, time, jwt
from apimodels import TokenRequest
import traceback

# Load environment variables
load_dotenv()

# Initialize FastAPI router
router = APIRouter()

# Load LiveKit API credentials from environment variables
LIVEKIT_API_KEY = os.getenv("LIVEKIT_API_KEY")
LIVEKIT_API_SECRET = os.getenv("LIVEKIT_API_SECRET")

# Check if API keys exist
if not LIVEKIT_API_KEY or not LIVEKIT_API_SECRET:
    raise HTTPException(status_code=500, detail="Missing LiveKit API credentials.")

@router.post("/create-token")
async def create_token(req: TokenRequest):
    try:
        # Debugging print statements to help with troubleshooting
        print("Request received:", req)
        print("Using API_KEY:", LIVEKIT_API_KEY)
        print("Using API_SECRET:", LIVEKIT_API_SECRET)

        # If room name isn't provided, generate a unique one
        room_name = req.room_name or f"appointment_{str(uuid.uuid4())[:8]}"
        print("room_name:", room_name)

        # Token expiration time (e.g., 1 hour from now)
        exp = int(time.time()) + 3600

        # JWT Payload (structure)
        payload = {
            "jti": f"{req.user_id}-{int(time.time())}",  # Unique identifier for this token
            "iss": LIVEKIT_API_KEY,  # Issuer (LiveKit API Key)
            "sub": req.user_id,  # Subject (User ID)
            "nbf": int(time.time()),  # "Not before" time
            "exp": exp,  # Expiration time
            "video": {
                "room": room_name,
                "roomJoin": True  # Permission to join the room
            }
        }

        # Generate JWT token using pyjwt
        token = jwt.encode(payload, LIVEKIT_API_SECRET, algorithm="HS256")

        # Return token and room name
        return {
            "token": token,
            "room": room_name
        }

    except Exception as e:
        # Print error and traceback for debugging
        print("Error creating token:", str(e))
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
