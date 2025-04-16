from pymongo import MongoClient
from dotenv import load_dotenv
import os   


load_dotenv()

# MongoDB setup
client = MongoClient(os.getenv("MONGO_URL"))
db = client["mental_health"]
moods_collection = db["moods"]
users_collection = db["users"]
journals_collection = db["journals"]
messages_collection = db["messages"]
appointment_collection = db["appointments"]