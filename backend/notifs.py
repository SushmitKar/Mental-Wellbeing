from fastapi import APIRouter, HTTPException, Depends, Request
from pydantic import BaseModel
from pymongo import MongoClient
from bson.objectid import ObjectId
from apimodels import SettingsUpdate
from database import client, users_collection, db
from bson.objectid import ObjectId

router = APIRouter()

@router.get("/user/settings/email-notifications/{user_id}")
def get_email_notifications(user_id: str):
    user = users_collection.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {"value": user.get("emailNotifications", False)}

@router.post("/user/settings/update")
def update_user_settings(data: SettingsUpdate):
    update_result = users_collection.update_one(
        {"_id": ObjectId(data.user_id)},
        {"$set": {data.setting: data.value}}
    )

    if update_result.modified_count == 0:
        raise HTTPException(status_code=400, detail="Setting not updated")
    
    return {"message": f"{data.setting} updated successfully"}
