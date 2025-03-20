from datetime import datetime, timedelta, timezone
import jwt


#ADDING JWT TOKEN FOR AUTHENTICATION 
SECRET_KEY = "nraE1z0KE5RMrXEnx6EA"
def create_token(data: dict):
    payload = data.copy()
    payload.upload({"exp": datetime.now(timezone.utc) + timedelta(hours=24)})
    return jwt.encode(payload, SECRET_KEY, algorithm="HS256")