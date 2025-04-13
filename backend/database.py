from pymongo import MongoClient


# MongoDB setup
client = MongoClient("mongodb://localhost:27017")
db = client["mental_health"]
moods_collection = db["moods"]
users_collection = db["users"]
journals_collection = db["journals"]