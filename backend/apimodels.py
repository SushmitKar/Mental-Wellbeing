from pydantic import BaseModel, EmailStr

# Pydantic Models for API
class UserSignup(BaseModel):
    firstName: str
    lastName: str
    email: str
    password: str

class UserSignin(BaseModel):
    email: str
    password: str

class JournalEntry(BaseModel):
    emoji: str
    text: str


class MoodRequest(BaseModel):
    mood: str


class ProfileUpdate(BaseModel):
    user_id : str
    name : str
    email : EmailStr
    bio : str


class SettingsUpdate(BaseModel):
    user_id : str
    setting : str
    value : bool

class ChangePasswordRequest(BaseModel):
    user_id: str
    current_password: str
    new_password: str

class ChangePassword(BaseModel):
    user_id: str
    current_password: str
    new_password: str