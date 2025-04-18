from fastapi import APIRouter
from database import users_collection

router = APIRouter()

@router.get("/therapists")
async def get_therapists():
    therapists = users_collection.find({"role": "therapist"})
    return [
        {
            "id": str(t["_id"]),
            "firstName": t.get("firstName"),
            "lastName": t.get("lastName"),
            "email": t.get("email"),
            "photo": t.get("photo", "/default.jpg"),
            "specialization": t.get("specialization", "General"),
            "availableSlots": t.get("availableSlots", {})
        }
        for t in therapists
    ]
