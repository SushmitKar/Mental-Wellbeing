from fastapi import APIRouter, HTTPException
from database import messages_collection
from dotenv import load_dotenv
import os
import smtplib
from email.message import EmailMessage
from apimodels import ContactRequest

load_dotenv()
router = APIRouter()

therapist_emails = {
    "therapist1": "therapist1@example.com",
    "therapist2": "therapist2@example.com",
    "therapist3": "therapist3@example.com",
}

@router.post("/contact-professional")
async def contact_professional(data: ContactRequest):
    # Store in MongoDB
    messages_collection.insert_one(data.model_dump())

    # Send Email
    therapist_email = therapist_emails.get(data.therapistId)
    if not therapist_email:
        raise HTTPException(status_code=404, detail="Therapist not found.")

    msg = EmailMessage()
    msg["Subject"] = f"New Message from {data.name}"
    msg["From"] = os.getenv("SMTP_USERNAME")
    msg["To"] = therapist_email
    msg.set_content(f"""
    You received a message from {data.name} ({data.email}):

    {data.message}
    """)

    try:
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as smtp:
            smtp.login(os.getenv("SMTP_USERNAME"), os.getenv("SMTP_PASSWORD"))
            smtp.send_message(msg)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Email send failed: {str(e)}")

    return {"message": "Message sent and saved successfully!"}