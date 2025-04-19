from fastapi import APIRouter, HTTPException
from database import users_collection
from datetime import datetime
from apimodels import TherapistProfile
from bson import ObjectId

router = APIRouter()


@router.get("/therapists")
async def get_therapists():
    try:
        therapists = users_collection.find({"role": "therapist"})
        return [
            {
                "id": str(t["_id"]),
                "name": t.get("name", ""),
                "specialization": t.get("specialization", ""),
                "bio": t.get("bio", ""),
                "photoUrl": t.get("photoUrl", ""),
                "availableSlots": t.get("availableSlots", [])
            }
            for t in therapists
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/therapists/{therapist_id}/profile")
async def get_therapist_profile(therapist_id: str):
    try:
        therapist = users_collection.find_one({"_id": ObjectId(therapist_id), "role": "therapist"})
        if not therapist:
            raise HTTPException(status_code=404, detail="Therapist not found")

        return {
            "id": str(therapist["_id"]),
            "name": therapist.get("name", ""),
            "specialization": therapist.get("specialization", ""),
            "bio": therapist.get("bio", ""),
            "photoUrl": therapist.get("photoUrl", ""),
            "availableSlots": therapist.get("availableSlots", [])
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/therapists/{therapist_id}/profile")
async def update_therapist_profile(therapist_id: str, profile: TherapistProfile):
    try:
        therapist = users_collection.find_one({"_id": ObjectId(therapist_id), "role": "therapist"})
        if not therapist:
            raise HTTPException(status_code=404, detail="Therapist not found")

        update_data = {
            "name": profile.name,
            "specialization": profile.specialization,
            "bio": profile.bio,
            "photoUrl": profile.photoUrl,
            "availableSlots": profile.availableSlots,
            "updated_at": datetime.utcnow()
        }

        result = users_collection.update_one(
            {"_id": ObjectId(therapist_id)},
            {"$set": update_data}
        )

        if result.modified_count == 0:
            raise HTTPException(status_code=404, detail="No changes made or therapist not found")

        return {"message": "Profile updated successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/therapists/{therapist_id}/slots")
async def get_therapist_slots(therapist_id: str):
    try:
        therapist = users_collection.find_one({"_id": ObjectId(therapist_id), "role": "therapist"})
        if not therapist:
            raise HTTPException(status_code=404, detail="Therapist not found")

        return therapist.get("availableSlots", [])
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))