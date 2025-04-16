import asyncio
import httpx 
from livekit import rtc
from emotion_tracker import users_collection
from database import db, client

async def get_livekit_token(user_id: str):
    url = "http://localhost:8000/get-token"
    payload = {"user_id": user_id}
    
    async with httpx.AsyncClient() as client:
        response = await client.post(url, json=payload)
        if response.status_code == 200:
            token_data = response.json()
            return token_data['token']  # This is the JWT_TOKEN
        else:
            raise Exception(f"Failed to fetch token: {response.text}")

# Async function to join the room
async def join_room(livekit_url: str, jwt_token: str):
    room = await rtc.connect(
        url=livekit_url,
        token=jwt_token
    )
    print("Connected to room:", room.name)

# Function to retrieve user data from MongoDB
def get_user_id_from_mongo(username: str):
    user = users_collection.find_one({"username": username})
    if user:
        return str(user["_id"])
    else:
        raise Exception("User not found")

# Main script
if __name__ == "__main__":
    username = "testuser"
    user_id = get_user_id_from_mongo(username)

    livekit_url = "wss://mental-wellbeing-zld92qzq.livekit.cloud"

    # Fetch the token asynchronously and join the room
    async def main():
        jwt_token = await get_livekit_token(user_id)
        await join_room(livekit_url, jwt_token)  # Use the JWT_TOKEN to join the LiveKit room

    asyncio.run(main())