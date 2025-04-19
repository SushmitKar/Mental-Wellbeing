from fastapi import APIRouter, HTTPException, Depends
from datetime import datetime, timedelta
from database import users_collection
from bson import ObjectId
from typing import List, Optional
import math

router = APIRouter()

# XP thresholds for each level
XP_PER_LEVEL = 100

# XP rewards for different actions
XP_REWARDS = {
    "mood_check": 10,
    "journal_entry": 20,
    "therapy_session": 50,
    "quest_complete": 30,
    "streak_milestone": 25
}

# Badge definitions
BADGES = {
    "first_mood": {"name": "First Mood", "description": "Check in your first mood", "icon": "🎭"},
    "mood_master": {"name": "Mood Master", "description": "Check in 10 moods", "icon": "🌟"},
    "journal_starter": {"name": "Journal Starter", "description": "Write your first journal entry", "icon": "📝"},
    "therapy_hero": {"name": "Therapy Hero", "description": "Attend 5 therapy sessions", "icon": "🦸"},
    "streak_3": {"name": "3 Day Streak", "description": "Maintain a 3-day streak", "icon": "🔥"},
    "streak_7": {"name": "Weekly Warrior", "description": "Maintain a 7-day streak", "icon": "🏆"},
    "level_5": {"name": "Level 5 Achieved", "description": "Reach level 5", "icon": "⭐"},
}

@router.post("/xp/award")
async def award_xp(user_id: str, action: str):
    try:
        if action not in XP_REWARDS:
            raise HTTPException(status_code=400, detail="Invalid action")

        xp_amount = XP_REWARDS[action]
        user = users_collection.find_one({"_id": ObjectId(user_id)})
        
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        current_xp = user.get("xp", 0)
        current_level = user.get("level", 1)
        
        # Calculate new XP and level
        new_xp = current_xp + xp_amount
        new_level = math.floor(new_xp / XP_PER_LEVEL) + 1
        
        # Update user document
        update_data = {
            "xp": new_xp,
            "level": new_level,
            "last_action_date": datetime.utcnow()
        }
        
        # Check for level-up badge
        if new_level > current_level and new_level >= 5:
            badges = user.get("badges", [])
            if "level_5" not in badges:
                badges.append("level_5")
                update_data["badges"] = badges

        users_collection.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": update_data}
        )

        return {
            "new_xp": new_xp,
            "new_level": new_level,
            "xp_gained": xp_amount,
            "leveled_up": new_level > current_level
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/badges/{user_id}")
async def get_badges(user_id: str):
    try:
        user = users_collection.find_one({"_id": ObjectId(user_id)})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        user_badges = user.get("badges", [])
        return {
            "badges": [BADGES[badge] for badge in user_badges if badge in BADGES]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/badges/award")
async def award_badge(user_id: str, badge_id: str):
    try:
        if badge_id not in BADGES:
            raise HTTPException(status_code=400, detail="Invalid badge")

        result = users_collection.update_one(
            {"_id": ObjectId(user_id)},
            {"$addToSet": {"badges": badge_id}}
        )

        if result.modified_count == 0:
            return {"message": "Badge already awarded or user not found"}

        return {"message": f"Badge {BADGES[badge_id]['name']} awarded successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/leaderboard")
async def get_leaderboard(limit: int = 10, user_id: Optional[str] = None):
    try:
        # Get users who haven't opted out of leaderboard
        pipeline = [
            {"$match": {"leaderboard_opt_out": {"$ne": True}}},
            {"$sort": {"xp": -1}},
            {"$limit": limit},
            {"$project": {
                "name": 1,
                "xp": 1,
                "level": 1,
                "badges": 1
            }}
        ]
        
        leaderboard = list(users_collection.aggregate(pipeline))
        
        # If user_id is provided, get their rank
        user_rank = None
        if user_id:
            user = users_collection.find_one({"_id": ObjectId(user_id)})
            if user and not user.get("leaderboard_opt_out"):
                higher_xp = users_collection.count_documents({
                    "xp": {"$gt": user.get("xp", 0)},
                    "leaderboard_opt_out": {"$ne": True}
                })
                user_rank = higher_xp + 1

        return {
            "leaderboard": leaderboard,
            "user_rank": user_rank
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/leaderboard/opt-out")
async def toggle_leaderboard_opt_out(user_id: str, opt_out: bool):
    try:
        result = users_collection.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": {"leaderboard_opt_out": opt_out}}
        )
        
        if result.modified_count == 0:
            raise HTTPException(status_code=404, detail="User not found")
            
        return {"message": f"Leaderboard opt-out set to {opt_out}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
