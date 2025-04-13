from datetime import datetime, timedelta, timezone
import jwt
from fastapi import HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials



#ADDING JWT TOKEN FOR AUTHENTICATION 
SECRET_KEY = "nraE1z0KE5RMrXEnx6EA"
ALGORITHM = "HS256"
security = HTTPBearer()


def create_token(data: dict):
    payload = data.copy()
    payload.update({"exp": datetime.now(timezone.utc) + timedelta(hours=24)})   
    return jwt.encode(payload, SECRET_KEY, algorithm="HS256")


def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
